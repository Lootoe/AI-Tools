import React from 'react';
import { Settings, Wrench } from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  return (
    <aside className="w-80 border-l border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Settings size={16} className="text-gray-500" />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">设置</span>
      </div>
      
      {/* Placeholder Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <Wrench size={24} className="text-gray-400" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">功能开发中</p>
        <p className="text-xs text-gray-500 dark:text-gray-500">更多设置选项即将上线</p>
      </div>
    </aside>
  );
};
