import { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import LoadingScreen from './components/LoadingScreen';
import { useAuth } from './hooks/useAuth';
import { useChat } from './hooks/useChat';

export default function App() {
  const { user, loading } = useAuth();
  const {
    chats,
    activeChat,
    isStreaming,
    error,
    fetchChats,
    createNewChat,
    selectChat,
    removeChat,
    sendMessage,
    stopStreaming,
  } = useChat(user?.uid);

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user, fetchChats]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        chats={chats}
        activeChatId={activeChat?.id ?? null}
        onNewChat={() => createNewChat()}
        onSelectChat={selectChat}
        onDeleteChat={removeChat}
      />
      <main className="flex-1 min-w-0">
        <ChatView
          chat={activeChat}
          isStreaming={isStreaming}
          error={error}
          onSend={sendMessage}
          onStop={stopStreaming}
        />
      </main>
    </div>
  );
}
