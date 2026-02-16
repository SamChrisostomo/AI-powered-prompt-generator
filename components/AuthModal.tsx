
import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { Modal } from './Modal';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [isLoginView, setIsLoginView] = useState(true);
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
        }
    }, [isOpen]);
    
    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (isLoginView) {
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

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={isLoginView ? 'Bem-vindo de volta!' : 'Crie sua conta'}
        >
            <p className="text-slate-400 text-center mb-6">
                {isLoginView ? 'Faça login para continuar' : 'Comece a gerar prompts incríveis'}
            </p>

            <form onSubmit={handleAuthAction}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                            placeholder="seu@email.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-slate-300 mb-2">Senha</label>
                        <input 
                            type="password" 
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {error && <p className="mt-4 text-sm text-center text-red-400">{error}</p>}
                {message && <p className="mt-4 text-sm text-center text-green-400">{message}</p>}

                <div className="mt-6">
                    <button 
                        type="submit"
                        disabled={loading || !!message}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            isLoginView ? 'Login' : 'Registrar'
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <button 
                    onClick={() => {
                        setIsLoginView(!isLoginView);
                        setError(null);
                        setMessage(null);
                    }}
                    className="text-sm text-purple-400 hover:text-purple-300 font-medium transition"
                >
                    {isLoginView ? 'Não tem uma conta? Registre-se' : 'Já tem uma conta? Faça login'}
                </button>
            </div>
        </Modal>
    );
};
