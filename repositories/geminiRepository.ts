
import { ai } from '../config/gemini';
import { GenerateContentParameters } from '@google/genai';

export const generatePrompt = async (
  modelName: string,
  contents: string,
  config: GenerateContentParameters['config']
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: config,
    });

    if (response.text) {
      return response.text;
    } else {
      throw new Error("A resposta da API estava vazia.");
    }
  } catch (error) {
    console.error(`Erro ao chamar a API Gemini (${modelName}):`, error);
    throw new Error('Falha ao comunicar com a API Gemini.');
  }
};
