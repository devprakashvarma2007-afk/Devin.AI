import { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import type { Chat } from '../types';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

interface ChatViewProps {
  chat: Chat | null;
  isStreaming: boolean;
  error: string | null;
  onSend: (message: string) => void;
  onStop: () => void;
}

function EmptyState({ onSuggestion }: { onSuggestion: (text: string) => void }) {
  const suggestions = [
    'Write a Python function to sort a list',
    'Explain how React hooks work',
    'Help me debug a CSS layout issue',
    'Create a REST API endpoint in Node.js',
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-[#6C63FF]/10 flex items-center justify-center mb-6">
        <Sparkles size={32} className="text-[#6C63FF]" />
      </div>
      <h1 className="text-2xl font-semibold text-[#E5E5E5] mb-2">
        Devin.AI
      </h1>
      <p className="text-[#A0A0A0] text-sm mb-8 text-center max-w-md">
        AI software engineer and creative companion. Ask me anything about
        coding, debugging, or building.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="text-left text-sm px-4 py-3 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] text-[#A0A0A0] hover:text-[#E5E5E5] hover:border-[#3A3A3A] transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ChatView({
  chat,
  isStreaming,
  error,
  onSend,
  onStop,
}: ChatViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  const hasMessages = chat && chat.messages.length > 0;

  return (
    <div className="flex flex-col h-full bg-[#0F0F0F]">
      {hasMessages ? (
        <div className="flex-1 overflow-y-auto">
          {chat.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {error && (
            <div className="max-w-3xl mx-auto px-4 py-2">
              <div className="text-sm text-[#EF4444] bg-[#EF4444]/10 rounded-lg px-4 py-2">
                {error}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      ) : (
        <EmptyState onSuggestion={onSend} />
      )}
      <ChatInput
        onSend={onSend}
        onStop={onStop}
        isStreaming={isStreaming}
      />
    </div>
  );
}
