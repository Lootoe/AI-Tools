import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Character } from '@/types/video';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

interface CharacterSelectModalProps {
  characters: Character[];
  selectedIds: string[];
  onConfirm: (ids: string[]) => void;
  onClose: () => void;
}

export const CharacterSelectModal: React.FC<CharacterSelectModalProps> = ({
  characters,
  selectedIds,
  onConfirm,
  onClose,
}) => {
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedIds));

  useEffect(() => {
    setSelected(new Set(selectedIds));
  }, [selectedIds]);

  const handleToggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    onConfirm(Array.from(selected));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col overflow-hidden m-4 max-h-[60vh]">
        {/* 头部 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
            选择角色 ({selected.size})
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* 角色网格 */}
        <div className="flex-1 overflow-y-auto p-3">
          {characters.length === 0 ? (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
              暂无角色
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {characters.map((char) => {
                const isSelected = selected.has(char.id);
                return (
                  <div
                    key={char.id}
                    onClick={() => handleToggle(char.id)}
                    className={cn(
                      'relative p-2 rounded-lg border cursor-pointer transition-all text-center',
                      isSelected
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                    )}
                  >
                    {/* 选中标记 */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                        <Check size={10} className="text-white" />
                      </div>
                    )}

                    {/* 头像 */}
                    {char.thumbnailUrl ? (
                      <img
                        src={char.thumbnailUrl}
                        alt={char.name}
                        className="w-10 h-10 rounded-full object-cover mx-auto mb-1"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-sm font-medium mx-auto mb-1">
                        {char.name.charAt(0)}
                      </div>
                    )}

                    {/* 名字 */}
                    <div className="text-xs text-gray-700 dark:text-gray-300 truncate">
                      {char.name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 底部操作 */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100 dark:border-gray-700">
          <Button size="sm" variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button size="sm" onClick={handleConfirm}>
            确认
          </Button>
        </div>
      </div>
    </div>
  );
};
