import { useState, useCallback } from 'react';
import { generateStructuredPrompt, generateCompositeStructuredPrompt } from '../services/promptService';
import { optimizeUserInput } from '../services/geminiService';
import { PromptOptions } from '../models/Prompt';
import { useAuth } from './useAuth';
import { useSettings } from './useSettings';
import { useHistory } from './useHistory';
import { usePromptContext } from '../context/PromptContext';

export const usePromptGenerator = () => {
  const { user } = useAuth();
  const settings = useSettings();
  const { addToHistory, clearSelection, history } = useHistory();
  const { 
      userInput, setUserInput, 
      setStructuredPrompt, 
      setIsInputInvalid, 
      setIsCopied, 
      setActivePanel 
  } = usePromptContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

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
  }, [user, settings, addToHistory, setIsInputInvalid, setStructuredPrompt, setIsCopied, setActivePanel]);
  
  const handleGenerateCompositePrompt = useCallback(async (selectedHistoryIds: string[]) => {
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
  }, [user, history, settings, addToHistory, clearSelection, setIsInputInvalid, setStructuredPrompt, setIsCopied, setActivePanel]);

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
  }, [userInput, setUserInput]);

  return {
    isLoading,
    isOptimizing,
    error,
    clearError,
    handleGeneratePrompt,
    handleGenerateCompositePrompt,
    handleOptimizeInput
  };
};