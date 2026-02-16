
import React, { useState } from 'react';
import { ChevronDownIcon } from './Icons';

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactElement<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm transition-colors duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-t-lg transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          {React.cloneElement(icon, { className: 'w-5 h-5 text-slate-500 dark:text-slate-400' })}
          <span>{title}</span>
        </div>
        <ChevronDownIcon className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out grid ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="p-3 pt-0 text-slate-700 dark:text-slate-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};