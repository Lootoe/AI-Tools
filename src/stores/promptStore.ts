import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Prompt } from '@/types/prompt';

interface PromptStore {
  prompts: Prompt[];
  selectedPromptId: string | null;
  
  // Actions
  addPrompt: (name: string, description: string, content: string) => void;
  updatePrompt: (id: string, name: string, description: string, content: string) => void;
  deletePrompt: (id: string) => void;
  selectPrompt: (id: string | null) => void;
  getPromptById: (id: string) => Prompt | undefined;
}

const defaultPrompts: Prompt[] = [
  {
    id: '1',
    name: '代码审查',
    description: '全面审查代码质量、安全性和性能',
    content: '请帮我审查以下代码，关注：\n1. 代码质量和可读性\n2. 潜在的bug和安全问题\n3. 性能优化建议\n4. 最佳实践',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    name: '文档生成',
    description: '自动生成详细的代码文档和注释',
    content: '请为以下代码生成详细的文档，包括：\n1. 功能说明\n2. 参数说明\n3. 返回值说明\n4. 使用示例',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '3',
    name: '代码优化',
    description: '提升代码性能和可维护性',
    content: '请帮我优化以下代码，重点关注：\n1. 性能提升\n2. 代码简洁性\n3. 可维护性\n4. 遵循最佳实践',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export const usePromptStore = create<PromptStore>()(
  persist(
    (set, get) => ({
      prompts: defaultPrompts,
      selectedPromptId: null,

      addPrompt: (name: string, description: string, content: string) => {
        const newPrompt: Prompt = {
          id: Date.now().toString(),
          name,
          description,
          content,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          prompts: [...state.prompts, newPrompt],
        }));
      },

      updatePrompt: (id: string, name: string, description: string, content: string) => {
        set((state) => ({
          prompts: state.prompts.map((prompt) =>
            prompt.id === id
              ? { ...prompt, name, description, content, updatedAt: Date.now() }
              : prompt
          ),
        }));
      },

      deletePrompt: (id: string) => {
        set((state) => ({
          prompts: state.prompts.filter((prompt) => prompt.id !== id),
          selectedPromptId: state.selectedPromptId === id ? null : state.selectedPromptId,
        }));
      },

      selectPrompt: (id: string | null) => {
        set({ selectedPromptId: id });
      },

      getPromptById: (id: string) => {
        return get().prompts.find((prompt) => prompt.id === id);
      },
    }),
    {
      name: 'prompt-storage',
    }
  )
);
