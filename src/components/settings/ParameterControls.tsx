import React from 'react';
import { useModelStore } from '@/stores/modelStore';
import { Input } from '@/components/ui/Input';
import { RotateCcw } from 'lucide-react';

export const ParameterControls: React.FC = () => {
  const { parameters, setParameters, resetParameters } = useModelStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          模型参数
        </h3>
        <button
          onClick={resetParameters}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-600 transition-colors"
        >
          <RotateCcw size={12} />
          重置
        </button>
      </div>

      <div className="space-y-4">
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
          <p className="text-xs text-gray-500 dark:text-gray-400">
            控制回答的随机性。值越大越随机
          </p>
        </div>

        {/* Max Tokens */}
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">最大Token数</label>
            <span className="text-sm font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-lg">
              {parameters.maxTokens}
            </span>
          </div>
          <Input
            type="number"
            min="1"
            max="8192"
            value={parameters.maxTokens}
            onChange={(e) => setParameters({ maxTokens: parseInt(e.target.value) || 1 })}
            className="h-10"
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
          <p className="text-xs text-gray-500 dark:text-gray-400">
            核采样参数，控制生成的多样性
          </p>
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
  );
};
