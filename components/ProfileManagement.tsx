
import React, { useState, useEffect } from 'react';
import { usePromptGenerator } from '../hooks/usePromptGenerator';
import { ArrowUturnLeftIcon, UserCircleIcon } from './Icons';
import { ConfirmationModal } from './ConfirmationModal';

interface ProfileManagementProps {
    promptGenerator: ReturnType<typeof usePromptGenerator>;
    onBack: () => void;
}

export const ProfileManagement: React.FC<ProfileManagementProps> = ({ promptGenerator, onBack }) => {
    const { user, profileLoading, profileError, profileSuccess, updateUserProfile, deleteUserAccount, resetProfileMessages } = promptGenerator;
    
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');

    useEffect(() => {
        // Clear messages when component unmounts or user changes
        return () => {
            resetProfileMessages();
        };
    }, [resetProfileMessages]);

    const handleUpdateName = (e: React.FormEvent) => {
        e.preventDefault();
        updateUserProfile({ fullName });
    };

    const handleUpdateCredentials = (e: React.FormEvent) => {
        e.preventDefault();
        if (password && password !== confirmPassword) {
            alert("As senhas não coincidem.");
            return;
        }
        if (password && password.length < 6) {
             alert("A senha deve ter no mínimo 6 caracteres.");
            return;
        }
        
        const updates: { email?: string; password?: string } = {};
        if (email !== user?.email) updates.email = email;
        if (password) updates.password = password;

        if (Object.keys(updates).length > 0) {
            updateUserProfile(updates);
            setPassword('');
            setConfirmPassword('');
        }
    };

    const handleDeleteAccount = () => {
        deleteUserAccount();
        setIsDeleteModalOpen(false);
    };

    const renderFeedback = () => {
        if (profileLoading) {
            return <p className="text-sm text-blue-400 mt-2">Processando...</p>;
        }
        if (profileError) {
            return <p className="text-sm text-red-400 mt-2">{profileError}</p>;
        }
        if (profileSuccess) {
            return <p className="text-sm text-green-400 mt-2">{profileSuccess}</p>;
        }
        return null;
    };

    if (!user) {
        return <p>Usuário não encontrado.</p>;
    }
    
    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors mb-6 font-semibold">
                <ArrowUturnLeftIcon className="w-5 h-5"/>
                Voltar para o Gerador
            </button>

            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 ring-1 ring-slate-200 dark:ring-white/10">
                <div className="flex items-center gap-4 mb-8">
                    <UserCircleIcon className="w-16 h-16 text-purple-600 dark:text-purple-400"/>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{user.user_metadata?.full_name || 'Gerenciar Perfil'}</h1>
                        <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
                    </div>
                </div>

                {renderFeedback()}
                
                {/* Personal Info */}
                <form onSubmit={handleUpdateName} className="mb-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Informações Pessoais</h2>
                    <div className="mb-4">
                        <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nome Completo</label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Seu nome completo"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-slate-300 focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div className="text-right">
                        <button type="submit" disabled={profileLoading || fullName === (user.user_metadata?.full_name || '')} className="px-5 py-2.5 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            Salvar Nome
                        </button>
                    </div>
                </form>

                {/* Credentials */}
                <form onSubmit={handleUpdateCredentials} className="mb-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                     <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Credenciais de Acesso</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">E-mail</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-slate-300 focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="password"  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nova Senha</label>
                            <input 
                                type="password" 
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-slate-300 focus:ring-2 focus:ring-purple-500"
                                placeholder="Deixe em branco para não alterar"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword"  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirmar Nova Senha</label>
                            <input 
                                type="password" 
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                minLength={6}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-slate-300 focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>
                     <div className="text-right mt-4">
                        <button type="submit" disabled={profileLoading} className="px-5 py-2.5 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                           Salvar Credenciais
                        </button>
                    </div>
                </form>

                {/* Danger Zone */}
                <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-500/30">
                    <h2 className="text-xl font-semibold text-red-600 dark:text-red-300 mb-2">Zona de Perigo</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">Esta ação não pode ser desfeita. Todos os seus dados, incluindo histórico e presets, serão permanentemente excluídos.</p>
                    <button onClick={() => setIsDeleteModalOpen(true)} className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors">
                        Deletar Minha Conta
                    </button>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
                title="Confirmar Exclusão de Conta"
                message={
                    <>
                        <p>Esta ação é irreversível.</p>
                        <p className="font-semibold mt-4">Para confirmar, digite "DELETAR" abaixo:</p>
                        <input
                            type="text"
                            value={deleteConfirmationInput}
                            onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                            className="w-full mt-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-slate-900 dark:text-slate-300 text-center focus:ring-2 focus:ring-red-500"
                        />
                    </>
                }
                confirmText="Deletar permanentemente"
                loading={profileLoading}
                isConfirmDisabled={deleteConfirmationInput !== 'DELETAR'}
            />
        </div>
    );
};