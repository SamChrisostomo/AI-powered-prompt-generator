
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { usePromptGenerator } from '../hooks/usePromptGenerator';
import { ClipboardIcon, ClipboardCheckIcon } from './Icons';

type OutputPanelProps = {
    promptGenerator: Pick<ReturnType<typeof usePromptGenerator>, 'structuredPrompt' | 'isLoading' | 'error' | 'isCopied' | 'handleCopyToClipboard'>;
};

export const OutputPanel: React.FC<OutputPanelProps> = ({ promptGenerator }) => {
    const { structuredPrompt, isLoading, isCopied, handleCopyToClipboard } = promptGenerator;
    
    return (
        <div className="w-full h-[60vh] sm:h-0 sm:flex-grow bg-slate-900/70 border border-slate-700 rounded-lg p-4 overflow-y-auto relative">
            {structuredPrompt && !isLoading && (
                <button
                    onClick={handleCopyToClipboard}
                    className="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors duration-200 p-2 rounded-md bg-slate-800/50 hover:bg-slate-700 z-10"
                    aria-label="Copiar prompt"
                >
                    {isCopied ? <ClipboardCheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
                </button>
            )}
            {isLoading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-slate-700 rounded w-1/4"></div>
                    <div className="h-8 bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/4 mt-6"></div>
                    <div className="h-12 bg-slate-700 rounded w-full"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/4 mt-6"></div>
                    <div className="h-16 bg-slate-700 rounded w-full"></div>
                </div>
            ) : structuredPrompt ? (
                <div className="prose prose-sm sm:prose-base prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {structuredPrompt}
                    </ReactMarkdown>
                </div>
            ) : (
                <div className="text-slate-500 flex flex-col items-center justify-center h-full">
                    <p>Seu prompt gerado aparecerá aqui...</p>
                </div>
            )}
        </div>
    );
};
