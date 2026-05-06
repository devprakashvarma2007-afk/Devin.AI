import { useState } from 'react';
import { Plus, MessageSquare, Trash2, PanelLeftClose, PanelLeft } from 'lucide-react';
import { clsx } from 'clsx';
import type { Chat } from '../types';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (chat: Chat) => void;
  onDeleteChat: (chatId: string) => void;
}

export default function Sidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        'flex flex-col h-full bg-[#1A1A1A] border-r border-[#2A2A2A] transition-all duration-200',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#2A2A2A]">
        {!collapsed && (
          <span className="text-sm font-semibold text-[#E5E5E5] truncate">
            Devin.AI
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-[#252525] text-[#A0A0A0] hover:text-[#E5E5E5] transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* New chat */}
      <div className="p-2">
        <button
          onClick={onNewChat}
          className={clsx(
            'flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm',
            'bg-[#6C63FF] hover:bg-[#5A52D5] text-white transition-colors',
            collapsed && 'justify-center px-0',
          )}
        >
          <Plus size={16} />
          {!collapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Chat list */}
      <nav className="flex-1 overflow-y-auto px-2 pb-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={clsx(
              'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors mb-0.5',
              chat.id === activeChatId
                ? 'bg-[#252525] text-[#E5E5E5]'
                : 'text-[#A0A0A0] hover:bg-[#252525] hover:text-[#E5E5E5]',
              collapsed && 'justify-center px-0',
            )}
            onClick={() => onSelectChat(chat)}
          >
            <MessageSquare size={16} className="shrink-0" />
            {!collapsed && (
              <>
                <span className="truncate flex-1">
                  {chat.title ?? 'Untitled'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#3A3A3A] text-[#A0A0A0] hover:text-[#EF4444] transition-all"
                  aria-label="Delete chat"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
