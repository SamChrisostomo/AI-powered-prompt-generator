
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSettings, saveSettings, Theme } from '../repositories/settingsRepository';
import { DetailLevel, OutputFormat, PromptMode } from '../models/Prompt';
import { useAuth } from './useAuth';

export const useSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Local State (Immediate UI feedback)
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);
  const [includeComments, setIncludeComments] = useState<boolean>(true);
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('detalhado');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('markdown');
  const [temperature, setTemperature] = useState<number>(0.8);
  const [topK, setTopK] = useState<number>(64);
  const [theme, setTheme] = useState<Theme>('system');
  const [promptMode, setPromptMode] = useState<PromptMode>('geral');

  // Fetch Settings from DB
  const { data: remoteSettings } = useQuery({
    queryKey: ['settings', user?.id],
    queryFn: () => getSettings(user!.id),
    enabled: !!user,
    staleTime: Infinity, // Settings rarely change externally
  });

  // Sync Remote -> Local
  useEffect(() => {
    if (remoteSettings) {
      setIsAdvancedMode(remoteSettings.isAdvancedMode);
      setIncludeComments(remoteSettings.includeComments);
      setDetailLevel(remoteSettings.detailLevel);
      setOutputFormat(remoteSettings.outputFormat);
      setTemperature(remoteSettings.temperature ?? 0.8);
      setTopK(remoteSettings.topK ?? 64);
      setTheme(remoteSettings.theme ?? 'system');
    } else if (!user) {
        // Load theme from local storage if not logged in
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        if (storedTheme) setTheme(storedTheme);
    }
  }, [remoteSettings, user]);

  // Sync Local -> Remote (Debounced via Mutation)
  const saveMutation = useMutation({
    mutationFn: (newSettings: any) => saveSettings(user!.id, newSettings),
  });

  // Effect to trigger save
  useEffect(() => {
    if (user) {
      saveMutation.mutate({ isAdvancedMode, includeComments, detailLevel, outputFormat, temperature, topK, theme });
    }
  }, [user, isAdvancedMode, includeComments, detailLevel, outputFormat, temperature, topK, theme]);

  // Apply Theme Logic
  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
        const isSystemDark = mediaQuery.matches;
        const shouldBeDark = theme === 'dark' || (theme === 'system' && isSystemDark);
        root.classList.toggle('dark', shouldBeDark);
        localStorage.setItem('theme', theme);
    };
    applyTheme();
    mediaQuery.addEventListener('change', applyTheme);
    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [theme]);

  const applyPresetSettings = (settings: any) => {
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
