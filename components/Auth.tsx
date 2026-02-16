
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../config/supabase';
import { usePromptGenerator } from '../hooks/usePromptGenerator';
import { appTexts } from '../data/texts';
import { ArrowLeftOnRectangleIcon, IdentificationIcon } from './Icons';

interface AuthProps {
    user: ReturnType<typeof usePromptGenerator>['user'];
    onLoginClick: () => void;
    onProfileClick: () => void;
}

export const Auth: React.FC<AuthProps> = ({ user, onLoginClick, onProfileClick }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        setIsDropdownOpen(false);
        await supabase.auth.signOut();
    };

    const handleProfileClick = () => {
        setIsDropdownOpen(false);
        onProfileClick();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (user) {
        const avatarUrl = user.user_metadata?.avatar_url;
        const userInitial = user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0);
        return (
            <div className="relative" ref={dropdownRef}>
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                    className="flex items-center gap-4 focus:outline-none"
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                >
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="User avatar" className="w-10 h-10 rounded-full ring-2 ring-purple-400/50" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-purple-400">
                            {userInitial?.toUpperCase()}
                        </div>
                    )}
                </button>
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-2xl ring-1 ring-white/10 z-50 py-1">
                        <div className="px-4 py-2 border-b border-slate-700">
                            <p className="text-sm text-slate-300 font-semibold truncate">{user.user_metadata?.full_name || 'Usuário'}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                            <button
                                onClick={handleProfileClick}
                                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/80 transition-colors"
                            >
                                <IdentificationIcon className="w-5 h-5" />
                                Gerenciar Perfil
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/80 transition-colors"
                            >
                                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                                {appTexts.logoutButton}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <button onClick={onLoginClick} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            {appTexts.loginButton}
        </button>
    );
};
