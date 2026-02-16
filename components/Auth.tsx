import React from 'react';
import { supabase } from '../config/supabase';
import { appTexts } from '../data/texts';
import { ArrowLeftOnRectangleIcon, IdentificationIcon } from './Icons';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import { User } from '@supabase/supabase-js';

interface AuthProps {
    user: User | null;
    onLoginClick: () => void;
    onProfileClick: () => void;
}

export const Auth: React.FC<AuthProps> = ({ user, onLoginClick, onProfileClick }) => {
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success("Você saiu com sucesso.");
    };

    if (user) {
        const avatarUrl = user.user_metadata?.avatar_url;
        const userInitial = user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0);
        
        return (
            <Menu as="div" className="relative inline-block text-left">
                <MenuButton className="flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="User avatar" className="w-10 h-10 rounded-full ring-2 ring-purple-400/50" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-purple-400 hover:bg-purple-700 transition-colors shadow-sm">
                            {userInitial?.toUpperCase()}
                        </div>
                    )}
                </MenuButton>
                <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800 rounded-lg shadow-2xl ring-1 ring-slate-200 dark:ring-white/10 focus:outline-none z-50">
                        <div className="px-4 py-3">
                            <p className="text-sm text-slate-900 dark:text-slate-300 font-semibold truncate">{user.user_metadata?.full_name || 'Usuário'}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        </div>
                        <div className="p-1">
                            <MenuItem>
                                {({ active }) => (
                                    <button
                                        onClick={onProfileClick}
                                        className={`${
                                            active ? 'bg-purple-500 text-white' : 'text-slate-700 dark:text-slate-300'
                                        } group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors`}
                                    >
                                        <IdentificationIcon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                                        Gerenciar Perfil
                                    </button>
                                )}
                            </MenuItem>
                            <MenuItem>
                                {({ active }) => (
                                    <button
                                        onClick={handleLogout}
                                        className={`${
                                            active ? 'bg-purple-500 text-white' : 'text-slate-700 dark:text-slate-300'
                                        } group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors`}
                                    >
                                        <ArrowLeftOnRectangleIcon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                                        {appTexts.logoutButton}
                                    </button>
                                )}
                            </MenuItem>
                        </div>
                    </MenuItems>
                </Transition>
            </Menu>
        );
    }

    return (
        <button onClick={onLoginClick} className="bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm">
            {appTexts.loginButton}
        </button>
    );
};