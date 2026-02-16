
import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
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
            const { error } = await supabase.auth.updateUser({
                data: { full_name: fullName }
            });
            if (error) throw new Error(`Erro ao atualizar nome: ${error.message}`);
        }

        if (email) {
            const { error } = await supabase.auth.updateUser({ email });
            if (error) throw new Error(`Erro ao atualizar e-mail: ${error.message}`);
            setProfileSuccess("E-mail atualizado. Verifique sua caixa de entrada (antiga e nova) para confirmação.");
            return;
        }

        if (password) {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw new Error(`Erro ao atualizar senha: ${error.message}`);
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
        if (error) {
            throw error;
        }
        await supabase.auth.signOut();
    } catch (error: any) {
        setProfileError(`Erro ao deletar conta: ${error.message}`);
    } finally {
        setProfileLoading(false);
    }
  };

  return {
    user,
    profileLoading,
    profileError,
    profileSuccess,
    updateUserProfile,
    deleteUserAccount,
    resetProfileMessages
  };
};
