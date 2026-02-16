
import React from 'react';
import { BookmarkIcon, TrashIcon } from './Icons';
import { CollapsibleSection } from './CollapsibleSection';
import { Preset } from '../models/Preset';

interface PresetManagerProps {
    presets: Preset[];
    selectedPresetId: string;
    onSelectPreset: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onDeletePreset: () => void;
    onSavePreset: () => void;
    onClear: () => void;
}

export const PresetManager: React.FC<Omit<PresetManagerProps, 'onClear'>> = ({
    presets,
    selectedPresetId,
    onSelectPreset,
    onDeletePreset,
    onSavePreset
}) => {
    return (
        <CollapsibleSection title="Presets de Configuração" icon={<BookmarkIcon />}>
            <div className="bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-lg p-3 flex flex-col sm:flex-row gap-2 items-center">
                <select
                    value={selectedPresetId}
                    onChange={onSelectPreset}
                    className="w-full sm:flex-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                >
                    <option value="">Carregar um preset...</option>
                    {presets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <div className="w-full sm:w-auto flex gap-2">
                    {selectedPresetId && (
                        <button onClick={onDeletePreset} title="Excluir Preset" className="w-full sm:w-auto px-3 py-2 text-sm bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-800/60 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 font-medium rounded-md transition-colors flex items-center justify-center gap-1">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    )}
                    <button onClick={onSavePreset} className="w-full sm:w-auto px-4 py-2 text-sm bg-white dark:bg-slate-600 hover:bg-slate-50 dark:hover:bg-slate-500 border border-slate-300 dark:border-slate-500 text-slate-700 dark:text-white font-medium rounded-md transition-colors">
                        Salvar Atual
                    </button>
                </div>
            </div>
        </CollapsibleSection>
    );
};
