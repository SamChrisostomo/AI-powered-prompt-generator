
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';

interface SavePresetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => Promise<void>;
}

export const SavePresetModal: React.FC<SavePresetModalProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setLoading(false);
        }
    }, [isOpen]);
    
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setLoading(true);
        await onSave(name);
        setLoading(false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Salvar Preset" size="sm">
             <form onSubmit={handleSave}>
                <div>
                    <label htmlFor="preset-name" className="block text-sm font-medium text-slate-300 mb-2">Nome do Preset</label>
                    <input
                        type="text"
                        id="preset-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        placeholder="Ex: Componente React"
                    />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        disabled={loading || !name.trim()}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
