
import React, { useState, useEffect, Suspense } from 'react';
import { usePromptGenerator } from './hooks/usePromptGenerator';
import { useHistory } from './hooks/useHistory';
import { usePresets } from './hooks/usePresets';
import { SparklesIcon, HistoryIcon, PencilSquareIcon, TerminalIcon, ClipboardIcon, ClipboardCheckIcon, XCircleIcon } from './components/Icons';
import { Accordion } from './components/Accordion';
import { Auth } from './components/Auth';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { HistoryPanel, HistoryActions } from './components/HistoryPanel';
import { appTexts } from './data/texts';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { Toaster, toast } from 'react-hot-toast';

// Code Splitting: Lazy load components that are not immediately visible or heavy
const AuthModal = React.lazy(() => import('./components/AuthModal').then(module => ({ default: module.AuthModal })));
const SavePresetModal = React.lazy(() => import('./components/SavePresetModal').then(module => ({ default: module.SavePresetModal })));
const ProfileManagement = React.lazy(() => import('./components/ProfileManagement').then(module => ({ default: module.ProfileManagement })));

type View = 'main' | 'profile';

const LoadingFallback = () => <div className="p-4 flex justify-center"><svg className="animate-spin h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>;

const App: React.FC = () => {
  const promptGenerator = usePromptGenerator();
  const { 
    user, 
    isLoading,
    error,
    clearError,
    handleLoadPreset, 
    handleClearFields,
    groupSelectedHistory,
    handleGenerateCompositePrompt,
    theme,
    setTheme,
    structuredPrompt,
    handleCopyToClipboard,
    isCopied
  } = promptGenerator;

  // Independent hooks for App actions
  const { deleteSelectedHistory, clearHistory, history, selectedHistoryIds } = useHistory();
  const { removePreset } = usePresets();
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSavePresetModalOpen, setIsSavePresetModalOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [isDesktopInputOpen, setIsDesktopInputOpen] = useState(true);
  const [view, setView] = useState<View>('main');

  useEffect(() => {
    if (isLoading) {
        setIsDesktopInputOpen(false);
    }
  }, [isLoading]);

  // Global Error Handling via Toast
  useEffect(() => {
    if (error) {
        toast.error(error);
        clearError();
    }
  }, [error, clearError]);

  // Reset to main view if user logs out
  useEffect(() => {
    if (!user && view === 'profile') {
        setView('main');
    }
  }, [user, view]);

  const onSelectPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetId = e.target.value;
    setSelectedPreset(presetId);
    if(presetId) {
        handleLoadPreset(presetId);
        toast.success("Preset carregado!");
    }
  }

  const onDeletePreset = async () => {
    if(selectedPreset) {
        await removePreset(selectedPreset);
        setSelectedPreset('');
        toast.success("Preset removido.");
    }
  }

  const onClearFields = () => {
    handleClearFields();
    setSelectedPreset('');
    toast('Campos limpos', { icon: '🧹' });
  }

  const clearFieldsButton = (
    <button 
        onClick={(e) => { e.stopPropagation(); onClearFields(); }}
        className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1 focus:outline-none"
        title="Limpar todos os campos"
    >
        <XCircleIcon className="w-5 h-5" /> 
        <span className="hidden sm:inline">Limpar</span>
    </button>
  );
  
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Toaster position="bottom-center" toastOptions={{
          className: 'dark:bg-slate-800 dark:text-white',
          style: {
            background: 'var(--tw-bg-opacity, #fff)',
            color: 'var(--tw-text-opacity, #333)',
          }
      }} />
      <header className="w-full max-w-7xl mb-6 flex justify-between items-center">
        <div className="text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 dark:from-purple-400 dark:to-cyan-400 flex items-center gap-3">
                <SparklesIcon className="w-8 h-8" />
                {appTexts.title}
            </h1>
            <p className="mt-2 text-md text-slate-500 dark:text-slate-400 hidden sm:block">
              {appTexts.subtitle}
            </p>
        </div>
        <div className="flex items-center gap-4">
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
            <Auth user={user} onLoginClick={() => setIsAuthModalOpen(true)} onProfileClick={() => setView('profile')} />
        </div>
      </header>

      {view === 'main' ? (
        <>
            {/* Desktop Layout */}
            <main className="w-full max-w-screen-2xl hidden xl:grid grid-cols-3 gap-8 flex-grow">
                {/* Main Content Column */}
                <div className="col-span-2 flex flex-col gap-8">
                    <Accordion
                        title={appTexts.inputPanelTitle}
                        icon={<PencilSquareIcon className="w-6 h-6" />}
                        isOpen={isDesktopInputOpen}
                        onToggle={() => setIsDesktopInputOpen(!isDesktopInputOpen)}
                        headerContent={clearFieldsButton}
                    >
                        <InputPanel 
                            promptGenerator={promptGenerator}
                            onSavePresetClick={() => setIsSavePresetModalOpen(true)}
                            selectedPreset={selectedPreset}
                            onSelectedPresetChange={onSelectPreset}
                            onDeletePreset={onDeletePreset}
                        />
                    </Accordion>
                    
                    {/* Output Panel Card */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 flex flex-col relative shadow-2xl shadow-slate-950/50 ring-1 ring-slate-200 dark:ring-white/10 flex-grow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{appTexts.structuredPromptTitle}</h2>
                            <button
                                onClick={handleCopyToClipboard}
                                disabled={!structuredPrompt || isLoading}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border
                                    ${isCopied 
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700' 
                                        : 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-slate-700'
                                    }
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:dark:bg-slate-800 disabled:text-slate-400 disabled:border-slate-200 disabled:dark:border-slate-700
                                `}
                            >
                                {isCopied ? (
                                    <>
                                        <ClipboardCheckIcon className="w-5 h-5" />
                                        Copiado!
                                    </>
                                ) : (
                                    <>
                                        <ClipboardIcon className="w-5 h-5" />
                                        Copiar prompt
                                    </>
                                )}
                            </button>
                        </div>
                        {/* Optimized Prop Passing for Memoization */}
                        <OutputPanel structuredPrompt={structuredPrompt} isLoading={isLoading} />
                    </div>
                </div>
                
                {/* Sidebar Column */}
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 flex flex-col shadow-2xl shadow-slate-950/50 ring-1 ring-slate-200 dark:ring-white/10 col-span-1">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2"><HistoryIcon className="w-6 h-6" /> {appTexts.historyTitle}</h2>
                        {selectedHistoryIds.length > 0 
                            ? <HistoryActions groupSelectedHistory={groupSelectedHistory} handleGenerateCompositePrompt={handleGenerateCompositePrompt} deleteSelectedHistory={deleteSelectedHistory} /> 
                            : (history && history.length > 0 && user && <button onClick={() => clearHistory()} className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1"><XCircleIcon className="w-4 h-4" /> Limpar Histórico Completo</button>)}
                    </div>
                    <HistoryPanel promptGenerator={promptGenerator} />
                </div>
            </main>

            {/* Mobile & Tablet Layout */}
            <main className="w-full max-w-screen-2xl block xl:hidden space-y-4">
                <Accordion 
                    title={appTexts.inputPanelTitle} 
                    icon={<PencilSquareIcon className="w-6 h-6"/>}
                    isOpen={promptGenerator.activePanel === 'input'}
                    onToggle={() => promptGenerator.setActivePanel('input')}
                    headerContent={clearFieldsButton}
                >
                    <InputPanel 
                        promptGenerator={promptGenerator}
                        onSavePresetClick={() => setIsSavePresetModalOpen(true)}
                        selectedPreset={selectedPreset}
                        onSelectedPresetChange={onSelectPreset}
                        onDeletePreset={onDeletePreset}
                    />
                </Accordion>
                <Accordion 
                    title={appTexts.outputPanelTitle}
                    icon={<TerminalIcon className="w-6 h-6"/>}
                    isOpen={promptGenerator.activePanel === 'output'}
                    onToggle={() => promptGenerator.setActivePanel('output')}
                    headerContent={
                        <button
                            onClick={(e) => { e.stopPropagation(); handleCopyToClipboard(); }}
                            disabled={!structuredPrompt || isLoading}
                            className={`
                                p-2 rounded-md transition-colors border
                                ${isCopied 
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700' 
                                    : 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-slate-700'
                                }
                                disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-slate-400 disabled:border-transparent
                            `}
                            title="Copiar prompt"
                        >
                            {isCopied ? <ClipboardCheckIcon className="w-5 h-5" /> : <ClipboardIcon className="w-5 h-5" />}
                        </button>
                    }
                >
                    <OutputPanel structuredPrompt={structuredPrompt} isLoading={isLoading} />
                </Accordion>
                <Accordion
                    title={appTexts.historyPanelTitle}
                    icon={<HistoryIcon className="w-6 h-6"/>}
                    isOpen={promptGenerator.activePanel === 'history'}
                    onToggle={() => promptGenerator.setActivePanel('history')}
                    headerContent={selectedHistoryIds.length > 0 
                        ? <HistoryActions groupSelectedHistory={groupSelectedHistory} handleGenerateCompositePrompt={handleGenerateCompositePrompt} deleteSelectedHistory={deleteSelectedHistory} /> 
                        : (history && history.length > 0 && user && <button onClick={(e) => { e.stopPropagation(); clearHistory(); }} className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1"><XCircleIcon className="w-4 h-4" /> Limpar Histórico Completo</button>)}
                >
                    <HistoryPanel promptGenerator={promptGenerator} />
                </Accordion>
            </main>
        </>
      ) : (
          <main className="w-full max-w-screen-2xl flex-grow">
            {user && (
                <Suspense fallback={<LoadingFallback />}>
                    <ProfileManagement promptGenerator={promptGenerator} onBack={() => setView('main')} />
                </Suspense>
            )}
          </main>
      )}
      
      <Suspense fallback={null}>
        {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />}
        {isSavePresetModalOpen && <SavePresetModal isOpen={isSavePresetModalOpen} onClose={() => setIsSavePresetModalOpen(false)} onSave={promptGenerator.handleSavePreset} />}
      </Suspense>
    </div>
  );
};

export default App;
