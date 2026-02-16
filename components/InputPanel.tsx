
import React from 'react';
import { usePromptGenerator } from '../hooks/usePromptGenerator';
import { DetailLevel, OutputFormat } from '../models/Prompt';
import { BookmarkIcon, XCircleIcon, TrashIcon, BrainCircuitIcon, BoltIcon, Cog6ToothIcon } from './Icons';
import { UserInputTextarea } from './UserInputTextarea';
import { getModePlaceholder } from '../data/texts';
import { modeOptions } from '../data/options';
import { CollapsibleSection } from './CollapsibleSection';

interface InputPanelProps {
    promptGenerator: ReturnType<typeof usePromptGenerator>;
    onSavePresetClick: () => void;
    selectedPreset: string;
    onSelectedPresetChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onDeletePreset: () => void;
    onClearFields: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
    promptGenerator,
    onSavePresetClick,
    selectedPreset,
    onSelectedPresetChange,
    onDeletePreset,
    onClearFields,
}) => {
    const {
        user,
        userInput, setUserInput,
        isLoading, isOptimizing,
        isAdvancedMode, setIsAdvancedMode,
        isInputInvalid, setIsInputInvalid,
        promptMode, setPromptMode,
        includeComments, setIncludeComments,
        detailLevel, setDetailLevel,
        outputFormat, setOutputFormat,
        handleGeneratePrompt,
        handleOptimizeInput,
        presets,
    } = promptGenerator;

    const handleUserInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserInput(e.target.value);
        if (isInputInvalid) {
            setIsInputInvalid(false);
        }
    }

    return (
        <>
            <div className="mb-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 bg-slate-900/70 border border-slate-700 rounded-lg p-1">
                    {modeOptions.map(mode => (
                        <button key={mode.id} onClick={() => setPromptMode(mode.id)} className={`w-full flex items-center justify-center text-xs sm:text-sm font-medium p-2 rounded-md transition-colors ${promptMode === mode.id ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                            {React.cloneElement(mode.icon, {className: "w-4 h-4 mr-1 sm:w-5 sm:h-5 sm:mr-2"})}
                            {mode.name}
                        </button>
                    ))}
                </div>
            </div>
            <UserInputTextarea
                value={userInput}
                onChange={handleUserInputChange}
                placeholder={getModePlaceholder(promptMode)}
                isInvalid={isInputInvalid}
                onOptimize={handleOptimizeInput}
                isOptimizing={isOptimizing}
            />
            {isInputInvalid && (
                <p className="mt-2 text-sm text-red-400">
                    Por favor, insira uma descrição para o seu prompt.
                </p>
            )}

            <div className="mt-6 space-y-4">
                {user && (
                     <CollapsibleSection title="Presets de Configuração" icon={<BookmarkIcon />}>
                        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 flex flex-col sm:flex-row gap-2 items-center">
                            <select
                                value={selectedPreset}
                                onChange={onSelectedPresetChange}
                                className="w-full sm:flex-1 bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                            >
                                <option value="">Carregar um preset...</option>
                                {presets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <div className="w-full sm:w-auto flex gap-2">
                                {selectedPreset && (
                                    <button onClick={onDeletePreset} title="Excluir Preset" className="w-full sm:w-auto px-3 py-2 text-sm bg-red-800/50 hover:bg-red-700/50 text-red-300 font-medium rounded-md transition-colors flex items-center justify-center gap-1">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                )}
                                <button onClick={onClearFields} title="Limpar Campos" className="w-full sm:w-auto px-3 py-2 text-sm bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-1">
                                    <XCircleIcon className="w-4 h-4" />
                                </button>
                                <button onClick={onSavePresetClick} className="w-full sm:w-auto px-4 py-2 text-sm bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-md transition-colors">
                                    Salvar Atual
                                </button>
                            </div>
                        </div>
                    </CollapsibleSection>
                )}
      
                <CollapsibleSection title="Personalizar Saída" icon={<Cog6ToothIcon />}>
                    <div className="space-y-3">
                        <label htmlFor="comments-toggle" className="flex items-center justify-between cursor-pointer select-none">
                            <span className="text-slate-300">Incluir comentários/explicações</span>
                            <div className="relative">
                                <input type="checkbox" id="comments-toggle" className="sr-only" checked={includeComments} onChange={() => setIncludeComments(!includeComments)} />
                                <div className={`block w-10 h-6 rounded-full transition-colors ${includeComments ? 'bg-purple-600' : 'bg-slate-600'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${includeComments ? 'translate-x-4' : 'translate-x-0'}`}></div>
                            </div>
                        </label>
                        <div>
                            <span className="text-slate-300 block mb-2">Nível de detalhe</span>
                            <div className="flex bg-slate-800 border border-slate-600 rounded-md p-1">
                                {(['conciso', 'detalhado', 'com exemplos'] as DetailLevel[]).map(level => (
                                <button key={level} onClick={() => setDetailLevel(level)} className={`w-full text-xs capitalize p-1.5 rounded transition-colors ${detailLevel === level ? 'bg-purple-600 text-white' : 'hover:bg-slate-700'}`}>
                                    {level}
                                </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="text-slate-300 block mb-2">Formato de saída</span>
                            <div className="flex bg-slate-800 border border-slate-600 rounded-md p-1">
                                {(['markdown', 'puro'] as OutputFormat[]).map(format => (
                                <button key={format} onClick={() => setOutputFormat(format)} className={`w-full text-xs capitalize p-1.5 rounded transition-colors ${outputFormat === format ? 'bg-purple-600 text-white' : 'hover:bg-slate-700'}`}>
                                    {format === 'puro' ? 'Código Puro' : 'Markdown'}
                                </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </CollapsibleSection>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <label htmlFor="advanced-toggle" className="flex items-center cursor-pointer select-none">
                        <div className="relative">
                            <input type="checkbox" id="advanced-toggle" className="sr-only" checked={isAdvancedMode} onChange={() => setIsAdvancedMode(!isAdvancedMode)} />
                            <div className={`block w-14 h-8 rounded-full transition-colors ${isAdvancedMode ? 'bg-purple-600' : 'bg-slate-700'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isAdvancedMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                        <div className="ml-3 text-slate-300 font-medium flex items-center gap-2">
                            <BrainCircuitIcon className="w-5 h-5" />
                            Modo Avançado
                        </div>
                    </label>
                    {isAdvancedMode && (
                        <div className="mt-2 ml-4 p-3 bg-slate-900/70 border border-slate-700 rounded-lg text-xs text-slate-400">
                            <p><span className="font-semibold text-slate-300">Temperatura:</span> <span className="font-mono text-purple-400">0.8</span> (Mais criativo)</p>
                            <p><span className="font-semibold text-slate-300">Top-K:</span> <span className="font-mono text-purple-400">64</span></p>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => handleGeneratePrompt(userInput)}
                    disabled={isLoading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                    {isLoading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="O 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Gerando...</>) : (<><BoltIcon className="w-5 h-5" />Gerar Prompt</>)}
                </button>
            </div>
        </>
    );
}
