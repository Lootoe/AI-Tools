import React, { useState, useEffect } from 'react';
import { X, Save, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';

interface StoryboardScriptModalProps {
  description: string;
  onSave: (description: string) => void;
  onClose: () => void;
}

export const StoryboardScriptModal: React.FC<StoryboardScriptModalProps> = ({
  description,
  onSave,
  onClose,
}) => {
  const [text, setText] = useState(description);

  useEffect(() => {
    setText(description);
  }, [description]);

  const handleSave = () => {
    onSave(text.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col overflow-hidden m-4 max-h-[70vh]">
        {/* 头部 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <FileText size={16} className="text-purple-500" />
            编辑分镜脚本
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 p-4 overflow-y-auto">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="详细描述这个分镜的场景、动作、对话、镜头运动等..."
            className="min-h-[200px] resize-none"
            autoFocus
          />
          <p className="text-xs text-gray-400 mt-2">
            提示：详细的分镜描述有助于生成更准确的视频
          </p>
        </div>

        {/* 底部操作 */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100 dark:border-gray-700">
          <Button size="sm" variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save size={14} className="mr-1.5" />
            保存
          </Button>
        </div>
      </div>
    </div>
  );
};
