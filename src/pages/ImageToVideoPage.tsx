import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Video, Play } from 'lucide-react';

export const ImageToVideoPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8 animate-fade-in">
          <button
            onClick={() => navigate('/')}
            className="mr-4 p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
            图生视频
          </h1>
        </div>

        {/* Placeholder Content */}
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-slide-up">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/30">
              <Video className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -inset-3 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-3xl blur-xl opacity-30" />
          </div>
          
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
            图生视频模块
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
            将静态图片转化为生动的动态视频
          </p>

          <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm">
            <Play size={18} />
            <span>功能开发中，敬请期待...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
