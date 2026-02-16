
import { supabase } from '../config/supabase';
import { DetailLevel, OutputFormat } from '../models/Prompt';

export type Theme = 'light' | 'dark' | 'system';

export interface UserSettings {
  isAdvancedMode: boolean;
  includeComments: boolean;
  detailLevel: DetailLevel;
  outputFormat: OutputFormat;
  temperature: number;
  topK: number;
  theme: Theme;
}

export const getSettings = async (userId: string): Promise<UserSettings | null> => {
  if (!userId) return null;
  try {
    const { data, error } = await supabase
      .from('UserSettings')
      .select('isAdvancedMode, includeComments, detailLevel, outputFormat, temperature, topK, theme')
      .eq('userId', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      throw error;
    }

    return data ? {
      isAdvancedMode: data.isAdvancedMode,
      includeComments: data.includeComments,
      detailLevel: data.detailLevel as DetailLevel,
      outputFormat: data.outputFormat as OutputFormat,
      temperature: data.temperature ?? 0.8,
      topK: data.topK ?? 64,
      theme: data.theme ?? 'system',
    } : null;

  } catch (error) {
    console.error("Falha ao carregar as configurações do Supabase", error);
    return null;
  }
};

export const saveSettings = async (userId: string, settings: UserSettings): Promise<void> => {
  if (!userId) return;
  try {
    const { error } = await supabase
      .from('UserSettings')
      .upsert({
        userId,
        ...settings,
      }, { onConflict: 'userId' });

    if (error) throw error;

  } catch (error) {
    console.error("Falha ao salvar as configurações no Supabase", error);
  }
};
