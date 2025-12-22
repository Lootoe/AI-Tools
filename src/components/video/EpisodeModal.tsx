import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useVideoStore } from '@/stores/videoStore';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';

interface EpisodeModalProps {
  episodeId: string;
  onClose: () => void;
}

export const EpisodeModal: React.FC<EpisodeModalProps> = ({ episodeId, onClose }) => {
  const { getCurrentScript, updateEpisode } = useVideoStore();
  const script = getCurrentScript();
  const episode = script?.episodes.find((e) => e.id === episodeId);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (episode) {
      setTitle(episode.title);
      setContent(episode.content);
    }
  }, [episode]);

  const handleSave = () => {
    if (!script || !episode) return;
    updateEpisode(script.id, episodeId, { title, content });
    onClose();
  };

  if (!episode) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden m-4">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-bold text-gray-800 dark:text-gray-200 bg-transparent border-none focus:outline-none focus:ring-0"
            placeholder="剧集标题"
          />
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 p-4 overflow-y-auto">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            剧集内容
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="输入剧集内容，描述这一集的剧情..."
            className="min-h-[400px] resize-none"
          />
        </div>

        {/* 底部操作 */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleSave}>
            <Save size={16} className="mr-2" />
            保存
          </Button>
        </div>
      </div>
    </div>
  );
};
