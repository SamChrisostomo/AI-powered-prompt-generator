
import React from 'react';
import { usePromptGenerator } from '../hooks/usePromptGenerator';
import { HistoryItem } from '../models/History';
import { TrashIcon, Square2StackIcon, WandSparklesIcon } from './Icons';
import { renderModeIcon } from '../data/options';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

type HistoryPanelProps = {
    promptGenerator: Pick<ReturnType<typeof usePromptGenerator>, 'user' | 'history' | 'selectedHistoryIds' | 'toggleHistorySelection' | 'loadFromHistory' | 'deleteHistoryItem' | 'deleteSelectedHistory' | 'groupSelectedHistory' | 'handleGenerateCompositePrompt'>;
};

export const HistoryActions: React.FC<Pick<HistoryPanelProps['promptGenerator'], 'groupSelectedHistory' | 'handleGenerateCompositePrompt' | 'deleteSelectedHistory'>> = ({ groupSelectedHistory, handleGenerateCompositePrompt, deleteSelectedHistory }) => (
    <div className="flex items-center gap-2">
        <button onClick={groupSelectedHistory} title="Agrupar Prompts" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"><Square2StackIcon className="w-5 h-5"/></button>
        <button onClick={handleGenerateCompositePrompt} title="Gerar Prompt Composto" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"><WandSparklesIcon className="w-5 h-5"/></button>
        <button onClick={deleteSelectedHistory} title="Excluir Selecionados" className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-md transition-colors"><TrashIcon className="w-5 h-5"/></button>
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
                className={`transition-all duration-200 rounded-md p-3 h-full flex items-center gap-3 ${isSelected ? 'bg-purple-900/50 ring-2 ring-purple-600' : 'bg-slate-800/50 hover:bg-slate-700/50'}`}
            >
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleHistorySelection(item.id)}
                    className="form-checkbox h-4 w-4 bg-slate-700 border-slate-600 text-purple-600 rounded focus:ring-purple-500 cursor-pointer flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Selecionar item: ${item.userInput}`}
                />
                <div className="flex-1 flex items-center justify-between gap-2 overflow-hidden cursor-pointer" onClick={() => loadFromHistory(item)}>
                    <p className="flex-1 text-sm text-slate-300 truncate">
                        {item.userInput}
                    </p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {renderModeIcon(item.mode)}
                        <span className="text-xs text-slate-500">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); deleteHistoryItem(item.id); }}
                    className="text-slate-500 hover:text-red-400 p-1 rounded-full transition-colors"
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
        <div className="w-full h-[60vh] sm:h-0 sm:flex-grow bg-slate-900/70 border border-slate-700 rounded-lg p-2">
            {history.length > 0 ? (
                <AutoSizer>
                    {({ height, width }) => (
                        <FixedSizeList
                            height={height}
                            width={width}
                            itemCount={history.length}
                            itemSize={56} // Fixed height for each row (h-14)
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
                </AutoSizer>
            ) : (
                <div className="text-slate-500 flex flex-col items-center justify-center h-full text-center p-4">
                    <p>{user ? 'Seus prompts gerados aparecerão aqui.' : 'Faça login para salvar e ver seu histórico.'}</p>
                </div>
            )}
        </div>
    );
};