
import { useState, useCallback } from 'react';
import { generateStructuredPrompt, generateCompositeStructuredPrompt } from '../services/promptService';
import { optimizeUserInput } from '../services/geminiService';
import { PromptOptions } from '../models/Prompt';
import { HistoryItem } from '../models/History';

import { useAuth } from './useAuth';
import { useSettings } from './useSettings';
import { useHistory } from './useHistory';
import { usePresets } from './usePresets';
import toast from 'react-hot-toast';

type ActivePanel = 'input' | 'output' | 'history';

export const usePromptGenerator = () => {
  const { user, profileLoading, profileError, profileSuccess, updateUserProfile, deleteUserAccount, resetProfileMessages } = useAuth();
  const settings = useSettings();
  const { addToHistory, clearSelection, getCombinedHistoryText, selectedHistoryIds, history } = useHistory();
  const { savePreset, getPresetById } = usePresets();

  const [userInput, setUserInput] = useState<string>('');
  const [structuredPrompt, setStructuredPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>('input');
  const [isInputInvalid, setIsInputInvalid] = useState<boolean>(false);

  const clearError = () => setError(null);

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

    const options: PromptOptions = { 
        mode: settings.promptMode, 
        includeComments: settings.includeComments, 
        detailLevel: settings.detailLevel, 
        outputFormat: settings.outputFormat, 
        temperature: settings.temperature, 
        topK: settings.topK 
    };

    try {
      const result = await generateStructuredPrompt(textToGenerate, settings.isAdvancedMode, options);
      setStructuredPrompt(result);
      await addToHistory(textToGenerate, result, settings.promptMode);
    } catch (err) {
      setError('Ocorreu um erro ao gerar o prompt. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user, settings, addToHistory]);
  
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

    const selectedItems = history?.filter(item => selectedHistoryIds.includes(item.id)) || [];
    const userInputs = selectedItems.map(item => item.userInput);
    const options: PromptOptions = { 
        mode: 'geral', 
        includeComments: settings.includeComments, 
        detailLevel: settings.detailLevel, 
        outputFormat: settings.outputFormat, 
        temperature: settings.temperature, 
        topK: settings.topK 
    };

    try {
        const result = await generateCompositeStructuredPrompt(userInputs, settings.isAdvancedMode, options);
        setStructuredPrompt(result);
        await addToHistory(`Prompt Composto de ${userInputs.length} itens`, result, 'geral');
    } catch (err) {
        setError('Ocorreu um erro ao gerar o prompt composto. Por favor, tente novamente.');
        console.error(err);
    } finally {
        setIsLoading(false);
        clearSelection();
    }
  }, [user, selectedHistoryIds, history, settings, addToHistory, clearSelection]);

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
      setError("Falha ao otimizar o texto. Tente novamente.");
    } finally {
      setIsOptimizing(false);
    }
  }, [userInput]);

  const loadFromHistory = (item: HistoryItem) => {
    setUserInput(item.userInput);
    setStructuredPrompt(item.structuredPrompt);
    settings.setPromptMode(item.mode);
    setIsInputInvalid(false);
    setActivePanel('input');
  };

  const groupSelectedHistory = () => {
      const combinedText = getCombinedHistoryText();
      if (combinedText) {
          setUserInput(combinedText);
          clearSelection();
          setActivePanel('input');
      }
  };

  const handleSavePreset = async (name: string) => {
    await savePreset(name, {
        promptMode: settings.promptMode,
        detailLevel: settings.detailLevel,
        outputFormat: settings.outputFormat,
        includeComments: settings.includeComments,
        isAdvancedMode: settings.isAdvancedMode,
        temperature: settings.temperature,
        topK: settings.topK,
    });
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = getPresetById(presetId);
    if (preset) {
        settings.applyPresetSettings(preset);
    }
  };

  const handleClearFields = () => {
    setUserInput('');
    setStructuredPrompt('');
    settings.resetSettings();
    setError(null);
    setIsInputInvalid(false);
  };

  const insertSnippet = (content: string) => {
      setUserInput(prev => {
          const separator = prev.length > 0 && !prev.endsWith('\n') ? '\n\n' : '';
          return prev + separator + content;
      });
      toast.success("Snippet inserido!", { icon: '📝' });
  };

  return {
    user,
    // Generation State
    userInput, setUserInput,
    structuredPrompt,
    isLoading,
    isOptimizing,
    error,
    clearError,
    isCopied,
    activePanel, setActivePanel,
    isInputInvalid, setIsInputInvalid,
    
    // Actions
    handleGeneratePrompt,
    handleCopyToClipboard,
    handleOptimizeInput,
    handleClearFields,
    handleGenerateCompositePrompt,

    // Settings
    ...settings,

    // Wrappers
    loadFromHistory,
    groupSelectedHistory,
    insertSnippet,
    handleSavePreset,
    handleLoadPreset,

    // Profile
    profileLoading,
    profileError,
    profileSuccess,
    updateUserProfile,
    deleteUserAccount,
    resetProfileMessages,
  };
};
