
import React from 'react';
import { usePromptGenerator } from '../hooks/usePromptGenerator';
import { DetailLevel, OutputFormat } from '../models/Prompt';
import { BrainCircuitIcon, BoltIcon, Cog6ToothIcon } from './Icons';
import { UserInputTextarea } from './UserInputTextarea';
import { getModePlaceholder } from '../data/texts';
import { modeOptions } from '../data/options';
import { CollapsibleSection } from './CollapsibleSection';
import { PresetManager } from './PresetManager';
import { SnippetLibrary } from './SnippetLibrary';
import { useAutoAnimate } from '@formkit/auto-animate/react';

interface InputPanelProps {
    promptGenerator: ReturnType<typeof usePromptGenerator>;
    onSavePresetClick: () => void;
    selectedPreset: string;
    onSelectedPresetChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onDeletePreset: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
    promptGenerator,
    onSavePresetClick,
    selectedPreset,
    onSelectedPresetChange,
    onDeletePreset,
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
        temperature, setTemperature,
        topK, setTopK,
        insertSnippet
    } = promptGenerator;
    
    const [modeListRef] = useAutoAnimate();

    const handleUserInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserInput(e.target.value);
        if (isInputInvalid) {
            setIsInputInvalid(false);
        }
    }

    return (
        <>
            <div className="mb-4">
                <div ref={modeListRef} className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 rounded-xl p-1.5">
                    {modeOptions.map(mode => (
                        <button key={mode.id} onClick={() => setPromptMode(mode.id)} className={`w-full flex items-center justify-center text-xs sm:text-sm font-medium py-2.5 px-2 rounded-lg transition-colors ${promptMode === mode.id ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                            {React.cloneElement(mode.icon, {className: "w-4 h-4 mr-1.5 sm:w-5 sm:h-5 sm:mr-2"})}
                            <span className="truncate">{mode.name}</span>
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
                <p className="mt-2 text-sm text-red-500 dark:text-red-400 animate-pulse font-medium">
                    Por favor, insira uma descrição para o seu prompt.
                </p>
            )}

            <div className="mt-6 space-y-4">
                {user && (
                    <>
                        <SnippetLibrary onInsertSnippet={insertSnippet} />
                        <PresetManager 
                            selectedPresetId={selectedPreset}
                            onSelectPreset={onSelectedPresetChange}
                            onDeletePreset={onDeletePreset}
                            onSavePreset={onSavePresetClick}
                        />
                    </>
                )}
      
                <CollapsibleSection title="Personalizar Saída" icon={<Cog6ToothIcon />}>
                    <div className="space-y-4 pt-1">
                        <label 
                            htmlFor="comments-toggle" 
                            className="flex items-center justify-between cursor-pointer select-none p-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            title="Quando ativado, a IA adicionará explicações detalhadas ao código ou resposta."
                        >
                            <span className="text-slate-700 dark:text-slate-300 font-medium">Incluir comentários</span>
                            <div className="relative">
                                <input type="checkbox" id="comments-toggle" className="sr-only" checked={includeComments} onChange={() => setIncludeComments(!includeComments)} />
                                <div className={`block w-11 h-6 rounded-full transition-colors ${includeComments ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${includeComments ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                        </label>
                        <div>
                            <span className="text-slate-700 dark:text-slate-300 font-medium block mb-2 text-sm uppercase tracking-wider opacity-80">Nível de detalhe</span>
                            <div className="flex bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-1 gap-1">
                                {(['conciso', 'detalhado', 'com exemplos'] as DetailLevel[]).map(level => (
                                <button key={level} onClick={() => setDetailLevel(level)} className={`flex-1 text-xs sm:text-sm capitalize py-2 px-1 rounded-md transition-all ${detailLevel === level ? 'bg-purple-600 text-white shadow-sm font-semibold' : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                    {level}
                                </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="text-slate-700 dark:text-slate-300 font-medium block mb-2 text-sm uppercase tracking-wider opacity-80">Formato de saída</span>
                            <div className="flex bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-1 gap-1">
                                {(['markdown', 'puro'] as OutputFormat[]).map(format => (
                                <button key={format} onClick={() => setOutputFormat(format)} className={`flex-1 text-xs sm:text-sm capitalize py-2 px-1 rounded-md transition-all ${outputFormat === format ? 'bg-purple-600 text-white shadow-sm font-semibold' : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                    {format === 'puro' ? 'Código Puro' : 'Markdown'}
                                </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </CollapsibleSection>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="w-full sm:w-auto">
                    <label 
                        htmlFor="advanced-toggle" 
                        className="flex items-center cursor-pointer select-none p-1"
                        title="Desbloqueia o modelo de IA mais potente e permite ajustar parâmetros como Temperatura e Top-K para um controle mais refinado."
                    >
                        <div className="relative">
                            <input type="checkbox" id="advanced-toggle" className="sr-only" checked={isAdvancedMode} onChange={() => setIsAdvancedMode(!isAdvancedMode)} />
                            <div className={`block w-14 h-8 rounded-full transition-colors ${isAdvancedMode ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isAdvancedMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                        <div className="ml-3 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                            <BrainCircuitIcon className="w-5 h-5" />
                            Modo Avançado
                        </div>
                    </label>
                    {isAdvancedMode && (
                        <div className="mt-2 ml-1 sm:ml-4 p-3 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-600 dark:text-slate-400 w-full sm:max-w-xs space-y-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                           <div title="Controla a criatividade da resposta. Valores mais altos (ex: 1.0) são mais criativos, enquanto valores mais baixos (ex: 0.2) são mais diretos e previsíveis.">
                                <div className="flex justify-between items-center mb-1">
                                    <label htmlFor="temperature" className="font-semibold text-slate-700 dark:text-slate-300">Temperatura</label>
                                    <span className="font-mono text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-1.5 rounded">{temperature.toFixed(1)}</span>
                                </div>
                                <input 
                                    type="range"
                                    id="temperature"
                                    min="0" max="1" step="0.1"
                                    value={temperature}
                                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Mais alto = Mais criativo</p>
                           </div>
                           <div title="Restringe a seleção de palavras da IA. Um valor menor (ex: 10) limita a escolha às palavras mais prováveis, tornando a resposta mais focada.">
                                <div className="flex justify-between items-center mb-1">
                                    <label htmlFor="topk" className="font-semibold text-slate-700 dark:text-slate-300">Top-K</label>
                                    <span className="font-mono text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-1.5 rounded">{topK}</span>
                                </div>
                                <input 
                                    type="range"
                                    id="topk"
                                    min="1" max="100" step="1"
                                    value={topK}
                                    onChange={(e) => setTopK(parseInt(e.target.value, 10))}
                                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Limita seleção de palavras</p>
                           </div>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => handleGeneratePrompt(userInput)}
                    disabled={isLoading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 text-sm sm:text-base"
                >
                    {isLoading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="O 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Gerando...</>) : (<><BoltIcon className="w-5 h-5" />Gerar Prompt</>)}
                </button>
            </div>
        </>
    );
}
