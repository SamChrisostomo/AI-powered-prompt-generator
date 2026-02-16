import React from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { XCircleIcon } from './Icons';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
    };

    return (
        <Transition appear show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-8 text-left align-middle shadow-2xl ring-1 ring-slate-200 dark:ring-white/10 transition-all`}>
                                <div className="flex justify-between items-center mb-6">
                                    <DialogTitle as="h3" className="text-2xl font-bold leading-6 text-slate-900 dark:text-white">
                                        {title}
                                    </DialogTitle>
                                    <button
                                        onClick={onClose}
                                        className="rounded-full p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <XCircleIcon className="w-6 h-6" />
                                    </button>
                                </div>
                                
                                {children}
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};