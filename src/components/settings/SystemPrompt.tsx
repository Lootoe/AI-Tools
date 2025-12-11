import React from 'react';
import { useModelStore } from '@/stores/modelStore';
import { Textarea } from '@/components/ui/Textarea';
import { Code2, Sparkles, Languages, Pencil } from 'lucide-react';

const DEFAULT_PROMPTS = [
  {
    name: '默认助手',
    prompt: '你是一个有帮助的AI助手。',
    icon: Sparkles,
    color: 'from-violet-500 to-purple-500',
  },
  {
    name: '代码助手',
    prompt: '你是一个专业的编程助手，擅长解释代码、调试问题和提供最佳实践建议。',
    icon: Code2,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: '创意写作',
    prompt: '你是一个富有创造力的写作助手，擅长创作故事、诗歌和各种文学作品。',
    icon: Pencil,
    color: 'from-orange-500 to-pink-500',
  },
  {
    name: '专业翻译',
    prompt: '你是一个专业的翻译助手，能够准确、流畅地在不同语言之间进行翻译。',
    icon: Languages,
    color: 'from-emerald-500 to-teal-500',
  },
];

export const SystemPrompt: React.FC = () => {
  const { systemPrompt, setSystemPrompt } = useModelStore();

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        系统提示词
      </h3>
      
      {/* Preset Prompts */}
      <div className="grid grid-cols-2 gap-2">
        {DEFAULT_PROMPTS.map((preset) => {
          const Icon = preset.icon;
          const isActive = systemPrompt === preset.prompt;
          return (
            <button
              key={preset.name}
              onClick={() => setSystemPrompt(preset.prompt)}
              className={`
                relative p-3 rounded-xl text-left transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 border-2 border-purple-200 dark:border-purple-700' 
                  : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:border-purple-200 dark:hover:border-purple-800'
                }
              `}
            >
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${preset.color} flex items-center justify-center mb-2 shadow-sm`}>
                <Icon size={14} className="text-white" />
              </div>
              <span className={`text-xs font-medium ${isActive ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'}`}>
                {preset.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom Prompt Input */}
      <div className="space-y-2">
        <Textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="输入自定义系统提示词..."
          className="min-h-[120px] resize-none rounded-xl border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20"
        />
        
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          系统提示词会在每次对话开始时发送给AI，用于定义其行为和角色
        </p>
      </div>
    </div>
  );
};
