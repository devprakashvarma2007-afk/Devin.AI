import { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Square } from 'lucide-react';
import { clsx } from 'clsx';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  onStop,
  isStreaming,
  disabled = false,
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-[#2A2A2A] bg-[#0F0F0F] p-4">
      <div className="max-w-3xl mx-auto flex items-end gap-2">
        <div className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 focus-within:border-[#6C63FF] transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Devin.AI..."
            disabled={disabled}
            rows={1}
            className={clsx(
              'w-full bg-transparent text-[#E5E5E5] placeholder-[#666] text-sm resize-none outline-none',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
          />
        </div>
        {isStreaming ? (
          <button
            onClick={onStop}
            className="p-3 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white transition-colors"
            aria-label="Stop generating"
          >
            <Square size={18} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || disabled}
            className={clsx(
              'p-3 rounded-xl transition-colors',
              input.trim() && !disabled
                ? 'bg-[#6C63FF] hover:bg-[#5A52D5] text-white'
                : 'bg-[#252525] text-[#666] cursor-not-allowed',
            )}
            aria-label="Send message"
          >
            <SendHorizontal size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
