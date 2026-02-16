
import { useState, useCallback, useEffect } from 'react';
import { generateStructuredPrompt, generateCompositeStructuredPrompt } from '../services/promptService';
import { optimizeUserInput } from '../services/geminiService';
import { getHistory, addHistoryItem, deleteHistoryItems, clearAllHistory } from '../repositories/historyRepository';
import { getSettings, saveSettings } from '../repositories/settingsRepository';
import { getPresets, addPreset, deletePreset } from '../repositories/presetRepository';
import { HistoryItem } from '../models/History';
import { Preset } from '../models/Preset';
import { PromptOptions, PromptMode, DetailLevel, OutputFormat } from '../models/Prompt';
import { supabase } from '../config/supabase';
import type { User } from '@supabase/supabase-js';


type ActivePanel = 'input' | 'output' | 'history';

export const usePromptGenerator = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [structuredPrompt, setStructuredPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>('input');
  const [isInputInvalid, setIsInputInvalid] = useState<boolean>(false);

  const [promptMode, setPromptMode] = useState<PromptMode>('geral');
  const [includeComments, setIncludeComments] = useState<boolean>(true);
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('detalhado');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('markdown');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryIds, setSelectedHistoryIds] = useState<string[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);

  // Profile Management State
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  
  // Auth listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  // Load data on login
  useEffect(() => {
    if (user) {
      getHistory(user.id).then(setHistory);
      getSettings(user.id).then(settings => {
        if (settings) {
          setIsAdvancedMode(settings.isAdvancedMode);
          setIncludeComments(settings.includeComments);
          setDetailLevel(settings.detailLevel);
          setOutputFormat(settings.outputFormat);
        }
      });
      getPresets(user.id).then(setPresets);
    } else {
      setHistory([]);
      setPresets([]);
    }
  }, [user]);

  // Save settings on change
  useEffect(() => {
    if (user) {
      saveSettings(user.id, { isAdvancedMode, includeComments, detailLevel, outputFormat });
    }
  }, [user, isAdvancedMode, includeComments, detailLevel, outputFormat]);

  const clearError = () => {
    setError(null);
  };

  const resetProfileMessages = () => {
    setProfileError(null);
    setProfileSuccess(null);
  };

  const updateUserProfile = async (updates: { fullName?: string; email?: string; password?: string }) => {
    resetProfileMessages();
    setProfileLoading(true);

    try {
        const { fullName, email, password } = updates;
        
        if (fullName !== undefined) {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: fullName }
            });
            if (error) throw new Error(`Erro ao atualizar nome: ${error.message}`);
        }

        if (email) {
            const { error } = await supabase.auth.updateUser({ email });
            if (error) throw new Error(`Erro ao atualizar e-mail: ${error.message}`);
            setProfileSuccess("E-mail atualizado. Verifique sua caixa de entrada (antiga e nova) para confirmação.");
            return; // Exit after email update to show message
        }

        if (password) {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw new Error(`Erro ao atualizar senha: ${error.message}`);
        }

        setProfileSuccess("Perfil atualizado com sucesso!");

    } catch (error: any) {
        setProfileError(error.message);
    } finally {
        setProfileLoading(false);
    }
  };

  const deleteUserAccount = async () => {
    resetProfileMessages();
    setProfileLoading(true);
    try {
        // IMPORTANT: This calls a Supabase RPC function `delete_user_account`
        // which must be created in your Supabase project.
        // The function should use the service_role key to delete the user from auth.users.
        // This is necessary because client-side user deletion is restricted for security.
        // The corresponding tables (History, Presets, Settings) should have
        // "ON DELETE CASCADE" on their user_id foreign keys.
        //
        // SQL for the function:
        // CREATE OR REPLACE FUNCTION delete_user_account()
        // RETURNS void
        // LANGUAGE plpgsql
        // SECURITY DEFINER
        // AS $$
        // BEGIN
        //   DELETE FROM auth.users WHERE id = auth.uid();
        // END;
        // $$;
        const { error } = await supabase.rpc('delete_user_account');
        if (error) {
            throw error;
        }
        await supabase.auth.signOut();
        // The onAuthStateChange listener will handle the rest of the UI update
    } catch (error: any) {
        setProfileError(`Erro ao deletar conta: ${error.message}`);
    } finally {
        setProfileLoading(false);
    }
  };


  const handleGeneratePrompt = useCallback(async (textToGenerate: string) => {
    if (!textToGenerate.trim()) {
      setIsInputInvalid(true);
      return;
    }
    if (!user) {
        setError("Você precisa estar logado para gerar prompts.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setIsInputInvalid(false);
    setStructuredPrompt('');
    setIsCopied(false);
    setActivePanel('output');

    const options: PromptOptions = { mode: promptMode, includeComments, detailLevel, outputFormat };

    try {
      const result = await generateStructuredPrompt(textToGenerate, isAdvancedMode, options);
      setStructuredPrompt(result);
      
      const newItemData = { userInput: textToGenerate, structuredPrompt: result, mode: promptMode };
      const newHistoryItem = await addHistoryItem(user.id, newItemData);
      if (newHistoryItem) {
        setHistory(prev => [newHistoryItem, ...prev]);
      }
    } catch (err) {
      setError('Ocorreu um erro ao gerar o prompt. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user, isAdvancedMode, promptMode, includeComments, detailLevel, outputFormat]);
  
  const handleGenerateCompositePrompt = useCallback(async () => {
    if (selectedHistoryIds.length < 2) {
      setError("Selecione ao menos dois itens para gerar um prompt composto.");
      return;
    }
    if (!user) {
        setError("Você precisa estar logado para gerar prompts.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setIsInputInvalid(false);
    setStructuredPrompt('');
    setIsCopied(false);
    setActivePanel('output');

    const selectedItems = history.filter(item => selectedHistoryIds.includes(item.id));
    const userInputs = selectedItems.map(item => item.userInput);
    const options: PromptOptions = { mode: 'geral', includeComments, detailLevel, outputFormat };

    try {
        const result = await generateCompositeStructuredPrompt(userInputs, isAdvancedMode, options);
        setStructuredPrompt(result);
        
        const newItemData = { userInput: `Prompt Composto de ${userInputs.length} itens`, structuredPrompt: result, mode: 'geral' as PromptMode };
        const newHistoryItem = await addHistoryItem(user.id, newItemData);
        if (newHistoryItem) {
            setHistory(prev => [newHistoryItem, ...prev]);
        }
    } catch (err) {
        setError('Ocorreu um erro ao gerar o prompt composto. Por favor, tente novamente.');
        console.error(err);
    } finally {
        setIsLoading(false);
        setSelectedHistoryIds([]);
    }
  }, [user, selectedHistoryIds, history, isAdvancedMode, includeComments, detailLevel, outputFormat]);

  const handleCopyToClipboard = useCallback(() => {
    if (structuredPrompt) {
      navigator.clipboard.writeText(structuredPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [structuredPrompt]);
  
  const handleOptimizeInput = useCallback(async () => {
    if (!userInput.trim()) return;
    setIsOptimizing(true);
    try {
      const optimizedText = await optimizeUserInput(userInput);
      setUserInput(optimizedText);
    } catch (err) {
      // O erro já é logado no serviço, aqui podemos opcionalmente mostrar um erro na UI
      setError("Falha ao otimizar o texto. Tente novamente.");
    } finally {
      setIsOptimizing(false);
    }
  }, [userInput]);

  const loadFromHistory = (item: HistoryItem) => {
    setUserInput(item.userInput);
    setStructuredPrompt(item.structuredPrompt);
    setPromptMode(item.mode);
    setIsInputInvalid(false);
    setActivePanel('input');
  };

  const clearHistory = async () => {
    if (!user) return;
    await clearAllHistory(user.id);
    setHistory([]);
    setSelectedHistoryIds([]);
  };
  
  const deleteHistoryItem = async (id: string) => {
    if (!user) return;
    await deleteHistoryItems(user.id, [id]);
    setHistory(prev => prev.filter(item => item.id !== id));
    setSelectedHistoryIds(prev => prev.filter(selectedId => selectedId !== id));
  };
  
  const deleteSelectedHistory = async () => {
    if (!user || selectedHistoryIds.length === 0) return;
    await deleteHistoryItems(user.id, selectedHistoryIds);
    setHistory(prev => prev.filter(item => !selectedHistoryIds.includes(item.id)));
    setSelectedHistoryIds([]);
  };

  const toggleHistorySelection = (id: string) => {
    setSelectedHistoryIds(prev => 
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const groupSelectedHistory = () => {
    if (selectedHistoryIds.length === 0) return;
    const selectedItems = history
      .filter(item => selectedHistoryIds.includes(item.id))
      .sort((a, b) => a.timestamp - b.timestamp);
    
    const combinedText = selectedItems.map(item => item.userInput).join('\n\n---\n\n');
    setUserInput(combinedText);
    setSelectedHistoryIds([]);
    setActivePanel('input');
  };

  const handleSavePreset = async (name: string) => {
    if (!user) return;
    const presetData = {
      name,
      promptMode,
      detailLevel,
      outputFormat,
      includeComments,
      isAdvancedMode,
    };
    const newPreset = await addPreset(user.id, presetData);
    if (newPreset) {
        setPresets(prev => [...prev, newPreset]);
    }
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
        setPromptMode(preset.promptMode);
        setDetailLevel(preset.detailLevel);
        setOutputFormat(preset.outputFormat);
        setIncludeComments(preset.includeComments);
        setIsAdvancedMode(preset.isAdvancedMode);
    }
  };

  const handleDeletePreset = async (presetId: string) => {
    if (!user) return;
    await deletePreset(user.id, presetId);
    setPresets(prev => prev.filter(p => p.id !== presetId));
  };

  const handleClearFields = () => {
    setUserInput('');
    setStructuredPrompt('');
    setPromptMode('geral');
    setDetailLevel('detalhado');
    setOutputFormat('markdown');
    setIncludeComments(true);
    setIsAdvancedMode(false);
    setError(null);
    setIsInputInvalid(false);
  };

  return {
    user,
    userInput, setUserInput,
    structuredPrompt,
    isLoading,
    isOptimizing,
    isAdvancedMode, setIsAdvancedMode,
    error,
    clearError,
    isCopied,
    promptMode, setPromptMode,
    includeComments, setIncludeComments,
    detailLevel, setDetailLevel,
    outputFormat, setOutputFormat,
    history,
    handleGeneratePrompt,
    handleCopyToClipboard,
    handleOptimizeInput,
    loadFromHistory,
    clearHistory,
    activePanel, setActivePanel,
    isInputInvalid, setIsInputInvalid,
    selectedHistoryIds,
    toggleHistorySelection,
    deleteHistoryItem,
    deleteSelectedHistory,
    groupSelectedHistory,
    handleGenerateCompositePrompt,
    presets,
    handleSavePreset,
    handleLoadPreset,
    handleDeletePreset,
    handleClearFields,
    // Profile Management
    profileLoading,
    profileError,
    profileSuccess,
    updateUserProfile,
    deleteUserAccount,
    resetProfileMessages,
  };
};
