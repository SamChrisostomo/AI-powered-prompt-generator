
import React, { useEffect } from 'react';
import { XCircleIcon } from './Icons';

interface ErrorToastProps {
    error: string | null;
    onClose: () => void;
    onLoginClick: () => void;
}

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const ErrorToast: React.FC<ErrorToastProps> = ({ error, onClose, onLoginClick }) => {
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                onClose();
            }, 6000); // Auto-dismiss after 6 seconds

            return () => clearTimeout(timer);
        }
    }, [error, onClose]);

    if (!error) {
        return null;
    }

    const isLoginError = error === "Você precisa estar logado para gerar prompts.";

    const handleLoginClick = () => {
        onClose();
        onLoginClick();
    };

    return (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50">
            <div role="alert" className="flex items-start justify-between gap-4 p-4 bg-slate-800 border border-red-500/30 rounded-lg shadow-2xl shadow-black/50 ring-1 ring-white/10">
                <div className="flex items-start gap-3">
                    <span className="text-red-400 mt-0.5">
                        <XCircleIcon className="w-6 h-6" />
                    </span>
                    <div className="flex-1">
                        <strong className="block font-bold text-red-300">Erro!</strong>
                        <p className="mt-1 text-sm text-slate-300">{error}</p>
                        {isLoginError && (
                            <button
                                onClick={handleLoginClick}
                                className="mt-3 px-3 py-1.5 text-xs bg-purple-600 text-white font-bold rounded hover:bg-purple-700 transition-colors"
                            >
                                Fazer Login
                            </button>
                        )}
                    </div>
                </div>

                <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors flex-shrink-0" aria-label="Fechar notificação">
                    <CloseIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
