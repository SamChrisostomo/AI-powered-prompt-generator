
import React from 'react';
import { WandSparklesIcon } from './Icons';

interface UserInputTextareaProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
    isInvalid: boolean;
    onOptimize: () => void;
    isOptimizing: boolean;
}

export const UserInputTextarea: React.FC<UserInputTextareaProps> = ({
    value,
    onChange,
    placeholder,
    isInvalid,
    onOptimize,
    isOptimizing
}) => {
    return (
        <div className="relative w-full">
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-slate-900/70 border rounded-lg p-4 pr-12 text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 resize-none ${isInvalid ? 'border-red-500 ring-2 ring-red-500/50 shake' : 'border-slate-700'}`}
                rows={10}
                aria-invalid={isInvalid}
            />
            <div className="absolute bottom-3 right-3">
                <button
                    onClick={onOptimize}
                    disabled={isOptimizing || !value}
                    className="p-2 text-slate-400 rounded-full bg-slate-800/50 hover:bg-slate-700/80 hover:text-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Otimizar com IA"
                >
                    {isOptimizing ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <WandSparklesIcon className="w-5 h-5" />
                    )}
                </button>
            </div>
        </div>
    );
};