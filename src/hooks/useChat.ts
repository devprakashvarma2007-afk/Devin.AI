import { useState, useCallback, useRef } from 'react';
import type { Chat, Message, ChatMode } from '../types';
import { newMessage, saveChat, loadChats, deleteChat } from '../lib/firebase';
import { streamChat, generateTitle } from '../lib/gemini';

export function useChat(uid: string | undefined) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const fetchChats = useCallback(async () => {
    if (!uid) return;
    try {
      const loaded = await loadChats(uid);
      setChats(loaded);
    } catch {
      setError('Failed to load chats');
    }
  }, [uid]);

  const createNewChat = useCallback(
    (mode: ChatMode = 'chat') => {
      const chat: Chat = {
        id: crypto.randomUUID(),
        title: null,
        messages: [],
        mode,
        model: 'gemini-2.0-flash',
        updatedAt: new Date().toISOString(),
      };
      setActiveChat(chat);
      setError(null);
      return chat;
    },
    [],
  );

  const selectChat = useCallback((chat: Chat) => {
    setActiveChat(chat);
    setError(null);
  }, []);

  const removeChat = useCallback(
    async (chatId: string) => {
      if (!uid) return;
      try {
        await deleteChat(uid, chatId);
        setChats((prev) => prev.filter((c) => c.id !== chatId));
        if (activeChat?.id === chatId) {
          setActiveChat(null);
        }
      } catch {
        setError('Failed to delete chat');
      }
    },
    [uid, activeChat],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!uid || !content.trim() || isStreaming) return;

      setError(null);
      setIsStreaming(true);
      abortRef.current = false;

      let chat = activeChat ?? createNewChat();
      const userMsg = newMessage('user', content.trim());
      chat = {
        ...chat,
        messages: [...chat.messages, userMsg],
        updatedAt: new Date().toISOString(),
      };
      setActiveChat(chat);

      const assistantMsg = newMessage('assistant', '');
      const updatedMessages = [...chat.messages, assistantMsg];
      chat = { ...chat, messages: updatedMessages };
      setActiveChat(chat);

      try {
        let fullText = '';
        for await (const chunk of streamChat(
          chat.messages.filter((m) => m.id !== assistantMsg.id),
          chat.model ?? undefined,
        )) {
          if (abortRef.current) break;
          fullText += chunk;
          const updated: Chat = {
            ...chat,
            messages: chat.messages.map((m) =>
              m.id === assistantMsg.id ? { ...m, content: fullText } : m,
            ),
          };
          chat = updated;
          setActiveChat(updated);
        }

        // Generate title for new chats
        if (!chat.title && chat.messages.length <= 2) {
          const title = await generateTitle(content);
          chat = { ...chat, title };
          setActiveChat(chat);
        }

        await saveChat(uid, chat);
        setChats((prev) => {
          const idx = prev.findIndex((c) => c.id === chat.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = chat;
            return next;
          }
          return [chat, ...prev];
        });
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to get response';
        setError(msg);
      } finally {
        setIsStreaming(false);
      }
    },
    [uid, activeChat, isStreaming, createNewChat],
  );

  const stopStreaming = useCallback(() => {
    abortRef.current = true;
  }, []);

  return {
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
    setActiveChat,
  };
}
