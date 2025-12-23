import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Save, Play, Loader2, RefreshCw, User, ImagePlus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Character } from '@/types/video';
import { generateSora2Video, getVideoStatus, uploadImage } from '@/services/api';

// 高级设置类型
interface AdvancedSettings {
  duration: '10' | '15';
  aspectRatio: '16:9' | '9:16';
  referenceImage: string | null;
}

// 尺寸选项
const ASPECT_RATIO_OPTIONS = [
  { value: '9:16', label: '竖屏', desc: '720×1280' },
  { value: '16:9', label: '横屏', desc: '1280×720' },
] as const;

// 时长选项
const DURATION_OPTIONS = [
  { value: '10', label: '10秒' },
  { value: '15', label: '15秒' },
] as const;

// 轮询间隔（毫秒）
const POLL_INTERVAL = 3000;

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
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  
  // 高级设置
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
    duration: '10',
    aspectRatio: '9:16',
    referenceImage: null,
  });
  const [isUploadingRef, setIsUploadingRef] = useState(false);

  // 轮询相关
  const pollTimerRef = useRef<number | null>(null);
  const taskIdRef = useRef<string | null>(null);

  const isEditing = !!character;

  // 清理轮询
  const clearPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  // 轮询任务状态
  const pollTaskStatus = useCallback(async (taskId: string) => {
    try {
      const response = await getVideoStatus(taskId);
      
      if (!response.success || !response.data) {
        throw new Error('查询状态失败');
      }

      const { status, fail_reason, progress: taskProgress, data } = response.data;
      
      // 更新进度（progress 是 1-100 的数字）
      if (taskProgress !== undefined && taskProgress !== null) {
        const progressNum = typeof taskProgress === 'string' ? parseInt(taskProgress, 10) : taskProgress;
        setProgress(isNaN(progressNum) ? 0 : progressNum);
      }

      switch (status) {
        case 'SUCCESS': {
          clearPolling();
          const newVideoUrl = data?.output;
          setVideoUrl(newVideoUrl);
          setIsGenerating(false);
          setProgress(0);
          
          if (isEditing && onUpdate && newVideoUrl) {
            onUpdate({
              videoUrl: newVideoUrl,
              status: 'completed',
              taskId: undefined,
            });
          }
          break;
        }

        case 'FAILURE':
          clearPolling();
          setIsGenerating(false);
          setProgress(0);
          setError(fail_reason || '视频生成失败，请重试');
          
          if (isEditing && onUpdate) {
            onUpdate({
              status: 'failed',
              taskId: undefined,
            });
          }
          break;

        case 'NOT_START':
        case 'IN_PROGRESS':
        default:
          pollTimerRef.current = window.setTimeout(() => {
            pollTaskStatus(taskId);
          }, POLL_INTERVAL);
          break;
      }
    } catch (err) {
      console.error('轮询任务状态失败:', err);
      pollTimerRef.current = window.setTimeout(() => {
        pollTaskStatus(taskId);
      }, POLL_INTERVAL);
    }
  }, [clearPolling, isEditing, onUpdate]);

  useEffect(() => {
    return () => {
      clearPolling();
    };
  }, [clearPolling]);

  useEffect(() => {
    if (character) {
      setName(character.name);
      setDescription(character.description);
      setVideoUrl(character.videoUrl);
      setThumbnailUrl(character.thumbnailUrl);
      
      if (character.taskId && character.status === 'generating') {
        taskIdRef.current = character.taskId;
        setIsGenerating(true);
        setProgress(0);
        pollTaskStatus(character.taskId);
      }
    }
  }, [character, pollTaskStatus]);

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
    
    clearPolling();
    setIsGenerating(true);
    setError(null);
    setProgress(0);

    try {
      const response = await generateSora2Video({
        prompt: description.trim(),
        model: 'sora-2',
        aspect_ratio: advancedSettings.aspectRatio,
        duration: advancedSettings.duration,
        private: true,
        reference_image: advancedSettings.referenceImage || undefined,
      });

      if (response.success && response.data?.task_id) {
        const taskId = response.data.task_id;
        taskIdRef.current = taskId;
        setProgress(0);
        
        if (isEditing && onUpdate) {
          onUpdate({
            status: 'generating',
            taskId: taskId,
          });
        }
        
        pollTimerRef.current = window.setTimeout(() => {
          pollTaskStatus(taskId);
        }, POLL_INTERVAL);
      } else {
        throw new Error('未获取到任务ID');
      }
    } catch (err) {
      console.error('Sora2 生成失败:', err);
      setError(err instanceof Error ? err.message : '生成失败，请重试');
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const handleReferenceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingRef(true);
    try {
      const result = await uploadImage(file);
      if (result.success && result.url) {
        setAdvancedSettings(prev => ({ ...prev, referenceImage: result.url }));
      }
    } catch (err) {
      console.error('上传参考图失败:', err);
      setError('上传参考图失败');
    } finally {
      setIsUploadingRef(false);
    }
  };

  const handleRemoveReferenceImage = () => {
    setAdvancedSettings(prev => ({ ...prev, referenceImage: null }));
  };

  const isVertical = advancedSettings.aspectRatio === '9:16';

  // 获取角色头像（从视频截图或缩略图）
  const avatarUrl = thumbnailUrl || (videoUrl ? undefined : undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {isEditing ? '编辑角色' : '新建角色'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 内容区域 - 左右两栏 */}
        <div className="flex">
          {/* 左侧 - 视频预览 + 生成设置 + 生成按钮 */}
          <div className="w-80 p-6 border-r border-gray-100 dark:border-gray-700">
            {/* 视频预览区域 - 固定高度容器 */}
            <div className="h-64 flex items-center justify-center mb-5">
              <div 
                className={`relative bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center transition-all duration-300 ${
                  isVertical ? 'w-36 h-64' : 'w-64 h-36'
                }`}
              >
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center text-center p-4 w-full">
                    {/* 圆形进度 */}
                    <div className="relative w-20 h-20 mb-3">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="6"
                          className="text-gray-200 dark:text-gray-600"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          fill="none"
                          stroke="url(#progressGradient)"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 36}`}
                          strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
                          className="transition-all duration-300 ease-out"
                        />
                        <defs>
                          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#EC4899" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                          {progress}%
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">生成中</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">约1-3分钟</span>
                  </div>
                ) : videoUrl ? (
                  <video
                    src={videoUrl}
                    poster={thumbnailUrl}
                    className="w-full h-full object-cover"
                    controls
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                    <Play size={40} className="mb-2 opacity-30" />
                    <span className="text-xs">视频预览</span>
                  </div>
                )}
              </div>
            </div>

            {/* 生成设置 */}
            <div className="space-y-3.5">
              {/* 标题 */}
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent"></div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  生成设置
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent"></div>
              </div>
              
              {/* 时长和尺寸 */}
              <div className="space-y-3">
                {/* 时长 */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    视频时长
                  </label>
                  <div className="flex gap-2">
                    {DURATION_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setAdvancedSettings(prev => ({ ...prev, duration: option.value }))}
                        className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-colors ${
                          advancedSettings.duration === option.value
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 尺寸 */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    视频尺寸
                  </label>
                  <div className="flex gap-2">
                    {ASPECT_RATIO_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setAdvancedSettings(prev => ({ ...prev, aspectRatio: option.value }))}
                        className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-colors ${
                          advancedSettings.aspectRatio === option.value
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 参考图 */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  参考图片
                </label>
                <div className="flex items-center gap-2.5">
                  {advancedSettings.referenceImage ? (
                    <div className="relative group">
                      <img
                        src={advancedSettings.referenceImage}
                        alt="参考图"
                        className="w-14 h-14 object-cover rounded-lg border-2 border-purple-200 dark:border-purple-800 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveReferenceImage}
                        className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-md"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center w-14 h-14 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReferenceImageUpload}
                        className="hidden"
                        disabled={isUploadingRef}
                      />
                      {isUploadingRef ? (
                        <Loader2 size={16} className="text-purple-500 animate-spin" />
                      ) : (
                        <ImagePlus size={16} className="text-gray-400" />
                      )}
                    </label>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    可选，上传参考图让生成效果更精准
                  </span>
                </div>
              </div>

              {/* 错误提示 */}
              {error && (
                <div className="p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
                  <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* 按钮组 */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleGenerate}
                  disabled={!description.trim() || isGenerating}
                  variant={videoUrl ? 'outline' : 'default'}
                  size="sm"
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={14} className="mr-1.5 animate-spin" />
                      生成中
                    </>
                  ) : videoUrl ? (
                    <>
                      <RefreshCw size={14} className="mr-1.5" />
                      重新生成
                    </>
                  ) : (
                    <>
                      <Play size={14} className="mr-1.5" />
                      生成视频
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  disabled={!videoUrl || isGenerating}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
                >
                  <Save size={14} className="mr-1.5" />
                  确认形象
                </Button>
              </div>
            </div>
          </div>

          {/* 右侧 - 角色头像 + 名称 + 描述 */}
          <div className="flex-1 p-6 flex flex-col">
            {/* 角色头像 */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center overflow-hidden shadow-lg">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name || '角色头像'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-purple-300 dark:text-purple-600" />
                )}
              </div>
              {/* 角色名称预览 */}
              <div className="mt-3 text-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {name || '未命名角色'}
                </span>
              </div>
            </div>

            {/* 角色名称输入 */}
            <div className="mb-4">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                角色名称 <span className="text-red-500">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="给角色起个名字"
              />
            </div>

            {/* 角色描述 */}
            <div className="flex-1">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                角色描述
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="描述角色的外貌、服装、动作等特征，用于生成角色视频..."
                className="h-full min-h-[160px] resize-none"
              />
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <Button variant="ghost" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            <Save size={16} className="mr-2" />
            保存角色
          </Button>
        </div>
      </div>
    </div>
  );
};
