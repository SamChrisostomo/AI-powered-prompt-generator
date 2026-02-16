
export type PromptMode = 'geral' | 'codigo' | 'debug' | 'refatorar' | 'documentacao' | 'gerar_dados_ficticios' | 'escrever_regex' | 'criar_planos_de_teste';
export type DetailLevel = 'conciso' | 'detalhado' | 'com exemplos';
export type OutputFormat = 'markdown' | 'puro';

export interface PromptOptions {
  mode: PromptMode;
  includeComments: boolean;
  detailLevel: DetailLevel;
  outputFormat: OutputFormat;
  temperature?: number;
  topK?: number;
}
