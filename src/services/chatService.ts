import { apiController } from '../axios';
import { ChatThread, CreateThreadRequest, UpdateThreadRequest } from '../types/chat';

interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  message?: string;
}

export const chatService = {
  // Get all threads for the current user
  getThreads: async (): Promise<ChatThread[]> => {
    const response = await apiController.get<ApiResponse<ChatThread[]>>('/ai-chat');
    if (!response.ok) {
      throw new Error(response.message || 'Failed to fetch threads');
    }
    return response.data || [];
  },

  // Get a specific thread by ID
  getThread: async (threadId: string): Promise<ChatThread> => {
    const response = await apiController.get<ApiResponse<ChatThread>>(`/ai-chat/${threadId}`);
    console.log({response});
    if (!response.ok) {
      throw new Error(response.message || 'Failed to fetch thread');
    }
    if (!response.data) {
      throw new Error('Thread not found');
    }
    return response.data;
  },

  // Create a new thread
  createThread: async (data: CreateThreadRequest): Promise<ChatThread> => {
    const response = await apiController.post<ApiResponse<ChatThread>>('/ai-chat', data);
    if (!response.ok) {
      throw new Error(response.message || 'Failed to create thread');
    }
    if (!response.data) {
      throw new Error('Failed to create thread: No data returned');
    }
    return response.data;
  },

  // Update a thread
  updateThread: async (threadId: string, data: UpdateThreadRequest): Promise<ChatThread> => {
    return apiController.put(`/ai-chat/${threadId}`, data);
  },

  // Add a message to a thread
  addMessage: async (threadId: string, content: string, role: 'user' | 'assistant'): Promise<ChatThread> => {
    const response = await apiController.post<ApiResponse<ChatThread>>(`/ai-chat/${threadId}`, { 
      content, 
      role 
    });
    if (!response.ok) {
      throw new Error(response.message || 'Failed to add message');
    }
    if (!response.data) {
      throw new Error('Failed to add message: No data returned');
    }
    return response.data;
  },

  // Update thread title
  updateThreadTitle: async (threadId: string, title: string): Promise<void> => {
    const response = await apiController.put<ApiResponse<void>>(`/ai-chat/${threadId}`, { title });
    if (!response.ok) {
      throw new Error(response.message || 'Failed to update thread title');
    }
  },

  // Delete a thread
  deleteThread: async (threadId: string): Promise<void> => {
    const response = await apiController.delete<ApiResponse<void>>(`/ai-chat/${threadId}`);
    if (!response.ok) {
      throw new Error(response.message || 'Failed to delete thread');
    }
  },

  // Archive a thread (set isActive to false)
  archiveThread: async (threadId: string): Promise<void> => {
    const response = await apiController.put<ApiResponse<void>>(`/ai-chat/${threadId}`, { 
      isActive: false 
    });
    if (!response.ok) {
      throw new Error(response.message || 'Failed to archive thread');
    }
  },
};    