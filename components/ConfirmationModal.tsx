
import React from 'react';
import { Modal } from './Modal';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: React.ReactNode;
    confirmText: string;
    cancelText?: string;
    loading: boolean;
    isConfirmDisabled?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText,
    cancelText = "Cancelar",
    loading,
    isConfirmDisabled = false
}) => {

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="text-slate-400 text-center mb-6 space-y-2">
                {message}
            </div>
            
            <div className="flex justify-end gap-4 mt-8">
                <button 
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                    {cancelText}
                </button>
                <button 
                    onClick={onConfirm}
                    disabled={loading || isConfirmDisabled}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading && (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    )}
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
};
