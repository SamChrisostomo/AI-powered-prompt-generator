import React from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { ChevronDownIcon } from './Icons';

interface AccordionProps {
  title: string;
  icon: React.ReactElement;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  headerContent?: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({ title, icon, children, isOpen, onToggle, headerContent }) => {
  const [parent] = useAutoAnimate();

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-2xl shadow-slate-950/50 ring-1 ring-slate-200 dark:ring-white/10 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-6 text-left text-2xl font-bold text-slate-900 dark:text-slate-100 focus:outline-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-4">
          {headerContent}
          <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      <div ref={parent}>
        {isOpen && (
            <div className="p-6 pt-0">
             {children}
            </div>
        )}
      </div>
    </div>
  );
};