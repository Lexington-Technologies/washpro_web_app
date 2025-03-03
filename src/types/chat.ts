export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatThread {
  _id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface CreateThreadRequest {
  title: string;
  initialMessage?: string;
}

export interface UpdateThreadRequest {
  title?: string;
  isActive?: boolean;
} 