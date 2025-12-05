import React, { useState } from 'react';
import { Message } from '@/types/message';
import { cn } from '@/utils/cn';
import { Bot, User, Edit2, Trash2, RotateCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';

interface ChatMessageProps {
  message: Message;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  onRegenerate?: (messageId: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onEdit,
  onDelete,
  onRegenerate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [isHovered, setIsHovered] = useState(false);

  const handleSaveEdit = () => {
    if (onEdit && editedContent.trim()) {
      onEdit(message.id, editedContent.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(message.content);
    setIsEditing(false);
  };

  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'group flex gap-3 px-4 py-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        'flex gap-3 max-w-[80%]',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}>
        {/* 头像 */}
        <div className="flex-shrink-0">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center',
              isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            )}
          >
            {isUser ? <User size={18} /> : <Bot size={18} />}
          </div>
        </div>

        {/* 消息气泡 */}
        <div className={cn(
          'flex-1 space-y-2',
          isUser ? 'items-end' : 'items-start'
        )}>
          {isEditing ? (
            <div className={cn(
              'space-y-2 w-full',
              isUser ? 'bg-primary/10 rounded-2xl p-3' : 'bg-muted/50 rounded-2xl p-3'
            )}>
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[100px] bg-background"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveEdit}>
                  保存
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  取消
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative group/message">
              <div
                className={cn(
                  'rounded-2xl px-4 py-2.5 shadow-sm',
                  isUser
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-muted/50 rounded-tl-sm'
                )}
              >
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                  {message.content}
                </p>
              </div>
              
              {/* 操作按钮 */}
              {isHovered && (
                <div className={cn(
                  'absolute top-0 flex gap-1 opacity-0 group-hover/message:opacity-100 transition-opacity',
                  isUser ? 'right-full mr-2' : 'left-full ml-2'
                )}>
                  {isUser && onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsEditing(true)}
                      className="h-7 w-7 bg-background/80 backdrop-blur"
                    >
                      <Edit2 size={14} />
                    </Button>
                  )}
                  {!isUser && onRegenerate && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRegenerate(message.id)}
                      className="h-7 w-7 bg-background/80 backdrop-blur"
                    >
                      <RotateCw size={14} />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(message.id)}
                      className="h-7 w-7 text-destructive hover:text-destructive bg-background/80 backdrop-blur"
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {message.status === 'error' && (
            <div className="text-xs text-destructive px-2">发送失败</div>
          )}
        </div>
      </div>
    </div>
  );
};
