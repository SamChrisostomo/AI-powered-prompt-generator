
import { PromptMode } from '../models/Prompt';

export const getModePlaceholder = (promptMode: PromptMode): string => {
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

export const appTexts = {
    title: "Gerador de Prompt",
    subtitle: "Transforme ideias em prompts poderosos para IAs de desenvolvimento.",
    structuredPromptTitle: "Prompt Estruturado",
    historyTitle: "Histórico",
    loginButton: "Login / Registrar",
    logoutButton: "Logout",
    inputPanelTitle: "Entrada",
    outputPanelTitle: "Prompt Estruturado",
    historyPanelTitle: "Histórico",
};
