import React from 'react';
import { Video, Play } from 'lucide-react';

export const ImageToVideoPage: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center animate-slide-up">
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/30">
          <Video className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -inset-3 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-3xl blur-xl opacity-30" />
      </div>

      <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
        视频生成模块
      </h2>

      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        将静态图片转化为生动的动态视频
      </p>

      <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm">
        <Play size={18} />
        <span>功能开发中，敬请期待...</span>
      </div>
    </div>
  );
};
