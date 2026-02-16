
import { PromptMode } from '../models/Prompt';

export const ROLE_TEMPLATES: Record<PromptMode, string> = {
    codigo: `### 👤 PAPEL (ROLE)
**Assuma o papel de:** Um engenheiro de software sênior especialista na linguagem/framework solicitada.

### 📝 TAREFA (TASK)
**Sua tarefa é:** Gerar o código solicitado, seguindo as melhores práticas e convenções.

### CONTEXTO (CONTEXT)
**Detalhes e Requisitos:**
*   **Linguagem/Framework:** [Especifique a linguagem, framework e versões]
*   **Funcionalidade:** [Descreva em detalhes o que o código deve fazer]
*   **Dependências:** [Liste quaisquer dependências externas]
*   **Exemplos de Entrada/Saída:** [Forneça exemplos claros do que é esperado]

`,
    debug: `### 👤 PAPEL (ROLE)
**Assuma o papel de:** Um depurador de código experiente e meticuloso.

### 📝 TAREFA (TASK)
**Sua tarefa é:** Analisar o código e o erro fornecidos, identificar a causa raiz do problema e propor uma solução clara e corrigida.

### CONTEXTO (CONTEXT)
**Detalhes do Problema:**
*   **Mensagem de Erro:** [Cole a mensagem de erro completa e o stack trace, se houver]
*   **Código com Problema:** [Cole o trecho de código relevante onde o erro ocorre]
*   **Comportamento Esperado:** [Descreva o que o código deveria fazer]
*   **Comportamento Atual:** [Descreva o que o código está fazendo de errado]
*   **O que já foi tentado:** [Liste as tentativas de solução que não funcionaram]

`,
    refatorar: `### 👤 PAPEL (ROLE)
**Assuma o papel de:** Um arquiteto de software focado em código limpo, performance e manutenibilidade.

### 📝 TAREFA (TASK)
**Sua tarefa é:** Refatorar o código fornecido para atingir os objetivos especificados.

### CONTEXTO (CONTEXT)
**Detalhes da Refatoração:**
*   **Código Atual:** [Cole o bloco de código a ser refatorado]
*   **Objetivo Principal:** [Ex: Melhorar a legibilidade, aumentar a performance, reduzir complexidade, aplicar um design pattern específico]
*   **Requisitos Específicos:** [Ex: Extrair para funções menores, remover duplicação, usar features mais modernas da linguagem]
*   **O que não deve mudar:** [Ex: A assinatura da função principal, o comportamento externo]

`,
    documentacao: `### 👤 PAPEL (ROLE)
**Assuma o papel de:** Um redator técnico especialista em documentação de software.

### 📝 TAREFA (TASK)
**Sua tarefa é:** Criar uma documentação clara, concisa e completa para o código fornecido.

### CONTEXTO (CONTEXT)
**Detalhes da Documentação:**
*   **Código a ser documentado:** [Cole o código (função, classe, componente, etc.)]
*   **Formato da Documentação:** [Ex: JSDoc, TSDoc, Python Docstrings, Markdown]
*   **Pontos a cobrir:** [Ex: Descrição geral, parâmetros/props, tipo de retorno, exemplos de uso, exceções/erros]
*   **Público Alvo:** [Ex: Desenvolvedores da equipe, usuários da API]

`,
    gerar_dados_ficticios: `### 👤 PAPEL (ROLE)
**Assuma o papel de:** Um gerador de dados sintéticos (mock data).

### 📝 TAREFA (TASK)
**Sua tarefa é:** Criar uma lista de dados fictícios com base na estrutura e nos requisitos fornecidos.

### CONTEXTO (CONTEXT)
**Detalhes dos Dados:**
*   **Formato de Saída:** [Ex: Array de objetos JSON, CSV, SQL Inserts]
*   **Quantidade de Registros:** [Ex: 10, 50, 100]
*   **Estrutura/Schema do Objeto:** [Defina os campos e tipos de dados. Ex: { id: number, nome: string, email: string, data_cadastro: date }]
*   **Restrições e Regras:** [Ex: O 'id' deve ser sequencial, o 'email' deve ser único, a 'data_cadastro' deve ser nos últimos 30 dias]

`,
    escrever_regex: `### 👤 PAPEL (ROLE)
**Assuma o papel de:** Um especialista em Expressões Regulares (Regex).

### 📝 TAREFA (TASK)
**Sua tarefa é:** Criar uma expressão regular que valide ou extraia os padrões descritos, explicando cada parte da expressão.

### CONTEXTO (CONTEXT)
**Detalhes da Expressão Regular:**
*   **Objetivo:** [Ex: Validar um formato de CPF, extrair URLs de um texto, verificar a força de uma senha]
*   **Strings de Exemplo (Match):** [Liste exemplos de strings que a regex DEVE corresponder]
*   **Strings de Exemplo (Não-Match):** [Liste exemplos de strings que a regex NÃO DEVE corresponder]
*   **Flavor/Engine:** [Ex: JavaScript, Python, PCRE, .NET]
*   **Requisitos Adicionais:** [Ex: Deve ser case-insensitive, deve capturar grupos específicos]

`,
    criar_planos_de_teste: `### 👤 PAPEL (ROLE)
**Assuma o papel de:** Um Engenheiro de Qualidade (QA) experiente.

### 📝 TAREFA (TASK)
**Sua tarefa é:** Criar um plano de teste detalhado para a funcionalidade descrita.

### CONTEXTO (CONTEXT)
**Detalhes da Funcionalidade a ser Testada:**
*   **Funcionalidade:** [Descreva em detalhes o recurso ou user story. Ex: "Login de usuário com e-mail e senha"]
*   **Requisitos Funcionais e de Negócio:** [Liste os critérios de aceite e o que a funcionalidade deve fazer]
*   **Tipos de Teste a Incluir:** [Ex: Testes de unidade, testes de integração, testes de UI (end-to-end), testes de regressão]
*   **Formato do Plano de Teste:** [Ex: Tabela com Colunas: ID do Caso de Teste, Descrição, Passos para Reproduzir, Resultado Esperado]
*   **Casos de Borda e Cenários Negativos a Considerar:** [Ex: Inputs inválidos, senhas erradas, e-mails mal formatados, falhas de rede]

`,
    geral: `### 👤 PAPEL (ROLE)
**Assuma o papel de:** [Descreva o papel/persona que a IA deve assumir. Ex: "um engenheiro de software sênior especialista em React e performance."]

### 📝 TAREFA (TASK)
**Sua tarefa é:** [Descreva a tarefa principal de forma clara, concisa e acionável. Comece com um verbo. Ex: "Criar um componente React...", "Refatorar o seguinte código...", "Escrever testes unitários para a função..."].

### CONTEXTO (CONTEXT)
**Detalhes e Restrições:**
*   **Tecnologias:** [Liste as tecnologias, frameworks, linguagens e versões. Ex: React 18, TypeScript 5, Tailwind CSS 3]
*   **Objetivo:** [Explique o objetivo final e o porquê desta tarefa.]
*   **Requisitos:** [Liste os requisitos específicos em formato de bullet points.]
*   **O que evitar:** [Liste o que a IA não deve fazer.]

`
};

export const SYSTEM_INSTRUCTIONS = {
    SINGLE: `Você é um especialista em engenharia de prompts para IAs de desenvolvimento (como Cursor AI, GitHub Copilot, Google AI Studio).
Sua tarefa é pegar a ideia bruta de um usuário e transformá-la em um prompt estruturado, claro, detalhado e altamente eficaz que maximizará a qualidade da resposta da IA.

Preencha o template abaixo usando a ideia do usuário. Seja detalhado e infira informações contextuais quando apropriado para tornar o prompt o mais útil possível.`,

    COMPOSITE: `Você é um especialista em engenharia de prompts para IAs de desenvolvimento.
Sua tarefa é sintetizar as múltiplas ideias de usuário abaixo em um único prompt estruturado, coeso e abrangente. Encontre um tema comum ou crie um fluxo lógico que conecte as ideias. Gere um único prompt final preenchendo o template com o máximo de detalhes possível, inferindo o contexto a partir da combinação das ideias.`
};
