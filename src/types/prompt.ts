export interface Prompt {
  id: string;
  name: string;
  description: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface PromptFormData {
  name: string;
  description: string;
  content: string;
}
