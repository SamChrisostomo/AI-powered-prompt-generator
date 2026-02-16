
import React, { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md';
}

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => {
           window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
    };

    return (
        <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className={`bg-white dark:bg-slate-800 w-full rounded-2xl shadow-2xl p-8 relative ring-1 ring-slate-200 dark:ring-white/10 transition-colors duration-300 ${sizeClasses[size]}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white transition-colors" aria-label="Fechar modal">
                    <CloseIcon className="w-6 h-6" />
                </button>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 dark:text-white mb-4">
                    {title}
                </h2>
                
                {children}
            </div>
        </div>
    );
};