import React from 'react';
import { ConversationList } from './ConversationList';
import { useConversationStore } from '@/stores/conversationStore';
import { useModelStore } from '@/stores/modelStore';

export const Sidebar: React.FC = () => {
  const {
    conversations,
    currentConversationId,
    selectConversation,
    createConversation,
    deleteConversation,
    clearAllConversations,
    updateConversationTitle,
  } = useConversationStore();
  
  const { currentModel } = useModelStore();

  const handleCreate = async () => {
    await createConversation(currentModel.id);
  };

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个对话吗？')) {
      await deleteConversation(id);
    }
  };

  const handleRename = async (id: string, title: string) => {
    await updateConversationTitle(id, title);
  };

  const handleClearAll = async () => {
    if (confirm('确定要清空所有对话历史吗？此操作不可恢复！')) {
      await clearAllConversations();
    }
  };

  return (
    <aside className="w-60 border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col h-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <ConversationList
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelect={selectConversation}
        onDelete={handleDelete}
        onRename={handleRename}
        onCreate={handleCreate}
        onClearAll={handleClearAll}
      />
    </aside>
  );
};
