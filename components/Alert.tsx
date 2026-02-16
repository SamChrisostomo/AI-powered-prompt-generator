
import React from 'react';
import { XCircleIcon } from './Icons';

interface AlertProps {
    type?: 'error' | 'info';
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
}

const iconMap: { [key in NonNullable<AlertProps['type']>]: React.ReactNode } = {
    error: <XCircleIcon className="w-6 h-6 text-red-400" />,
    info: null
};

const colorMap: { [key in NonNullable<AlertProps['type']>]: { bg: string, border: string, title: string } } = {
    error: {
        bg: 'bg-red-900/20',
        border: 'border-red-500/30',
        title: 'text-red-300'
    },
    info: {
        bg: 'bg-blue-900/20',
        border: 'border-blue-500/30',
        title: 'text-blue-300'
    }
};

export const Alert: React.FC<AlertProps> = ({ type = 'info', title, children, actions }) => {
    const colors = colorMap[type];
    const icon = iconMap[type];

    return (
        <div className={`w-full max-w-lg p-4 rounded-lg border ${colors.bg} ${colors.border} flex flex-col items-center justify-center text-center`}>
            <div className="flex items-center gap-2">
                {icon}
                <h3 className={`text-lg font-semibold ${colors.title}`}>{title}</h3>
            </div>
            <div className="mt-2 text-sm text-slate-400">
                {children}
            </div>
            {actions && (
                <div className="mt-4">
                    {actions}
                </div>
            )}
        </div>
    );
};
