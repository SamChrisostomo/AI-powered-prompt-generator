
import React from 'react';
import { usePresets } from '../hooks/usePresets';
import { BookmarkIcon, TrashIcon } from './Icons';
import { CollapsibleSection } from './CollapsibleSection';
import { useDestructiveAction } from '../hooks/useDestructiveAction';
import { ConfirmationModal } from './ConfirmationModal';

interface PresetManagerProps {
    selectedPresetId: string;
    onSelectPreset: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onDeletePreset: () => void;
    onSavePreset: () => void;
}

export const PresetManager = React.memo(({
    selectedPresetId,
    onSelectPreset,
    onDeletePreset,
    onSavePreset
}: PresetManagerProps) => {
    // FETCHING OWN DATA
    const { presets, removePreset } = usePresets();

    const selectedPreset = presets?.find(p => p.id === selectedPresetId);

    const { trigger: confirmDelete, modalProps } = useDestructiveAction<string>({
        title: "Excluir Preset",
        message: () => (
            <>Deseja excluir o preset <strong>"{selectedPreset?.name}"</strong>?<br /><span className="text-sm text-slate-500 mt-2 block">As configurações salvas serão perdidas permanentemente.</span></>
        ),
        confirmText: "Excluir",
        action: async () => await removePreset(selectedPresetId),
        successMessage: "Preset excluído."
    });

    return (
        <>
            <CollapsibleSection title="Presets de Configuração" icon={<BookmarkIcon />}>
                <div className="bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-lg p-3 flex flex-col sm:flex-row gap-2 items-center">
                    <select
                        value={selectedPresetId}
                        onChange={onSelectPreset}
                        className="w-full sm:flex-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                    >
                        <option value="">Carregar um preset...</option>
                        {presets?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <div className="w-full sm:w-auto flex gap-2">
                        {selectedPresetId && (
                            <button onClick={() => confirmDelete(selectedPresetId)} title="Excluir Preset" className="w-full sm:w-auto px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center justify-center">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        )}
                        <button onClick={onSavePreset} className="w-full sm:w-auto px-4 py-2 text-sm bg-white border text-slate-700 rounded-md hover:bg-slate-50">
                            Salvar Atual
                        </button>
                    </div>
                </div>
            </CollapsibleSection>

            <ConfirmationModal {...modalProps} />
        </>
    );
});

PresetManager.displayName = 'PresetManager';
