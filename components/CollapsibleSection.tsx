import React, { useState } from 'react';
import { ChevronDownIcon } from './Icons';

interface CollapsibleSectionProps {
  title: string;
  // FIX: Explicitly type the props for the icon element to allow 'className', resolving a type error with React.cloneElement.
  icon: React.ReactElement<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-slate-900/70 border border-slate-700 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 text-left font-semibold text-slate-200"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          {React.cloneElement(icon, { className: 'w-5 h-5' })}
          <span>{title}</span>
        </div>
        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out grid ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="p-3 pt-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};