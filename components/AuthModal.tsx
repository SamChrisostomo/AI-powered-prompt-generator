
import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { Modal } from './Modal';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [isResetView, setIsResetView] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setError(null);
            setMessage(null);
            setLoading(false);
            setEmail('');
            setPassword('');
            setIsResetView(false);
            setIsLoginView(true);
        }
    }, [isOpen]);
    
    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (isResetView) {
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) {
                setError(error.message);
            } else {
                setMessage('Verifique seu e-mail para o link de redefinição de senha.');
            }
        } else if (isLoginView) {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                setError("Credenciais inválidas. Por favor, tente novamente.");
            } else {
                onClose();
            }
        } else {
            const { data, error } = await supabase.auth.signUp({ email, password });
            if (error) {
                setError(error.message);
            } else if (data.user && data.user.identities?.length === 0) {
                 setError("Este e-mail já está em uso. Tente fazer login.");
            } else {
                setMessage('Cadastro realizado! Por favor, verifique seu e-mail para confirmar sua conta.');
                setTimeout(() => {
                    setIsLoginView(true);
                    setMessage(null);
                }, 5000);
            }
        }
        setLoading(false);
    };

    const getTitle = () => {
        if (isResetView) return 'Redefinir Senha';
        return isLoginView ? 'Bem-vindo de volta!' : 'Crie sua conta';
    };

    const getDescription = () => {
        if (isResetView) return 'Digite seu e-mail para receber o link de recuperação.';
        return isLoginView ? 'Faça login para continuar' : 'Comece a gerar prompts incríveis';
    };

    const toggleView = () => {
        setError(null);
        setMessage(null);
        if (isResetView) {
            setIsResetView(false);
            setIsLoginView(true);
        } else {
            setIsLoginView(!isLoginView);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={getTitle()}
        >
            <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
                {getDescription()}
            </p>

            <form onSubmit={handleAuthAction}>
                <div className={`grid grid-cols-1 ${!isResetView ? 'sm:grid-cols-2' : ''} gap-4`}>
                    <div className={isResetView ? 'w-full' : ''}>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                            placeholder="seu@email.com"
                        />
                    </div>
                    {!isResetView && (
                        <div>
                            <label htmlFor="password"  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Senha</label>
                            <input 
                                type="password" 
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    )}
                </div>

                {error && <p className="mt-4 text-sm text-center text-red-500 dark:text-red-400 font-medium">{error}</p>}
                {message && <p className="mt-4 text-sm text-center text-green-600 dark:text-green-400 font-medium">{message}</p>}

                <div className="mt-6 space-y-3">
                    <button 
                        type="submit"
                        disabled={loading || (!!message && !isResetView)} 
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            isResetView ? 'Enviar Link' : (isLoginView ? 'Login' : 'Registrar')
                        )}
                    </button>

                    {!isResetView && isLoginView && (
                        <button 
                            type="button"
                            onClick={() => {
                                setIsResetView(true);
                                setError(null);
                                setMessage(null);
                            }}
                            className="w-full text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                        >
                            Esqueci minha senha?
                        </button>
                    )}
                </div>
            </form>

            <div className="mt-6 text-center">
                <button 
                    onClick={toggleView}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition"
                >
                    {isResetView 
                        ? 'Voltar para o Login' 
                        : (isLoginView ? 'Não tem uma conta? Registre-se' : 'Já tem uma conta? Faça login')}
                </button>
            </div>
        </Modal>
    );
};