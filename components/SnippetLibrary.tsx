
import React, { useState, Suspense } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useSnippets } from '../hooks/useSnippets';
import { Snippet } from '../models/Snippet';
import { SnippetIcon, PlusIcon, TrashIcon, DocumentPlusIcon } from './Icons';
import { CollapsibleSection } from './CollapsibleSection';
import { ConfirmationModal } from './ConfirmationModal';
import { useDestructiveAction } from '../hooks/useDestructiveAction';

// Lazy load do modal que raramente é usado
const AddSnippetModal = React.lazy(() => 
    import('./AddSnippetModal').then(module => ({ default: module.AddSnippetModal }))
);

interface SnippetLibraryProps {
    onInsertSnippet: (content: string) => void;
}

export const SnippetLibrary = React.memo(({ onInsertSnippet }: SnippetLibraryProps) => {
    // FETCHING OWN DATA
    const { snippets, removeSnippet, saveSnippet } = useSnippets();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [listRef] = useAutoAnimate();

    const { trigger: confirmDelete, modalProps } = useDestructiveAction<Snippet>({
        title: "Excluir Snippet",
        message: (snippet) => (
            <>Você tem certeza que deseja excluir permanentemente o snippet <strong>"{snippet.title}"</strong>?</>
        ),
        confirmText: "Excluir Snippet",
        action: async (snippet) => await removeSnippet(snippet.id),
        successMessage: "Snippet removido."
    });

    return (
        <>
            <CollapsibleSection title="Snippets de Código" icon={<SnippetIcon />}>
                <div className="space-y-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-sm font-semibold"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Criar Novo Snippet
                    </button>

                    <div ref={listRef} className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                        {snippets?.length === 0 ? (
                            <p className="text-center text-xs text-slate-500 py-4 italic">Nenhum snippet salvo.</p>
                        ) : (
                            snippets?.map(snippet => (
                                <div key={snippet.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md group hover:border-purple-300 transition-colors">
                                    <div className="flex-1 min-w-0 mr-2">
                                        <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate" title={snippet.title}>{snippet.title}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-mono">{snippet.content.substring(0, 30)}...</p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => onInsertSnippet(snippet.content)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded" title="Inserir"><DocumentPlusIcon className="w-4 h-4" /></button>
                                        <button onClick={() => confirmDelete(snippet)} className="p-1.5 text-red-500 hover:bg-red-100 rounded" title="Excluir"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </CollapsibleSection>
            
            <Suspense fallback={null}>
                {isModalOpen && (
                    <AddSnippetModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                        onSave={async (title, content) => { await saveSnippet(title, content); }} 
                    />
                )}
            </Suspense>
            <ConfirmationModal {...modalProps} />
        </>
    );
});

SnippetLibrary.displayName = 'SnippetLibrary';
