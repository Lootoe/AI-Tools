import React, { useState } from 'react';
import { Plus, Play, Loader2, RefreshCw, Trash2, Video, Users, X, FileText, AlertTriangle } from 'lucide-react';
import { useVideoStore } from '@/stores/videoStore';
import { Episode } from '@/types/video';
import { Button } from '@/components/ui/Button';
import { CharacterSelectModal } from './CharacterSelectModal';
import { StoryboardScriptModal } from './StoryboardScriptModal';

interface StoryboardEditorProps {
  episode: Episode;
}

export const StoryboardEditor: React.FC<StoryboardEditorProps> = ({ episode }) => {
  const { getCurrentScript, addStoryboard, updateStoryboard, deleteStoryboard, clearStoryboards } = useVideoStore();
  const script = getCurrentScript();

  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());
  const [characterModalStoryboardId, setCharacterModalStoryboardId] = useState<string | null>(null);
  const [scriptModalStoryboardId, setScriptModalStoryboardId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleAddStoryboard = () => {
    if (!script) return;
    const sceneNumber = episode.storyboards.length + 1;
    addStoryboard(script.id, episode.id, {
      sceneNumber,
      description: `分镜 ${sceneNumber}`,
      characterIds: [],
    });
  };

  const handleUpdateDescription = (storyboardId: string, description: string) => {
    if (!script) return;
    updateStoryboard(script.id, episode.id, storyboardId, { description });
  };

  const handleDeleteStoryboard = (storyboardId: string) => {
    if (!script) return;
    deleteStoryboard(script.id, episode.id, storyboardId);
  };

  const handleUpdateCharacters = (storyboardId: string, characterIds: string[]) => {
    if (!script) return;
    updateStoryboard(script.id, episode.id, storyboardId, { characterIds });
  };

  const handleRemoveCharacter = (storyboardId: string, characterId: string) => {
    if (!script) return;
    const storyboard = episode.storyboards.find((sb) => sb.id === storyboardId);
    if (!storyboard) return;
    updateStoryboard(script.id, episode.id, storyboardId, {
      characterIds: storyboard.characterIds.filter((id) => id !== characterId),
    });
  };

  const handleGenerateVideo = async (storyboardId: string) => {
    if (!script) return;

    setGeneratingIds((prev) => new Set(prev).add(storyboardId));
    updateStoryboard(script.id, episode.id, storyboardId, { status: 'generating' });

    setTimeout(() => {
      updateStoryboard(script.id, episode.id, storyboardId, {
        status: 'completed',
        videoUrl: 'https://example.com/storyboard-video.mp4',
        thumbnailUrl: 'https://picsum.photos/400/225?random=' + storyboardId + Date.now(),
      });
      setGeneratingIds((prev) => {
        const next = new Set(prev);
        next.delete(storyboardId);
        return next;
      });
    }, 4000);
  };

  const handleClearStoryboards = () => {
    if (!script) return;
    clearStoryboards(script.id, episode.id);
    setShowClearConfirm(false);
  };

  if (!script) return null;

  const currentCharacterStoryboard = characterModalStoryboardId
    ? episode.storyboards.find((sb) => sb.id === characterModalStoryboardId)
    : null;

  const currentScriptStoryboard = scriptModalStoryboardId
    ? episode.storyboards.find((sb) => sb.id === scriptModalStoryboardId)
    : null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
        <div>
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">
            {episode.title}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {episode.storyboards.length} 个分镜
          </p>
        </div>
        <div className="flex items-center gap-2">
          {episode.storyboards.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowClearConfirm(true)}
              className="text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
            >
              <Trash2 size={14} className="mr-1.5" />
              清空分镜
            </Button>
          )}
          <Button size="sm" onClick={handleAddStoryboard}>
            <Plus size={14} className="mr-1.5" />
            添加分镜
          </Button>
        </div>
      </div>

      {/* 分镜列表 */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div className="grid grid-cols-3 xl:grid-cols-4 gap-3 items-start">
          {/* 空状态 */}
          {episode.storyboards.length === 0 && (
            <div className="col-span-3 xl:col-span-4 flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center mb-4">
                <Video size={28} className="text-purple-500/50" />
              </div>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                暂无分镜，点击上方按钮添加
              </p>
            </div>
          )}

          {/* 分镜卡片 */}
          {episode.storyboards.map((storyboard, index) => {
            const selectedCharacters = storyboard.characterIds
              .map((id) => script.characters.find((c) => c.id === id))
              .filter(Boolean);

            return (
              <div
                key={storyboard.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* 视频预览 */}
                <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative">
                  {storyboard.videoUrl ? (
                    <video
                      src={storyboard.videoUrl}
                      poster={storyboard.thumbnailUrl}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : storyboard.thumbnailUrl ? (
                    <img
                      src={storyboard.thumbnailUrl}
                      alt={`分镜 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video size={32} className="text-gray-300 dark:text-gray-600" />
                    </div>
                  )}

                  {/* 生成中遮罩 */}
                  {generatingIds.has(storyboard.id) && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Loader2 size={24} className="animate-spin mx-auto mb-1" />
                        <span className="text-xs">生成中...</span>
                      </div>
                    </div>
                  )}

                  {/* 序号 */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-xs font-medium">
                    #{index + 1}
                  </div>

                  {/* 删除按钮 */}
                  <button
                    onClick={() => handleDeleteStoryboard(storyboard.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-md bg-black/40 text-white/80 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* 内容区 */}
                <div className="p-2.5">
                  {/* 描述 - 固定高度确保对齐 */}
                  <p
                    className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors leading-relaxed h-[40px] overflow-hidden"
                    onClick={() => setScriptModalStoryboardId(storyboard.id)}
                  >
                    {storyboard.description || '点击编辑分镜脚本...'}
                  </p>

                  {/* 角色标签 */}
                  <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
                    {selectedCharacters.length === 0 ? (
                      <span className="text-xs text-gray-400">暂无角色</span>
                    ) : (
                      selectedCharacters.map((char) => char && (
                        <span
                          key={char.id}
                          className="inline-flex items-center gap-1.5 px-2 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-md text-xs"
                        >
                          {(char.profilePictureUrl || char.thumbnailUrl) && (
                            <img
                              src={char.profilePictureUrl || char.thumbnailUrl}
                              alt={char.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                          )}
                          {char.name}
                          <button
                            onClick={() => handleRemoveCharacter(storyboard.id, char.id)}
                            className="hover:text-red-500 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setScriptModalStoryboardId(storyboard.id)}
                      className="flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg transition-colors"
                    >
                      <FileText size={12} />
                      脚本
                    </button>

                    <button
                      onClick={() => setCharacterModalStoryboardId(storyboard.id)}
                      className="flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg transition-colors"
                    >
                      <Users size={12} />
                      角色
                    </button>

                    {storyboard.status === 'pending' || storyboard.status === 'failed' ? (
                      <button
                        onClick={() => handleGenerateVideo(storyboard.id)}
                        disabled={generatingIds.has(storyboard.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {generatingIds.has(storyboard.id) ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <>
                            <Play size={12} />
                            生成
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleGenerateVideo(storyboard.id)}
                        disabled={generatingIds.has(storyboard.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <RefreshCw size={12} />
                        重新生成
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 角色选择弹框 */}
      {characterModalStoryboardId && currentCharacterStoryboard && (
        <CharacterSelectModal
          characters={script.characters}
          selectedIds={currentCharacterStoryboard.characterIds}
          onConfirm={(ids) => handleUpdateCharacters(characterModalStoryboardId, ids)}
          onClose={() => setCharacterModalStoryboardId(null)}
        />
      )}

      {/* 脚本编辑弹框 */}
      {scriptModalStoryboardId && currentScriptStoryboard && (
        <StoryboardScriptModal
          description={currentScriptStoryboard.description}
          onSave={(desc) => handleUpdateDescription(scriptModalStoryboardId, desc)}
          onClose={() => setScriptModalStoryboardId(null)}
        />
      )}

      {/* 清空分镜确认弹框 */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                确认清空
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              确定要清空当前剧集的所有分镜吗？此操作不可撤销。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleClearStoryboards}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
              >
                确认清空
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
