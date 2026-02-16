import React, { createContext, useContext, useState, useCallback } from 'react';

type ActivePanel = 'input' | 'output' | 'history';

interface PromptContextType {
    userInput: string;
    setUserInput: React.Dispatch<React.SetStateAction<string>>;
    structuredPrompt: string;
    setStructuredPrompt: React.Dispatch<React.SetStateAction<string>>;
    activePanel: ActivePanel;
    setActivePanel: React.Dispatch<React.SetStateAction<ActivePanel>>;
    isInputInvalid: boolean;
    setIsInputInvalid: React.Dispatch<React.SetStateAction<boolean>>;
    isCopied: boolean;
    setIsCopied: React.Dispatch<React.SetStateAction<boolean>>;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const PromptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userInput, setUserInput] = useState<string>('');
    const [structuredPrompt, setStructuredPrompt] = useState<string>('');
    const [activePanel, setActivePanel] = useState<ActivePanel>('input');
    const [isInputInvalid, setIsInputInvalid] = useState<boolean>(false);
    const [isCopied, setIsCopied] = useState<boolean>(false);

    return (
        <PromptContext.Provider value={{
            userInput, setUserInput,
            structuredPrompt, setStructuredPrompt,
            activePanel, setActivePanel,
            isInputInvalid, setIsInputInvalid,
            isCopied, setIsCopied
        }}>
            {children}
        </PromptContext.Provider>
    );
};

export const usePromptContext = () => {
    const context = useContext(PromptContext);
    if (context === undefined) {
        throw new Error('usePromptContext must be used within a PromptProvider');
    }
    return context;
};