// AI模型提供商类型
export type ModelProvider = 'openai' | 'anthropic' | 'qwen' | 'custom';

// AI模型配置
export interface AIModel {
    id: string;
    name: string;
    provider: ModelProvider;
    description?: string;
    maxTokens?: number;
    supportsWebSearch?: boolean;  // 是否支持联网搜索
    supportsDeepThinking?: boolean;  // 是否支持深度思考
}

// 模型参数配置
export interface ModelParameters {
    temperature: number;      // 0-2, 控制随机性
    maxTokens: number;        // 最大生成token数
    topP: number;             // 0-1, 核采样
    frequencyPenalty: number; // -2 to 2, 频率惩罚
    presencePenalty: number;  // -2 to 2, 存在惩罚
}

// 预设模型列表
export const AVAILABLE_MODELS: AIModel[] = [
    {
        id: 'gpt-5.1-thinking',
        name: 'GPT-5.1 Thinking',
        provider: 'openai',
        description: 'GPT-5.1 推理模型',
        maxTokens: 128000,
        supportsWebSearch: true,
        supportsDeepThinking: true,
    },
    {
        id: 'gpt-5.1',
        name: 'GPT-5.1',
        provider: 'openai',
        description: 'GPT-5.1 标准模型',
        maxTokens: 128000,
        supportsWebSearch: true,
        supportsDeepThinking: false,
    },
    {
        id: 'gpt-5-codex',
        name: 'GPT-5 Codex',
        provider: 'openai',
        description: 'GPT-5 代码专用模型',
        maxTokens: 128000,
        supportsWebSearch: false,
        supportsDeepThinking: false,
    },
    {
        id: 'claude-opus-4-5-20251101-thinking',
        name: 'Claude Opus 4.5 Thinking',
        provider: 'anthropic',
        description: 'Claude Opus 4.5 推理模型',
        maxTokens: 200000,
        supportsWebSearch: true,
        supportsDeepThinking: true,
    },
    {
        id: 'claude-sonnet-4-5-20250929',
        name: 'Claude Sonnet 4.5',
        provider: 'anthropic',
        description: 'Claude Sonnet 4.5 模型',
        maxTokens: 200000,
        supportsWebSearch: true,
        supportsDeepThinking: false,
    },
    {
        id: 'gemini-3-pro-preview-thinking-*',
        name: 'gemini-3-pro-preview-thinking-*',
        provider: 'custom',
        description: 'Gemini 3 Pro 推理预览版',
        maxTokens: 100000,
        supportsWebSearch: true,
        supportsDeepThinking: true,
    },
    {
        id: 'gemini-3-pro-preview',
        name: 'Gemini 3 Pro Preview',
        provider: 'custom',
        description: 'Gemini 3 Pro 预览版',
        maxTokens: 100000,
        supportsWebSearch: true,
        supportsDeepThinking: false,
    },
    {
        id: 'doubao-lite-32k',
        name: '豆包 Lite 32K',
        provider: 'custom',
        description: '豆包轻量级模型',
        maxTokens: 32000,
        supportsWebSearch: true,
        supportsDeepThinking: false,
    },
    {
        id: 'deepseek-v3-250324',
        name: 'DeepSeek V3',
        provider: 'custom',
        description: 'DeepSeek V3 模型',
        maxTokens: 64000,
        supportsWebSearch: false,
        supportsDeepThinking: true,
    },
];

// 默认参数
export const DEFAULT_PARAMETERS: ModelParameters = {
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
};
