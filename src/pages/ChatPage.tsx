import React, { useEffect, useRef } from 'react';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { useConversationStore } from '@/stores/conversationStore';
import { useChat } from '@/hooks/useChat';
import { Bot } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const { currentConversationId, loadConversations } = useConversationStore();
  const {
    messages,
    isGenerating,
    sendMessage,
    regenerateMessage,
    editMessage,
    deleteMessage,
  } = useChat(currentConversationId);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 加载对话列表
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-1 overflow-hidden bg-background">
      {/* 左侧边栏 */}
      <Sidebar />

      {/* 中间对话区域 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Bot size={64} className="text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">
                开始与AI对话
              </h2>
              <p className="text-muted-foreground">
                {currentConversationId
                  ? '在下方输入框中输入消息开始对话'
                  : '请先创建或选择一个对话'}
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onEdit={editMessage}
                  onDelete={deleteMessage}
                  onRegenerate={regenerateMessage}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 输入框 */}
        <ChatInput
          onSend={sendMessage}
          isGenerating={isGenerating}
          disabled={!currentConversationId}
        />
      </main>
    </div>
  );
};
