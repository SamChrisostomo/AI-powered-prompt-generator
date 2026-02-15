
import { PromptMode, DetailLevel, OutputFormat } from './Prompt';

export interface Preset {
  id: string;
  name: string;
  promptMode: PromptMode;
  detailLevel: DetailLevel;
  outputFormat: OutputFormat;
  includeComments: boolean;
  isAdvancedMode: boolean;
}
