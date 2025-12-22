import React, { useState, useEffect } from 'react';
import { X, Save, Play, Loader2, RefreshCw, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Character } from '@/types/video';

interface CharacterModalProps {
  character?: Character;
  onSave: (name: string, description: string) => void;
  onUpdate?: (updates: Partial<Character>) => void;
  onClose: () => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({ 
  character, 
  onSave, 
  onUpdate,
  onClose 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | undefined>();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>();

  const isEditing = !!character;

  useEffect(() => {
    if (character) {
      setName(character.name);
      setDescription(character.description);
      setVideoUrl(character.videoUrl);
      setThumbnailUrl(character.thumbnailUrl);
    }
  }, [character]);

  const handleSave = () => {
    if (!name.trim()) return;
    if (isEditing && onUpdate) {
      onUpdate({ name: name.trim(), description: description.trim() });
    } else {
      onSave(name.trim(), description.trim());
    }
    onClose();
  };

  const handleGenerate = async () => {
    if (!description.trim()) return;
    
    setIsGenerating(true);

    // TODO: 调用 sora2 API 生成角色视频
    // 模拟生成过程
    setTimeout(() => {
      const newVideoUrl = 'https://example.com/character-video.mp4';
      const newThumbnailUrl = 'https://picsum.photos/400/300?random=' + Date.now();
      
      setVideoUrl(newVideoUrl);
      setThumbnailUrl(newThumbnailUrl);
      setIsGenerating(false);

      // 如果是编辑模式，同时更新角色数据
      if (isEditing && onUpdate) {
        onUpdate({
          videoUrl: newVideoUrl,
          thumbnailUrl: newThumbnailUrl,
          status: 'completed',
        });
      }
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden m-4 max-h-[90vh]">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {isEditing ? '编辑角色' : '新建角色'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 内容区域 - 左右布局 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 左侧 - 输入区域 */}
          <div className="w-1/2 p-4 border-r border-gray-100 dark:border-gray-700 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  角色名称 <span className="text-red-500">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="输入角色名称"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  角色描述
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="详细描述角色的外貌、性格、服装等特征，用于生成角色视频..."
                  className="min-h-[200px] resize-none"
                />
              </div>

              {/* 生成按钮 */}
              <Button
                onClick={handleGenerate}
                disabled={!description.trim() || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Play size={16} className="mr-2" />
                    使用 Sora2 生成角色
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* 右侧 - 视频展示区域 */}
          <div className="w-1/2 p-4 bg-gray-50 dark:bg-gray-800/50 flex flex-col">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              角色视频预览
            </label>
            <div className="flex-1 flex flex-col">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden relative">
                {isGenerating ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <Loader2 size={48} className="text-purple-500 animate-spin mb-3" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      正在生成角色视频...
                    </span>
                  </div>
                ) : videoUrl ? (
                  <video
                    src={videoUrl}
                    poster={thumbnailUrl}
                    className="w-full h-full object-cover"
                    controls
                  />
                ) : thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt={name || '角色预览'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                    <User size={64} className="mb-3 opacity-50" />
                    <span className="text-sm">输入描述后点击生成按钮</span>
                  </div>
                )}
              </div>

              {/* 重新生成按钮 */}
              {(videoUrl || thumbnailUrl) && !isGenerating && (
                <Button
                  variant="outline"
                  onClick={handleGenerate}
                  disabled={!description.trim()}
                  className="mt-3"
                >
                  <RefreshCw size={16} className="mr-2" />
                  重新生成
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            <Save size={16} className="mr-2" />
            保存
          </Button>
        </div>
      </div>
    </div>
  );
};
