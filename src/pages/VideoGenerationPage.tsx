import React, { useEffect, useState } from 'react';
import { Film } from 'lucide-react';
import { useVideoStore } from '@/stores/videoStore';
import { ScriptSidebar } from '@/components/video/ScriptSidebar';
import { ResourcePanel } from '@/components/video/ResourcePanel';
import { StoryboardEditor } from '@/components/video/StoryboardEditor';

export const VideoGenerationPage: React.FC = () => {
  const { loadScripts, getCurrentScript } = useVideoStore();
  const script = getCurrentScript();
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);

  useEffect(() => {
    loadScripts();
  }, [loadScripts]);

  // 当剧本变化时，自动选择第1集
  useEffect(() => {
    if (script && script.episodes.length > 0) {
      setSelectedEpisodeId(script.episodes[0].id);
    } else {
      setSelectedEpisodeId(null);
    }
  }, [script?.id]);

  const selectedEpisode = script?.episodes.find((e) => e.id === selectedEpisodeId);

  return (
    <div className="h-full flex gap-4 overflow-hidden">
      {/* 左侧资源面板 */}
      <ResourcePanel 
        selectedEpisodeId={selectedEpisodeId}
        onSelectEpisode={setSelectedEpisodeId}
      />

      {/* 中间主区域 */}
      <div className="flex-1 flex flex-col min-w-0 bg-white/80 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        {!script ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center mb-4">
              <Film size={40} className="text-purple-500/50" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              开始创作 AI 漫剧
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 max-w-md">
              在右侧创建或选择一个剧本，然后在左侧添加剧集和角色，点击剧集即可开始编辑分镜
            </p>
          </div>
        ) : !selectedEpisode ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center mb-4">
              <Film size={40} className="text-purple-500/50" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              选择一个剧集
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 max-w-md">
              在左侧面板点击剧集，即可在此处编辑分镜、关联角色、生成视频
            </p>
          </div>
        ) : (
          <StoryboardEditor episode={selectedEpisode} />
        )}
      </div>

      {/* 右侧边栏 - 剧本管理 */}
      <ScriptSidebar />
    </div>
  );
};
