
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    profileLoading: boolean;
    profileError: string | null;
    profileSuccess: string | null;
    updateUserProfile: (updates: { fullName?: string; email?: string; password?: string }) => Promise<void>;
    deleteUserAccount: () => Promise<void>;
    resetProfileMessages: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState<boolean>(false);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const resetProfileMessages = () => {
        setProfileError(null);
        setProfileSuccess(null);
    };

    const updateUserProfile = async (updates: { fullName?: string; email?: string; password?: string }) => {
        resetProfileMessages();
        setProfileLoading(true);

        try {
            const { fullName, email, password } = updates;
            if (fullName !== undefined) {
                const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } });
                if (error) throw new Error(`Erro: ${error.message}`);
            }
            if (email) {
                const { error } = await supabase.auth.updateUser({ email });
                if (error) throw new Error(`Erro: ${error.message}`);
                setProfileSuccess("E-mail atualizado. Verifique sua caixa de entrada.");
                return;
            }
            if (password) {
                const { error } = await supabase.auth.updateUser({ password });
                if (error) throw new Error(`Erro: ${error.message}`);
            }
            setProfileSuccess("Perfil atualizado com sucesso!");
        } catch (error: any) {
            setProfileError(error.message);
        } finally {
            setProfileLoading(false);
        }
    };

    const deleteUserAccount = async () => {
        resetProfileMessages();
        setProfileLoading(true);
        try {
            const { error } = await supabase.rpc('delete_user_account');
            if (error) throw error;
            await supabase.auth.signOut();
        } catch (error: any) {
            setProfileError(`Erro ao deletar conta: ${error.message}`);
        } finally {
            setProfileLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, profileLoading, profileError, profileSuccess, updateUserProfile, deleteUserAccount, resetProfileMessages }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
