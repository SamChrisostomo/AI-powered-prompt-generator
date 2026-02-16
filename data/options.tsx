
import React from 'react';
import { PromptMode } from '../models/Prompt';
import { SparklesIcon, CodeBracketIcon, BugAntIcon, ArrowPathIcon, DocumentTextIcon, TableCellsIcon, HashtagIcon, BeakerIcon } from '../components/Icons';
import type { IconProps } from '../components/Icons';

export const modeOptions: { id: PromptMode; name: string; icon: React.ReactElement<IconProps> }[] = [
    { id: 'geral', name: 'Geral', icon: <SparklesIcon className="w-5 h-5 mr-2" /> },
    { id: 'codigo', name: 'Código', icon: <CodeBracketIcon className="w-5 h-5 mr-2" /> },
    { id: 'debug', name: 'Depurar', icon: <BugAntIcon className="w-5 h-5 mr-2" /> },
    { id: 'refatorar', name: 'Refatorar', icon: <ArrowPathIcon className="w-5 h-5 mr-2" /> },
    { id: 'documentacao', name: 'Doc', icon: <DocumentTextIcon className="w-5 h-5 mr-2" /> },
    { id: 'gerar_dados_ficticios', name: 'Dados', icon: <TableCellsIcon className="w-5 h-5 mr-2" /> },
    { id: 'escrever_regex', name: 'Regex', icon: <HashtagIcon className="w-5 h-5 mr-2" /> },
    { id: 'criar_planos_de_teste', name: 'Testes', icon: <BeakerIcon className="w-5 h-5 mr-2" /> },
];

export const renderModeIcon = (mode: PromptMode) => {
    const modeInfo = modeOptions.find(m => m.id === mode);
    return modeInfo ? React.cloneElement(modeInfo.icon, { className: 'w-5 h-5 text-slate-400' }) : null;
}
