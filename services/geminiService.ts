
import { generatePrompt } from '../repositories/geminiRepository';

const OPTIMIZE_SYSTEM_PROMPT = `Sua tarefa é atuar como um assistente de refinamento de ideias. O usuário fornecerá uma ideia bruta ou uma solicitação curta. Você deve reescrever e expandir essa ideia para torná-la uma solicitação muito mais clara, detalhada e contextualizada para ser usada em outra IA de desenvolvimento.

**O que fazer:**
- Mantenha a intenção original do usuário.
- Adicione detalhes técnicos relevantes que possam ser inferidos.
- Esclareça ambiguidades.
- Estruture a solicitação de forma lógica.
- Não adicione seções como "### PAPEL" ou "### TAREFA". Apenas reescreva a solicitação do usuário.
- Responda apenas com o texto refinado, sem nenhuma introdução ou comentário seu.

**Exemplo:**
- **Entrada do usuário:** "um botão com estado de loading"
- **Sua saída esperada:** "Criar um componente de botão em React que utiliza TypeScript e Tailwind CSS. O botão deve aceitar uma propriedade 'isLoading' (booleana). Quando 'isLoading' for verdadeiro, o botão deve ficar desabilitado, exibir um ícone de spinner animado e o texto deve mudar para 'Carregando...'. O componente também deve aceitar todas as outras props de um botão HTML padrão."`;

export const optimizeUserInput = async (userInput: string): Promise<string> => {
  if (!userInput.trim()) {
    return userInput;
  }

  const contents = `${OPTIMIZE_SYSTEM_PROMPT}\n\n**Entrada do usuário:** "${userInput}"`;

  try {
    // FIX: Updated model name from deprecated 'gemini-flash-latest' to 'gemini-3-flash-preview' for basic text tasks as per guidelines.
    const optimizedText = await generatePrompt('gemini-3-flash-preview', contents, {
      temperature: 0.7,
    });
    return optimizedText.trim();
  } catch (error) {
    console.error("Erro ao otimizar o texto:", error);
    // Retorna o texto original em caso de falha para não interromper o fluxo do usuário
    return userInput;
  }
};
