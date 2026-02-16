
import React, { useState, useEffect } from 'react';
import { usePromptGenerator } from './hooks/usePromptGenerator';
import { SparklesIcon, HistoryIcon, TrashIcon, PencilSquareIcon, TerminalIcon } from './components/Icons';
import { Accordion } from './components/Accordion';
import { AuthModal } from './components/AuthModal';
import { SavePresetModal } from './components/SavePresetModal';
import { Auth } from './components/Auth';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { HistoryPanel, HistoryActions } from './components/HistoryPanel';
import { ProfileManagement } from './components/ProfileManagement';
import { appTexts } from './data/texts';
import { ErrorToast } from './components/ErrorToast';

type View = 'main' | 'profile';

const App: React.FC = () => {
  const promptGenerator = usePromptGenerator();
  const { 
    user, 
    history, 
    isLoading,
    error,
    clearError,
    clearHistory, 
    selectedHistoryIds, 
    handleLoadPreset, 
    handleDeletePreset, 
    handleClearFields,
    groupSelectedHistory,
    handleGenerateCompositePrompt,
    deleteSelectedHistory
  } = promptGenerator;
  
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
    }
  }

  const onDeletePreset = () => {
    if(selectedPreset) {
        handleDeletePreset(selectedPreset);
        setSelectedPreset('');
    }
  }

  const onClearFields = () => {
    handleClearFields();
    setSelectedPreset('');
  }
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-7xl mb-6 flex justify-between items-center">
        <div className="text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 flex items-center gap-3">
                <SparklesIcon className="w-8 h-8" />
                {appTexts.title}
            </h1>
            <p className="mt-2 text-md text-slate-400 hidden sm:block">
              {appTexts.subtitle}
            </p>
        </div>
        <Auth user={user} onLoginClick={() => setIsAuthModalOpen(true)} onProfileClick={() => setView('profile')} />
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
                    >
                        <InputPanel 
                            promptGenerator={promptGenerator}
                            onSavePresetClick={() => setIsSavePresetModalOpen(true)}
                            selectedPreset={selectedPreset}
                            onSelectedPresetChange={onSelectPreset}
                            onDeletePreset={onDeletePreset}
                            onClearFields={onClearFields}
                        />
                    </Accordion>
                    
                    {/* Output Panel Card */}
                    <div className="bg-slate-800/50 rounded-2xl p-6 flex flex-col relative shadow-2xl shadow-slate-950/50 ring-1 ring-white/10 flex-grow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-slate-100">{appTexts.structuredPromptTitle}</h2>
                        </div>
                        <OutputPanel promptGenerator={promptGenerator} />
                    </div>
                </div>
                
                {/* Sidebar Column */}
                <div className="bg-slate-800/50 rounded-2xl p-6 flex flex-col shadow-2xl shadow-slate-950/50 ring-1 ring-white/10 col-span-1">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2"><HistoryIcon className="w-6 h-6" /> {appTexts.historyTitle}</h2>
                        {selectedHistoryIds.length > 0 
                            ? <HistoryActions {...promptGenerator} /> 
                            : (history.length > 0 && user && <button onClick={clearHistory} className="text-sm text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"><TrashIcon className="w-4 h-4" /> Limpar Tudo</button>)}
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
                >
                    <InputPanel 
                        promptGenerator={promptGenerator}
                        onSavePresetClick={() => setIsSavePresetModalOpen(true)}
                        selectedPreset={selectedPreset}
                        onSelectedPresetChange={onSelectPreset}
                        onDeletePreset={onDeletePreset}
                        onClearFields={onClearFields}
                    />
                </Accordion>
                <Accordion 
                    title={appTexts.outputPanelTitle}
                    icon={<TerminalIcon className="w-6 h-6"/>}
                    isOpen={promptGenerator.activePanel === 'output'}
                    onToggle={() => promptGenerator.setActivePanel('output')}
                >
                    <OutputPanel promptGenerator={promptGenerator} />
                </Accordion>
                <Accordion
                    title={appTexts.historyPanelTitle}
                    icon={<HistoryIcon className="w-6 h-6"/>}
                    isOpen={promptGenerator.activePanel === 'history'}
                    onToggle={() => promptGenerator.setActivePanel('history')}
                    headerContent={selectedHistoryIds.length > 0 
                        ? <HistoryActions {...promptGenerator} /> 
                        : (history.length > 0 && user && <button onClick={(e) => { e.stopPropagation(); clearHistory(); }} className="text-sm text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"><TrashIcon className="w-4 h-4" /> Limpar Tudo</button>)}
                >
                    <HistoryPanel promptGenerator={promptGenerator} />
                </Accordion>
            </main>
        </>
      ) : (
          <main className="w-full max-w-screen-2xl flex-grow">
            {user && <ProfileManagement promptGenerator={promptGenerator} onBack={() => setView('main')} />}
          </main>
      )}
      
      <ErrorToast 
        error={error} 
        onClose={clearError} 
        onLoginClick={() => setIsAuthModalOpen(true)} 
      />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <SavePresetModal isOpen={isSavePresetModalOpen} onClose={() => setIsSavePresetModalOpen(false)} onSave={promptGenerator.handleSavePreset} />
    </div>
  );
};

export default App;
