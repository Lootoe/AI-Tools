import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, ChevronDown, Plus, Scissors } from 'lucide-react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { useModelStore } from '@/stores/modelStore';

interface ChatInputProps {
  onSend: (message: string) => void;
  isGenerating?: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isGenerating = false,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { currentModel } = useModelStore();

  const handleSubmit = () => {
    if (message.trim() && !isGenerating && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // 自动调整textarea高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  return (
    <div className="border-t bg-background/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 py-4">
        {/* 主输入区域 */}
        <div className="relative rounded-3xl border border-border/50 bg-muted/30 shadow-sm transition-all duration-200 hover:border-border focus-within:border-primary/40 focus-within:bg-background">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? '请先选择或创建一个对话...' : '和AI聊点什么'}
            disabled={disabled || isGenerating}
            className="min-h-[60px] max-h-[200px] resize-none border-0 bg-transparent px-6 py-4 text-base placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
            rows={1}
          />
          
          {/* 底部工具栏 */}
          <div className="flex items-center justify-between px-4 pb-3">
            {/* 左侧功能按钮 */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50">
                <span className="text-primary">✓</span>
                <span>{currentModel.name}</span>
                <ChevronDown size={14} />
              </button>
              <div className="h-4 w-px bg-border/50" />
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50">
                <Plus size={18} />
              </button>
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50">
                <Scissors size={18} />
              </button>
            </div>

            {/* 右侧发送按钮 */}
            <div className="flex items-center gap-2">
              {isGenerating ? (
                <Button
                  disabled
                  size="icon"
                  className="h-9 w-9 rounded-xl"
                >
                  <Loader2 size={16} className="animate-spin" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!message.trim() || disabled}
                  size="icon"
                  className="h-9 w-9 rounded-xl transition-all duration-200 disabled:opacity-40"
                >
                  <Send size={16} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
