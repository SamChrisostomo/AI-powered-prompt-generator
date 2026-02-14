
import React, { useState } from 'react';
import { usePromptGenerator } from './hooks/usePromptGenerator';
import { PromptMode, DetailLevel, OutputFormat } from './models/Prompt';
import { supabase } from './config/supabase';
import { SparklesIcon, BrainCircuitIcon, ClipboardIcon, ClipboardCheckIcon, BoltIcon, HistoryIcon, TrashIcon, CodeBracketIcon, BugAntIcon, ArrowPathIcon, DocumentTextIcon, TableCellsIcon, HashtagIcon, BeakerIcon, PencilSquareIcon, TerminalIcon, Square2StackIcon, WandSparklesIcon } from './components/Icons';
import type { IconProps } from './components/Icons';
import { Accordion } from './components/Accordion';
import { AuthModal } from './components/AuthModal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Auth: React.FC<{ 
    user: ReturnType<typeof usePromptGenerator>['user'],
    onLoginClick: () => void,
 }> = ({ user, onLoginClick }) => {
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (user) {
        const avatarUrl = user.user_metadata?.avatar_url;
        return (
            <div className="flex items-center gap-4">
                 {avatarUrl ? (
                   <img src={avatarUrl} alt="User avatar" className="w-10 h-10 rounded-full" />
                ) : (
                   <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-purple-400">
                     {user.email?.charAt(0).toUpperCase()}
                   </div>
                )}
                <button onClick={handleLogout} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Logout</button>
            </div>
        );
    }

    return (
        <button onClick={onLoginClick} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Login / Registrar
        </button>
    );
};

const App: React.FC = () => {
  const {
    user,
    userInput, setUserInput,
    structuredPrompt,
    isLoading,
    isAdvancedMode, setIsAdvancedMode,
    error,
    isCopied,
    promptMode, setPromptMode,
    includeComments, setIncludeComments,
    detailLevel, setDetailLevel,
    outputFormat, setOutputFormat,
    history,
    handleGeneratePrompt,
    handleCopyToClipboard,
    loadFromHistory,
    clearHistory,
    activePanel, setActivePanel,
    isInputInvalid, setIsInputInvalid,
    selectedHistoryIds,
    toggleHistorySelection,
    deleteHistoryItem,
    deleteSelectedHistory,
    groupSelectedHistory,
    handleGenerateCompositePrompt,
  } = usePromptGenerator();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const getModePlaceholder = (): string => {
    switch(promptMode) {
      case 'codigo': return "Ex: Um hook em React chamado useDebounce que recebe um valor e um delay...";
      case 'debug': return "Ex: Recebo o erro 'cannot read property 'map' of undefined' no meu componente de lista...";
      case 'refatorar': return "Ex: Quero refatorar esta função para ser mais performática e usar async/await...";
      case 'documentacao': return "Ex: Preciso de documentação em formato JSDoc para este componente de Card...";
      case 'gerar_dados_ficticios': return "Ex: 10 usuários com nome, email e endereço no formato JSON...";
      case 'escrever_regex': return "Ex: Validar um e-mail que aceite o subdomínio '.co.uk'...";
      case 'criar_planos_de_teste': return "Ex: Casos de teste para a funcionalidade de login, incluindo cenários de sucesso e falha...";
      default: return "Ex: Crie um componente de botão em React com TypeScript e Tailwind CSS que tenha um estado de loading...";
    }
  }

  const modeOptions: { id: PromptMode; name: string; icon: React.ReactElement<IconProps> }[] = [
    { id: 'geral', name: 'Geral', icon: <SparklesIcon className="w-5 h-5 mr-2" /> },
    { id: 'codigo', name: 'Código', icon: <CodeBracketIcon className="w-5 h-5 mr-2" /> },
    { id: 'debug', name: 'Depurar', icon: <BugAntIcon className="w-5 h-5 mr-2" /> },
    { id: 'refatorar', name: 'Refatorar', icon: <ArrowPathIcon className="w-5 h-5 mr-2" /> },
    { id: 'documentacao', name: 'Doc', icon: <DocumentTextIcon className="w-5 h-5 mr-2" /> },
    { id: 'gerar_dados_ficticios', name: 'Dados', icon: <TableCellsIcon className="w-5 h-5 mr-2" /> },
    { id: 'escrever_regex', name: 'Regex', icon: <HashtagIcon className="w-5 h-5 mr-2" /> },
    { id: 'criar_planos_de_teste', name: 'Testes', icon: <BeakerIcon className="w-5 h-5 mr-2" /> },
  ];

  const renderModeIcon = (mode: PromptMode) => {
    const modeInfo = modeOptions.find(m => m.id === mode);
    return modeInfo ? React.cloneElement(modeInfo.icon, { className: 'w-5 h-5 text-slate-400' }) : null;
  }
  
  const handleUserInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
    if(isInputInvalid) {
      setIsInputInvalid(false);
    }
  }

  const inputPanelContent = (
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
      <textarea
        value={userInput}
        onChange={handleUserInputChange}
        placeholder={getModePlaceholder()}
        className={`w-full flex-grow bg-slate-900/70 border rounded-lg p-4 text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 resize-none ${isInputInvalid ? 'border-red-500 ring-2 ring-red-500/50 shake' : 'border-slate-700'}`}
        rows={10}
        aria-invalid={isInputInvalid}
      />
       {isInputInvalid && (
        <p className="mt-2 text-sm text-red-400">
          Por favor, insira uma descrição para o seu prompt.
        </p>
      )}
      <div className="mt-6 space-y-4">
        <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 text-slate-200">Personalizar Saída</h3>
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
        </div>
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
          {isLoading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Gerando...</>) : (<><BoltIcon className="w-5 h-5" />Gerar Prompt</>)}
        </button>
      </div>
    </>
  );

  const outputPanelContent = (
    <div className="w-full h-[60vh] sm:h-auto sm:flex-grow bg-slate-900/70 border border-slate-700 rounded-lg p-4 overflow-y-auto relative">
      {structuredPrompt && !isLoading && (
        <button 
            onClick={handleCopyToClipboard} 
            className="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors duration-200 p-2 rounded-md bg-slate-800/50 hover:bg-slate-700 z-10"
            aria-label="Copiar prompt"
        >
            {isCopied ? <ClipboardCheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
        </button>
      )}
      {isLoading ? (<div className="animate-pulse space-y-4"><div className="h-4 bg-slate-700 rounded w-1/4"></div><div className="h-8 bg-slate-700 rounded w-3/4"></div><div className="h-4 bg-slate-700 rounded w-1/4 mt-6"></div><div className="h-12 bg-slate-700 rounded w-full"></div><div className="h-4 bg-slate-700 rounded w-1/4 mt-6"></div><div className="h-16 bg-slate-700 rounded w-full"></div></div>) : error ? (<div className="text-red-400 flex flex-col items-center justify-center h-full"><p className="font-semibold">Erro!</p><p>{error}</p></div>) : structuredPrompt ? (
        <div className="prose prose-sm sm:prose-base prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {structuredPrompt}
          </ReactMarkdown>
        </div>
      ) : (<div className="text-slate-500 flex flex-col items-center justify-center h-full"><p>Seu prompt gerado aparecerá aqui...</p></div>)}
    </div>
  );

  const historyPanelContent = (
    <div className="w-full h-[60vh] sm:h-auto sm:flex-grow bg-slate-900/70 border border-slate-700 rounded-lg p-2 overflow-y-auto space-y-2">
      {history.length > 0 ? (
        history.map(item => {
            const isSelected = selectedHistoryIds.includes(item.id);
            return (
              <div 
                key={item.id} 
                className={`flex items-center justify-between p-3 rounded-md transition-all duration-200 ${isSelected ? 'bg-purple-900/50 ring-2 ring-purple-600' : 'bg-slate-800/50 hover:bg-slate-700/50'}`}
              >
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleHistorySelection(item.id)}
                        className="form-checkbox h-4 w-4 bg-slate-700 border-slate-600 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex items-center gap-2 overflow-hidden cursor-pointer flex-1" onClick={() => loadFromHistory(item)}>
                      {renderModeIcon(item.mode)}
                      <p className="text-sm text-slate-300 truncate pr-2">{item.userInput}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 flex-shrink-0">{new Date(item.timestamp).toLocaleTimeString()}</span>
                    <button onClick={(e) => { e.stopPropagation(); deleteHistoryItem(item.id); }} className="text-slate-500 hover:text-red-400 p-1 rounded-full transition-colors">
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
              </div>
            )
        })
      ) : (
        <div className="text-slate-500 flex flex-col items-center justify-center h-full text-center p-4">
          <p>{user ? 'Seus prompts gerados aparecerão aqui.' : 'Faça login para salvar e ver seu histórico.'}</p>
        </div>
      )}
    </div>
  );

  const HistoryActions = () => (
    <div className="flex items-center gap-2">
        <button onClick={groupSelectedHistory} title="Agrupar Prompts" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"><Square2StackIcon className="w-5 h-5"/></button>
        <button onClick={handleGenerateCompositePrompt} title="Gerar Prompt Composto" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"><WandSparklesIcon className="w-5 h-5"/></button>
        <button onClick={deleteSelectedHistory} title="Excluir Selecionados" className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-md transition-colors"><TrashIcon className="w-5 h-5"/></button>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-7xl mb-6 flex justify-between items-center">
        <div className="text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 flex items-center gap-3">
                <SparklesIcon className="w-8 h-8" />
                Gerador de Prompt
            </h1>
            <p className="mt-2 text-md text-slate-400 hidden sm:block">
              Transforme ideias em prompts poderosos para IAs de desenvolvimento.
            </p>
        </div>
        <Auth user={user} onLoginClick={() => setIsAuthModalOpen(true)} />
      </header>

      {/* Desktop Layout */}
      <main className="w-full max-w-screen-2xl hidden xl:grid grid-cols-1 xl:grid-cols-3 gap-8 flex-grow">
        <div className="bg-slate-800/50 rounded-2xl p-6 flex flex-col shadow-2xl shadow-slate-950/50 ring-1 ring-white/10 xl:col-span-1">
          {inputPanelContent}
        </div>
        <div className="bg-slate-800/50 rounded-2xl p-6 flex flex-col relative shadow-2xl shadow-slate-950/50 ring-1 ring-white/10 xl:col-span-1">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold text-slate-100">Prompt Estruturado</h2>
            </div>
            {outputPanelContent}
        </div>
        <div className="bg-slate-800/50 rounded-2xl p-6 flex flex-col shadow-2xl shadow-slate-950/50 ring-1 ring-white/10 lg:col-span-2 xl:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2"><HistoryIcon className="w-6 h-6" /> Histórico</h2>
            {selectedHistoryIds.length > 0 ? <HistoryActions /> : (history.length > 0 && <button onClick={clearHistory} className="text-sm text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"><TrashIcon className="w-4 h-4" /> Limpar Tudo</button>)}
          </div>
          {historyPanelContent}
        </div>
      </main>

      {/* Mobile & Tablet Layout */}
      <main className="w-full max-w-screen-2xl block xl:hidden space-y-4">
          <Accordion 
            title="Entrada" 
            icon={<PencilSquareIcon className="w-6 h-6"/>}
            isOpen={activePanel === 'input'}
            onToggle={() => setActivePanel('input')}
          >
            {inputPanelContent}
          </Accordion>
          <Accordion 
            title="Prompt Estruturado"
            icon={<TerminalIcon className="w-6 h-6"/>}
            isOpen={activePanel === 'output'}
            onToggle={() => setActivePanel('output')}
          >
            {outputPanelContent}
          </Accordion>
          <Accordion
            title="Histórico"
            icon={<HistoryIcon className="w-6 h-6"/>}
            isOpen={activePanel === 'history'}
            onToggle={() => setActivePanel('history')}
            headerContent={selectedHistoryIds.length > 0 ? <HistoryActions /> : (history.length > 0 && user && <button onClick={(e) => { e.stopPropagation(); clearHistory(); }} className="text-sm text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"><TrashIcon className="w-4 h-4" /> Limpar Tudo</button>)}
          >
            {historyPanelContent}
          </Accordion>
      </main>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default App;
