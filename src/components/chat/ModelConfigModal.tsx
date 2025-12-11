import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Check, Sparkles, Globe, Brain, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { useModelStore } from '@/stores/modelStore';
import { useChatStore } from '@/stores/chatStore';
import { AVAILABLE_MODELS } from '@/types/models';
import { cn } from '@/lib/utils';

interface ModelConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelConfigModal: React.FC<ModelConfigModalProps> = ({ isOpen, onClose }) => {
  const { currentModel, setModel, parameters, setParameters, resetParameters } = useModelStore();
  const { webSearchEnabled, deepThinkingEnabled, setWebSearchEnabled, setDeepThinkingEnabled } =
    useChatStore();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredModels = AVAILABLE_MODELS.filter(
    (model) =>
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      {/* Modal */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-[900px] h-[600px] flex flex-col overflow-hidden border border-gray-200/50 dark:border-gray-700/50 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-indigo-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">模型配置</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">选择模型并调整参数</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 min-h-0">
          {/* Left - Model List */}
          <div className="w-[360px] border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col bg-gray-50/50 dark:bg-gray-800/30">
            <div className="p-4">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  placeholder="搜索模型..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 w-full text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin px-4 pb-4">
              <div className="space-y-2">
                {filteredModels.map((model) => (
                  <div
                    key={model.id}
                    className={cn(
                      'p-4 rounded-2xl cursor-pointer transition-all duration-200 border',
                      currentModel.id === model.id
                        ? 'bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-purple-300 dark:border-purple-700 shadow-sm'
                        : 'bg-white dark:bg-gray-800 border-gray-200/50 dark:border-gray-700/50 hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-md'
                    )}
                    onClick={() => setModel(model)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          "text-sm font-medium truncate",
                          currentModel.id === model.id ? "text-purple-700 dark:text-purple-300" : "text-gray-800 dark:text-gray-200"
                        )}>
                          {model.name}
                        </h4>
                        {model.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                            {model.description}
                          </p>
                        )}
                      </div>
                      {currentModel.id === model.id && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {filteredModels.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
                    没有找到匹配的模型
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right - Parameters */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-6">
              {/* Feature Toggles */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">功能设置</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <Globe size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">联网搜索</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">获取最新信息</p>
                      </div>
                    </div>
                    <Switch checked={webSearchEnabled} onChange={setWebSearchEnabled} />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                        <Brain size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">深度思考</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">深入推理分析</p>
                      </div>
                    </div>
                    <Switch checked={deepThinkingEnabled} onChange={setDeepThinkingEnabled} />
                  </div>
                </div>
              </div>

              {/* Model Parameters */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">模型参数</h3>
                  <button 
                    onClick={resetParameters} 
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-600 transition-colors"
                  >
                    <RotateCcw size={12} />
                    重置
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Temperature */}
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Temperature</label>
                      <span className="text-sm font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-lg">
                        {parameters.temperature}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={parameters.temperature}
                      onChange={(e) => setParameters({ temperature: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  {/* Top P */}
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Top P</label>
                      <span className="text-sm font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-lg">
                        {parameters.topP}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={parameters.topP}
                      onChange={(e) => setParameters({ topP: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  {/* Frequency Penalty */}
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">频率惩罚</label>
                      <span className="text-sm font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-lg">
                        {parameters.frequencyPenalty}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={parameters.frequencyPenalty}
                      onChange={(e) => setParameters({ frequencyPenalty: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  {/* Presence Penalty */}
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">存在惩罚</label>
                      <span className="text-sm font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-lg">
                        {parameters.presencePenalty}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={parameters.presencePenalty}
                      onChange={(e) => setParameters({ presencePenalty: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30">
              <Button onClick={onClose} className="w-full h-11">
                完成配置
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
