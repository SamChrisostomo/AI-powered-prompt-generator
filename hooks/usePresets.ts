
import { useState, useEffect } from 'react';
import { getPresets, addPreset, deletePreset } from '../repositories/presetRepository';
import { Preset } from '../models/Preset';
import type { User } from '@supabase/supabase-js';
import { PromptMode, DetailLevel, OutputFormat } from '../models/Prompt';

export const usePresets = (user: User | null) => {
  const [presets, setPresets] = useState<Preset[]>([]);

  useEffect(() => {
    if (user) {
      getPresets(user.id).then(setPresets);
    } else {
      setPresets([]);
    }
  }, [user]);

  const savePreset = async (
      name: string, 
      settings: {
        promptMode: PromptMode;
        detailLevel: DetailLevel;
        outputFormat: OutputFormat;
        includeComments: boolean;
        isAdvancedMode: boolean;
        temperature: number;
        topK: number;
      }
  ) => {
    if (!user) return;
    const newPreset = await addPreset(user.id, { name, ...settings });
    if (newPreset) {
        setPresets(prev => [...prev, newPreset]);
    }
  };

  const removePreset = async (presetId: string) => {
    if (!user) return;
    await deletePreset(user.id, presetId);
    setPresets(prev => prev.filter(p => p.id !== presetId));
  };

  const getPresetById = (presetId: string) => {
      return presets.find(p => p.id === presetId);
  }

  return {
      presets,
      savePreset,
      removePreset,
      getPresetById
  };
};
