
import { generatePrompt } from '../repositories/geminiRepository';
import { PromptOptions } from '../models/Prompt';
import { ROLE_TEMPLATES, SYSTEM_INSTRUCTIONS } from '../data/promptTemplates';
import { GenerateContentParameters } from '@google/genai';

/**
 * Builds the string for formatting instructions based on user options.
 */
const getOutputInstructions = (options: PromptOptions): string => {
    const { outputFormat, includeComments, detailLevel } = options;
    
    let instruction = `### 📤 FORMATO DE SAÍDA (OUTPUT FORMAT)\n**Entregue sua resposta como:** `;

    if (outputFormat === 'puro') {
        instruction += `Um único bloco de código, sem explicações ou markdown.`;
    } else {
        instruction += `Uma resposta em markdown bem formatada.`;
    }

    const details: string[] = [];
    
    if (includeComments) {
        if (outputFormat === 'puro') {
            details.push(`o código DEVE incluir comentários explicativos`);
        } else {
            details.push(`a resposta DEVE incluir explicações detalhadas`);
        }
    }

    if (detailLevel) {
        details.push(`o nível de detalhe deve ser **${detailLevel}**`);
        if (detailLevel === 'com exemplos') {
            details.push('incluindo exemplos de uso práticos');
        }
    }
    
    if (details.length > 0) {
        instruction += `\n*   **Diretrizes:** ${details.join(', ')}.`;
    }
    
    return instruction;
};

/**
 * Creates the Gemini API configuration object.
 */
const getGeminiConfig = (isAdvancedMode: boolean, options: PromptOptions): { modelName: string; config: GenerateContentParameters['config'] } => {
    if (isAdvancedMode) {
        return {
            modelName: 'gemini-3-pro-preview',
            config: {
                temperature: options.temperature ?? 0.8,
                topK: options.topK ?? 64,
                // Enabling thinking for advanced tasks on the pro model
                thinkingConfig: { thinkingBudget: 32768 }
            }
        };
    }
    
    return {
        modelName: 'gemini-3-flash-preview',
        config: { 
            temperature: 0.5 
        }
    };
};

/**
 * Core function to execute the generation request.
 */
const executeGeneration = async (contents: string, isAdvancedMode: boolean, options: PromptOptions): Promise<string> => {
    const { modelName, config } = getGeminiConfig(isAdvancedMode, options);
    return generatePrompt(modelName, contents, config);
};

export const generateStructuredPrompt = async (userInput: string, isAdvancedMode: boolean, options: PromptOptions): Promise<string> => {
  const modeTemplate = ROLE_TEMPLATES[options.mode] || ROLE_TEMPLATES['geral'];
  const outputTemplate = getOutputInstructions(options);
  
  const contents = `${SYSTEM_INSTRUCTIONS.SINGLE}

**TEMPLATE:**
---
${modeTemplate}
${outputTemplate}
---

**Ideia bruta do usuário a ser convertida:**
"${userInput}"`;

  return executeGeneration(contents, isAdvancedMode, options);
};

export const generateCompositeStructuredPrompt = async (userInputs: string[], isAdvancedMode: boolean, options: PromptOptions): Promise<string> => {
    const combinedIdeas = userInputs.map((input, index) => `Idéia ${index + 1}: "${input}"`).join('\n');
    
    const outputTemplate = getOutputInstructions(options);
    // For composite prompts, we always use the general template as the base structure
    const modeTemplate = ROLE_TEMPLATES['geral'];

    const contents = `${SYSTEM_INSTRUCTIONS.COMPOSITE}

**Múltiplas ideias brutas do usuário a serem combinadas:**
---
${combinedIdeas}
---

**TEMPLATE A SER PREENCHIDO:**
---
${modeTemplate}
${outputTemplate}
---`;
    
    return executeGeneration(contents, isAdvancedMode, options);
};
