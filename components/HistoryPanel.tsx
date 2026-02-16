
import React from 'react';
import { usePromptGenerator } from '../hooks/usePromptGenerator';
import { useHistory } from '../hooks/useHistory';
import { HistoryItem } from '../models/History';
import { TrashIcon, Square2StackIcon, WandSparklesIcon } from './Icons';
import { renderModeIcon } from '../data/options';
import * as ReactWindow from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useDestructiveAction } from '../hooks/useDestructiveAction';
import { ConfirmationModal } from './ConfirmationModal';

interface ListChildComponentProps<T = any> {
    index: number;
    style: React.CSSProperties;
    data: T;
}

const FixedSizeList = (ReactWindow as any).FixedSizeList || (ReactWindow as any).default?.FixedSizeList || ReactWindow;
const VirtualizedAutoSizer = AutoSizer as any;

type HistoryPanelProps = {
    promptGenerator: Pick<ReturnType<typeof usePromptGenerator>, 'user' | 'loadFromHistory' | 'handleGenerateCompositePrompt' | 'groupSelectedHistory'>;
};

// --- Actions Component ---
export const HistoryActions: React.FC<{
    groupSelectedHistory: () => void;
    handleGenerateCompositePrompt: () => void;
    deleteSelectedHistory: () => void;
}> = ({ groupSelectedHistory, handleGenerateCompositePrompt, deleteSelectedHistory }) => (
    <div className="flex items-center gap-2">
        <button onClick={groupSelectedHistory} title="Agrupar Prompts" className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"><Square2StackIcon className="w-5 h-5"/></button>
        <button onClick={handleGenerateCompositePrompt} title="Gerar Prompt Composto" className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"><WandSparklesIcon className="w-5 h-5"/></button>
        <button onClick={deleteSelectedHistory} title="Excluir Selecionados" className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"><TrashIcon className="w-5 h-5"/></button>
    </div>
);

// --- Row Component ---
interface RowData {
    history: HistoryItem[];
    selectedHistoryIds: string[];
    toggleHistorySelection: (id: string) => void;
    loadFromHistory: (item: HistoryItem) => void;
    onDeleteClick: (item: HistoryItem) => void;
}

const HistoryRow = React.memo(({ index, style, data }: ListChildComponentProps<RowData>) => {
    const { history, selectedHistoryIds, toggleHistorySelection, loadFromHistory, onDeleteClick } = data;
    const item = history[index];
    if (!item) return null;

    const isSelected = selectedHistoryIds.includes(item.id);

    return (
        <div style={style}>
            <div
                className={`transition-all duration-200 rounded-md p-3 h-full flex items-center gap-3 border ${isSelected ? 'bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-600/50' : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
            >
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleHistorySelection(item.id)}
                    className="form-checkbox h-4 w-4 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-500 text-purple-600 rounded focus:ring-purple-500 cursor-pointer flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Selecionar item: ${item.userInput}`}
                />
                <div className="flex-1 flex items-center justify-between gap-2 overflow-hidden cursor-pointer focus:outline-none" onClick={() => loadFromHistory(item)}>
                    <p className="flex-1 text-sm text-slate-700 dark:text-slate-200 truncate font-medium">
                        {item.userInput}
                    </p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {renderModeIcon(item.mode)}
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onDeleteClick(item); }}
                    className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 p-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label={`Excluir item: ${item.userInput}`}
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
});


export const HistoryPanel = React.memo(({ promptGenerator }: HistoryPanelProps) => {
    const { user, loadFromHistory, groupSelectedHistory, handleGenerateCompositePrompt } = promptGenerator;
    // FETCHING OWN DATA
    const { history, selectedHistoryIds, toggleHistorySelection, deleteHistoryItem, deleteSelectedHistory, clearHistory } = useHistory();

    const { trigger: triggerSingleDelete, modalProps: singleDeleteProps } = useDestructiveAction<HistoryItem>({
        title: "Excluir Item do Histórico",
        message: (item) => (
            <>Deseja remover este prompt do histórico?<div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs italic">"{item.userInput}"</div></>
        ),
        action: async (item) => await deleteHistoryItem(item.id),
        successMessage: "Item removido."
    });

    const { trigger: triggerBulkDelete, modalProps: bulkDeleteProps } = useDestructiveAction<void>({
        title: "Excluir Selecionados",
        message: () => `Tem certeza que deseja excluir ${selectedHistoryIds.length} item(s) selecionado(s)?`,
        confirmText: `Excluir ${selectedHistoryIds.length} itens`,
        action: async () => await deleteSelectedHistory(),
        successMessage: "Itens removidos."
    });

    const { trigger: triggerClearAll, modalProps: clearAllProps } = useDestructiveAction<void>({
        title: "Limpar Histórico Completo",
        message: () => "Atenção: Isso apagará TODOS os itens do seu histórico.",
        confirmText: "Limpar Tudo",
        action: async () => await clearHistory(),
        successMessage: "Histórico limpo."
    });
    
    return (
        <div className="w-full h-[60vh] sm:h-0 sm:flex-grow bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 rounded-lg p-2 flex flex-col">
             <div className="flex justify-end mb-2 px-1">
                 {selectedHistoryIds.length > 0 ? (
                    <HistoryActions 
                        groupSelectedHistory={groupSelectedHistory} 
                        handleGenerateCompositePrompt={handleGenerateCompositePrompt}
                        deleteSelectedHistory={() => triggerBulkDelete()}
                    />
                 ) : (
                     history?.length > 0 && user && (
                        <button onClick={(e) => { e.stopPropagation(); triggerClearAll(); }} className="text-xs sm:text-sm text-slate-500 hover:text-red-500 flex items-center gap-1">
                            <TrashIcon className="w-3 h-3" /> Limpar Histórico
                        </button>
                     )
                 )}
             </div>

            {history && history.length > 0 ? (
                <div className="flex-grow">
                    <VirtualizedAutoSizer>
                        {({ height, width }: { height: number; width: number }) => (
                            <FixedSizeList
                                height={height}
                                width={width}
                                itemCount={history.length}
                                itemSize={58}
                                itemData={{
                                    history,
                                    selectedHistoryIds,
                                    toggleHistorySelection,
                                    loadFromHistory,
                                    onDeleteClick: triggerSingleDelete
                                }}
                            >
                                {HistoryRow}
                            </FixedSizeList>
                        )}
                    </VirtualizedAutoSizer>
                </div>
            ) : (
                <div className="text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center h-full text-center p-4">
                    <p>{user ? 'Seus prompts gerados aparecerão aqui.' : 'Faça login para salvar e ver seu histórico.'}</p>
                </div>
            )}

            <ConfirmationModal {...singleDeleteProps} />
            <ConfirmationModal {...bulkDeleteProps} />
            <ConfirmationModal {...clearAllProps} />
        </div>
    );
});

HistoryPanel.displayName = 'HistoryPanel';
