import React, { useState } from 'react';
import { Conversation } from '@/types/conversation';
import { MessageSquarePlus, Trash2, Edit2, Check, X, Trash, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/utils/cn';
import { formatTimestamp } from '@/utils/formatters';

interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onCreate: () => void;
  onClearAll: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  currentConversationId,
  onSelect,
  onDelete,
  onRename,
  onCreate,
  onClearAll,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartEdit = (conversation: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleSaveEdit = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (editTitle.trim()) {
      onRename(id, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setEditTitle('');
  };

  const handleKeyDown = (id: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditTitle('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          对话列表
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={onCreate}
            className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl transition-all duration-200"
            title="新建对话"
          >
            <MessageSquarePlus size={18} />
          </button>
          {conversations.length > 0 && (
            <button
              onClick={onClearAll}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200"
              title="清空所有对话历史"
            >
              <Trash size={18} />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2">
        {conversations.map((conversation, index) => (
          <div
            key={conversation.id}
            className={cn(
              'group relative px-4 py-3 cursor-pointer rounded-2xl transition-all duration-300 animate-fade-in',
              currentConversationId === conversation.id
                ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-200/50 dark:border-purple-700/50 shadow-sm'
                : 'hover:bg-gray-100/80 dark:hover:bg-gray-800/50 border border-transparent'
            )}
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => editingId !== conversation.id && onSelect(conversation.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {editingId === conversation.id ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(conversation.id, e)}
                      className="h-8 text-sm px-3 rounded-xl"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30"
                      onClick={(e) => handleSaveEdit(conversation.id, e)}
                    >
                      <Check size={14} className="text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0 rounded-xl"
                      onClick={handleCancelEdit}
                    >
                      <X size={14} className="text-gray-500" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <h3 className={cn(
                      "text-sm font-medium truncate transition-colors",
                      currentConversationId === conversation.id
                        ? "text-purple-700 dark:text-purple-300"
                        : "text-gray-800 dark:text-gray-200"
                    )}>
                      {conversation.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {formatTimestamp(conversation.updatedAt)}
                    </p>
                  </>
                )}
              </div>
              {editingId !== conversation.id && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <button
                    className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                    onClick={(e) => handleStartEdit(conversation, e)}
                  >
                    <Edit2 size={13} className="text-gray-500 hover:text-purple-600" />
                  </button>
                  <button
                    className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conversation.id);
                    }}
                  >
                    <Trash2 size={13} className="text-gray-500 hover:text-red-500" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center mb-4">
              <MessageCircle size={28} className="text-purple-500" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">还没有对话</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">点击上方按钮创建新对话</p>
          </div>
        )}
      </div>
    </div>
  );
};
