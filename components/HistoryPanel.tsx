
import React from 'react';
import { usePromptGenerator } from '../hooks/usePromptGenerator';
import { HistoryItem } from '../models/History';
import { TrashIcon, Square2StackIcon, WandSparklesIcon } from './Icons';
import { renderModeIcon } from '../data/options';
import * as ReactWindow from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

// Manual definition since named import is failing in some environments
interface ListChildComponentProps<T = any> {
    index: number;
    style: React.CSSProperties;
    data: T;
    isScrolling?: boolean;
}

// Cast to any to bypass strict type checks and module resolution issues
const FixedSizeList = (ReactWindow as any).FixedSizeList || (ReactWindow as any).default?.FixedSizeList || ReactWindow;
const VirtualizedAutoSizer = AutoSizer as any;

type HistoryPanelProps = {
    promptGenerator: Pick<ReturnType<typeof usePromptGenerator>, 'user' | 'history' | 'selectedHistoryIds' | 'toggleHistorySelection' | 'loadFromHistory' | 'deleteHistoryItem' | 'deleteSelectedHistory' | 'groupSelectedHistory' | 'handleGenerateCompositePrompt'>;
};

export const HistoryActions: React.FC<Pick<HistoryPanelProps['promptGenerator'], 'groupSelectedHistory' | 'handleGenerateCompositePrompt' | 'deleteSelectedHistory'>> = ({ groupSelectedHistory, handleGenerateCompositePrompt, deleteSelectedHistory }) => (
    <div className="flex items-center gap-2">
        <button onClick={groupSelectedHistory} title="Agrupar Prompts" className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"><Square2StackIcon className="w-5 h-5"/></button>
        <button onClick={handleGenerateCompositePrompt} title="Gerar Prompt Composto" className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"><WandSparklesIcon className="w-5 h-5"/></button>
        <button onClick={deleteSelectedHistory} title="Excluir Selecionados" className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"><TrashIcon className="w-5 h-5"/></button>
    </div>
);

interface RowData {
    history: HistoryItem[];
    selectedHistoryIds: string[];
    toggleHistorySelection: (id: string) => void;
    loadFromHistory: (item: HistoryItem) => void;
    deleteHistoryItem: (id: string) => void;
}

const HistoryRow = React.memo(({ index, style, data }: ListChildComponentProps<RowData>) => {
    const { history, selectedHistoryIds, toggleHistorySelection, loadFromHistory, deleteHistoryItem } = data;
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
                <div className="flex-1 flex items-center justify-between gap-2 overflow-hidden cursor-pointer" onClick={() => loadFromHistory(item)}>
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
                    onClick={(e) => { e.stopPropagation(); deleteHistoryItem(item.id); }}
                    className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 p-1 rounded-full transition-colors"
                    aria-label={`Excluir item: ${item.userInput}`}
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
});


export const HistoryPanel: React.FC<HistoryPanelProps> = ({ promptGenerator }) => {
    const { user, history, selectedHistoryIds, toggleHistorySelection, loadFromHistory, deleteHistoryItem } = promptGenerator;
    
    return (
        <div className="w-full h-[60vh] sm:h-0 sm:flex-grow bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 rounded-lg p-2">
            {history.length > 0 ? (
                <VirtualizedAutoSizer>
                    {({ height, width }: { height: number; width: number }) => (
                        <FixedSizeList
                            height={height}
                            width={width}
                            itemCount={history.length}
                            itemSize={58} // Height Adjusted slightly
                            itemData={{
                                history,
                                selectedHistoryIds,
                                toggleHistorySelection,
                                loadFromHistory,
                                deleteHistoryItem
                            }}
                        >
                            {HistoryRow}
                        </FixedSizeList>
                    )}
                </VirtualizedAutoSizer>
            ) : (
                <div className="text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center h-full text-center p-4">
                    <p>{user ? 'Seus prompts gerados aparecerão aqui.' : 'Faça login para salvar e ver seu histórico.'}</p>
                </div>
            )}
        </div>
    );
};