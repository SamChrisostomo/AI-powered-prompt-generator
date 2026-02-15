
import { supabase } from '../config/supabase';
import { Preset } from '../models/Preset';

type PresetData = Omit<Preset, 'id'>;

export const getPresets = async (userId: string): Promise<Preset[]> => {
    if (!userId) return [];
    try {
        const { data, error } = await supabase
            .from('PromptPresets')
            .select('*')
            .eq('userId', userId)
            .order('createdAt', { ascending: true });

        if (error) throw error;

        return data.map(item => ({
            id: item.id,
            name: item.name,
            promptMode: item.promptMode,
            detailLevel: item.detailLevel,
            outputFormat: item.outputFormat,
            includeComments: item.includeComments,
            isAdvancedMode: item.isAdvancedMode,
        }));
    } catch (error) {
        console.error("Falha ao carregar presets do Supabase", error);
        return [];
    }
};

export const addPreset = async (userId: string, preset: PresetData): Promise<Preset | null> => {
    if (!userId) return null;
    try {
        const { data, error } = await supabase
            .from('PromptPresets')
            .insert({ userId, ...preset })
            .select()
            .single();

        if (error) throw error;
        
        return {
            id: data.id,
            name: data.name,
            promptMode: data.promptMode,
            detailLevel: data.detailLevel,
            outputFormat: data.outputFormat,
            includeComments: data.includeComments,
            isAdvancedMode: data.isAdvancedMode,
        };
    } catch (error) {
        console.error("Falha ao salvar preset no Supabase", error);
        return null;
    }
};

export const deletePreset = async (userId: string, presetId: string): Promise<void> => {
    if (!userId || !presetId) return;
    try {
        const { error } = await supabase
            .from('PromptPresets')
            .delete()
            .eq('userId', userId)
            .eq('id', presetId);

        if (error) throw error;
    } catch (error) {
        console.error("Falha ao deletar preset no Supabase", error);
    }
};
