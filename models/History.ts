
import { PromptMode } from './Prompt';

export interface HistoryItem {
  id: string;
  userInput: string;
  structuredPrompt: string;
  timestamp: number;
  mode: PromptMode;
}
