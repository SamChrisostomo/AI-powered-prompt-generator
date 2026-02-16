import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from './Modal';
import toast from 'react-hot-toast';

interface SavePresetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => Promise<void>;
}

interface FormData {
    name: string;
}

export const SavePresetModal: React.FC<SavePresetModalProps> = ({ isOpen, onClose, onSave }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();

    useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen, reset]);
    
    const onSubmit = async (data: FormData) => {
        try {
            await onSave(data.name);
            toast.success('Preset salvo com sucesso!');
            onClose();
        } catch (error) {
            toast.error('Erro ao salvar preset.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Salvar Preset" size="sm">
             <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="preset-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nome do Preset</label>
                    <input
                        type="text"
                        id="preset-name"
                        {...register('name', { required: 'Nome é obrigatório' })}
                        className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg p-3 text-slate-900 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
                        placeholder="Ex: Componente React"
                    />
                    {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isSubmitting && <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                        Salvar
                    </button>
                </div>
            </form>
        </Modal>
    );
};