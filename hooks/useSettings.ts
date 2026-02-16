
import { useState, useEffect } from 'react';
import { getSettings, saveSettings, Theme } from '../repositories/settingsRepository';
import { DetailLevel, OutputFormat, PromptMode } from '../models/Prompt';
import type { User } from '@supabase/supabase-js';

export const useSettings = (user: User | null) => {
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);
  const [includeComments, setIncludeComments] = useState<boolean>(true);
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('detalhado');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('markdown');
  const [temperature, setTemperature] = useState<number>(0.8);
  const [topK, setTopK] = useState<number>(64);
  const [theme, setTheme] = useState<Theme>('system');
  const [promptMode, setPromptMode] = useState<PromptMode>('geral');

  // Load settings on login or from localStorage
  useEffect(() => {
    const loadSettings = async () => {
      if (user) {
        const settings = await getSettings(user.id);
        if (settings) {
          setIsAdvancedMode(settings.isAdvancedMode);
          setIncludeComments(settings.includeComments);
          setDetailLevel(settings.detailLevel);
          setOutputFormat(settings.outputFormat);
          setTemperature(settings.temperature ?? 0.8);
          setTopK(settings.topK ?? 64);
          setTheme(settings.theme ?? 'system');
        }
      } else {
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        if (storedTheme) {
            setTheme(storedTheme);
        }
      }
    };
    loadSettings();
  }, [user]);

  // Save settings on change (Debounced slightly by React batching, but functionally direct)
  useEffect(() => {
    if (user) {
      saveSettings(user.id, { isAdvancedMode, includeComments, detailLevel, outputFormat, temperature, topK, theme });
    }
  }, [user, isAdvancedMode, includeComments, detailLevel, outputFormat, temperature, topK, theme]);

  // Apply theme Logic
  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
        const isSystemDark = mediaQuery.matches;
        const shouldBeDark = theme === 'dark' || (theme === 'system' && isSystemDark);

        if (shouldBeDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        
        localStorage.setItem('theme', theme);
    };

    // Apply immediately when theme state changes
    applyTheme();

    // Setup listener for system changes ONLY if we are in system mode
    const handleSystemChange = () => {
        if (theme === 'system') {
            applyTheme();
        }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    
    return () => {
        mediaQuery.removeEventListener('change', handleSystemChange);
    };
  }, [theme]);

  // Helper to bulk update settings (e.g. from preset)
  const applyPresetSettings = (settings: {
      promptMode: PromptMode;
      detailLevel: DetailLevel;
      outputFormat: OutputFormat;
      includeComments: boolean;
      isAdvancedMode: boolean;
      temperature: number;
      topK: number;
  }) => {
      setPromptMode(settings.promptMode);
      setDetailLevel(settings.detailLevel);
      setOutputFormat(settings.outputFormat);
      setIncludeComments(settings.includeComments);
      setIsAdvancedMode(settings.isAdvancedMode);
      setTemperature(settings.temperature);
      setTopK(settings.topK);
  };

  const resetSettings = () => {
    setPromptMode('geral');
    setDetailLevel('detalhado');
    setOutputFormat('markdown');
    setIncludeComments(true);
    setIsAdvancedMode(false);
    setTemperature(0.8);
    setTopK(64);
  };

  return {
    isAdvancedMode, setIsAdvancedMode,
    includeComments, setIncludeComments,
    detailLevel, setDetailLevel,
    outputFormat, setOutputFormat,
    temperature, setTemperature,
    topK, setTopK,
    theme, setTheme,
    promptMode, setPromptMode,
    applyPresetSettings,
    resetSettings
  };
};
