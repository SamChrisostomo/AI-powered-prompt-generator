
import React from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from './Icons';
import { Theme } from '../repositories/settingsRepository';

interface ThemeSwitcherProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const themeOptions: { name: string; value: Theme; icon: React.ReactElement }[] = [
  { name: 'Claro', value: 'light', icon: <SunIcon className="w-5 h-5" /> },
  { name: 'Escuro', value: 'dark', icon: <MoonIcon className="w-5 h-5" /> },
  { name: 'Sistema', value: 'system', icon: <ComputerDesktopIcon className="w-5 h-5" /> },
];

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
  return (
    <div 
        className="flex items-center p-1 bg-slate-200 dark:bg-slate-800 rounded-full ring-1 ring-slate-300 dark:ring-slate-700 shadow-inner"
        role="group"
        aria-label="Alternar tema"
    >
      {themeOptions.map((option) => {
        const isActive = theme === option.value;
        return (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              aria-pressed={isActive}
              className={`
                relative flex items-center justify-center p-1.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900
                ${isActive 
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-md scale-105 font-medium' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-300/50 dark:hover:bg-slate-700/50'
                }
              `}
              title={`Mudar para tema ${option.name}`}
              aria-label={`Mudar para tema ${option.name}`}
            >
              {option.icon}
              <span className="sr-only">{option.name}</span>
            </button>
        );
      })}
    </div>
  );
};
