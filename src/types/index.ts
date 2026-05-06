export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  title: string | null;
  messages: Message[];
  mode: ChatMode;
  model: string | null;
  updatedAt: string;
}

export type ChatMode = 'chat' | 'image' | 'code';

export interface UserProfile {
  name: string | null;
  createdAt: string;
}
