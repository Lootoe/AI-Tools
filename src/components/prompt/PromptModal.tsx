import React, { useState, useEffect } from 'react';
import { usePromptStore } from '@/stores/promptStore';
import { X, Save, Trash2, Sparkles } from 'lucide-react';

interface PromptModalProps {
  promptId: string | null;
  onClose: () => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({ promptId, onClose }) => {
  const { getPromptById, addPrompt, updatePrompt, deletePrompt } = usePromptStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (promptId) {
      const prompt = getPromptById(promptId);
      if (prompt) {
        setName(prompt.name);
        setDescription(prompt.description);
        setContent(prompt.content);
      }
    }
  }, [promptId, getPromptById]);

  const handleSave = () => {
    if (!name.trim() || !description.trim() || !content.trim()) {
      alert('请填写提示词名称、简介和内容');
      return;
    }

    if (promptId) {
      updatePrompt(promptId, name.trim(), description.trim(), content.trim());
    } else {
      addPrompt(name.trim(), description.trim(), content.trim());
    }
    onClose();
  };

  const handleDelete = () => {
    if (promptId && confirm('确定要删除这个提示词吗？')) {
      deletePrompt(promptId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-200/50 dark:border-gray-700/50 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  {promptId ? '编辑提示词' : '新建提示词'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {promptId ? '修改提示词信息' : '创建一个新的提示词模板'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-200 dark:scrollbar-thumb-purple-900/50 scrollbar-track-transparent">
          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <div className="w-1 h-1 rounded-full bg-purple-500" />
              提示词名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：代码审查、文档生成..."
              className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all duration-200 text-sm"
            />
          </div>

          {/* Description Input */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <div className="w-1 h-1 rounded-full bg-indigo-500" />
              简介
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简短描述这个提示词的用途..."
              className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all duration-200 text-sm"
            />
          </div>

          {/* Content Textarea */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <div className="w-1 h-1 rounded-full bg-purple-500" />
              提示词内容
            </label>
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="输入详细的提示词内容，支持多行..."
                rows={10}
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 resize-none font-mono text-sm leading-relaxed transition-all duration-200"
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500 bg-white/80 dark:bg-gray-900/80 px-2 py-0.5 rounded backdrop-blur-sm">
                {content.length} 字符
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50/80 dark:bg-gray-800/80 border-t border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
          <div>
            {promptId && (
              <button
                onClick={handleDelete}
                className="group px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
              >
                <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
                删除
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="group px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-md shadow-purple-500/30 hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
            >
              <Save size={14} className="group-hover:scale-110 transition-transform" />
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
