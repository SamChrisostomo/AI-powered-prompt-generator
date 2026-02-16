
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { usePromptGenerator } from '../hooks/usePromptGenerator';

type OutputPanelProps = {
    promptGenerator: Pick<ReturnType<typeof usePromptGenerator>, 'structuredPrompt' | 'isLoading' | 'error'>;
};

export const OutputPanel: React.FC<OutputPanelProps> = ({ promptGenerator }) => {
    const { structuredPrompt, isLoading } = promptGenerator;
    
    return (
        <div className="w-full h-[60vh] sm:h-0 sm:flex-grow bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 rounded-lg p-4 overflow-y-auto relative">
            {isLoading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mt-6"></div>
                    <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mt-6"></div>
                    <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                </div>
            ) : structuredPrompt ? (
                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-slate-800 dark:text-slate-200">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {structuredPrompt}
                    </ReactMarkdown>
                </div>
            ) : (
                <div className="text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center h-full">
                    <p>Seu prompt gerado aparecerá aqui...</p>
                </div>
            )}
        </div>
    );
};