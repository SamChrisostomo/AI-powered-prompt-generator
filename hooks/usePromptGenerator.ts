
import { useState, useCallback, useEffect } from 'react';
import { generateStructuredPrompt, generateCompositeStructuredPrompt } from '../services/promptService';
import { getHistory, addHistoryItem, deleteHistoryItems, clearAllHistory } from '../repositories/historyRepository';
import { getSettings, saveSettings } from '../repositories/settingsRepository';
import { HistoryItem } from '../models/History';
import { PromptOptions, PromptMode, DetailLevel, OutputFormat } from '../models/Prompt';
import { supabase } from '../config/supabase';
import type { User } from '@supabase/supabase-js';


type ActivePanel = 'input' | 'output' | 'history';

export const usePromptGenerator = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [structuredPrompt, setStructuredPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    } else {
      setHistory([]);
    }
  }, [user]);

  // Save settings on change
  useEffect(() => {
    if (user) {
      saveSettings(user.id, { isAdvancedMode, includeComments, detailLevel, outputFormat });
    }
  }, [user, isAdvancedMode, includeComments, detailLevel, outputFormat]);


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

  return {
    user,
    userInput, setUserInput,
    structuredPrompt,
    isLoading,
    isAdvancedMode, setIsAdvancedMode,
    error,
    isCopied,
    promptMode, setPromptMode,
    includeComments, setIncludeComments,
    detailLevel, setDetailLevel,
    outputFormat, setOutputFormat,
    history,
    handleGeneratePrompt,
    handleCopyToClipboard,
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
  };
};
