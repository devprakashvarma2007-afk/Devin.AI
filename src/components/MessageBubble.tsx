import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, User, Bot } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

function CodeBlock({
  language,
  children,
}: {
  language: string | undefined;
  children: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-2 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between bg-[#2A2A2A] px-4 py-1.5 text-xs text-[#A0A0A0]">
        <span>{language ?? 'text'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-[#E5E5E5] transition-colors"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language ?? 'text'}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: '#1E1E1E',
          fontSize: '0.85rem',
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={clsx(
        'flex gap-3 py-4 px-4 max-w-3xl mx-auto',
        isUser ? 'justify-end' : 'justify-start',
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-[#6C63FF] flex items-center justify-center shrink-0 mt-0.5">
          <Bot size={16} className="text-white" />
        </div>
      )}

      <div
        className={clsx(
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-[#6C63FF] text-white'
            : 'bg-[#1A1A1A] text-[#E5E5E5] border border-[#2A2A2A]',
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="markdown-content">
            <ReactMarkdown
              components={{
                code(props) {
                  const { children, className, ...rest } = props;
                  const match = /language-(\w+)/.exec(className ?? '');
                  const codeStr = String(children).replace(/\n$/, '');

                  if (match) {
                    return (
                      <CodeBlock language={match[1]}>{codeStr}</CodeBlock>
                    );
                  }
                  return (
                    <code className={className} {...rest}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content || '...'}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-[#252525] flex items-center justify-center shrink-0 mt-0.5">
          <User size={16} className="text-[#A0A0A0]" />
        </div>
      )}
    </div>
  );
}
