import { MastraClient } from "@mastra/client-js";
import { useAuthStore } from "../store";

// Simplified interfaces for better compatibility
interface SimplifiedThread {
  id: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: any;
  resourceId?: string;
}

interface SimplifiedMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type: string;
  createdAt: Date;
  threadId: string;
  timestamp?: Date; // Add timestamp for component compatibility
}

class ChatService {
  private client: MastraClient;
  private agentId: string;
  private resourceId: string;

  constructor() {
    this.client = new MastraClient({
      baseUrl: "https://mastra.washpro.ng", // Default Mastra development server port
    });
    this.agentId = "sqlAgent"; // Default agent ID
    this.resourceId = useAuthStore.getState().user?.email || "anonymous"; // Default resource ID with fallback
  }

  // Thread operations
  async getThreads(): Promise<SimplifiedThread[]> {
    try {
      const threads = await this.client.getMemoryThreads({
        resourceId: this.resourceId,
        agentId: this.agentId
      });

      // Convert to simplified format
      return threads.map((thread: any) => ({
        id: thread.id,
        title: thread.title || 'Untitled Thread',
        createdAt: new Date(thread.createdAt),
        updatedAt: new Date(thread.updatedAt || thread.createdAt),
        metadata: thread.metadata,
        resourceId: thread.resourceId
      }));
    } catch (error) {
      console.error("Error fetching threads:", error);
      return [];
    }
  }

  async createThread(title: string, metadata: Record<string, any> = {}): Promise<SimplifiedThread> {
    try {
      const thread = await this.client.createMemoryThread({
        title,
        metadata,
        resourceId: this.resourceId,
        agentId: this.agentId
      });

      return {
        id: thread.id,
        title: thread.title || title,
        createdAt: new Date(thread.createdAt),
        updatedAt: new Date(thread.updatedAt || thread.createdAt),
        metadata: thread.metadata,
        resourceId: thread.resourceId
      };
    } catch (error) {
      console.error("Error creating thread:", error);
      throw error;
    }
  }

  async getThread(threadId: string): Promise<SimplifiedThread | null> {
    try {
      const thread = this.client.getMemoryThread(threadId, this.agentId);
      const threadData = await thread.get();

      return {
        id: threadData.id,
        title: (threadData as any).title || 'Untitled Thread',
        createdAt: new Date(threadData.createdAt),
        updatedAt: new Date(threadData.updatedAt || threadData.createdAt),
        metadata: threadData.metadata,
        resourceId: threadData.resourceId
      };
    } catch (error) {
      console.error("Error fetching thread:", error);
      return null;
    }
  }

  async getMessages(threadId: string): Promise<SimplifiedMessage[]> {
    try {
      const thread = this.client.getMemoryThread(threadId, this.agentId);
      const messages = await thread.getMessages();
      return messages.uiMessages.map((message: any) => ({
        id: message.id,
        content: message.content,
        role: message.role,
        type: message.type,
        threadId: message.threadId,
        createdAt: new Date(message.createdAt),
        timestamp: new Date(message.createdAt) // Add timestamp for component compatibility
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }

  async deleteThread(threadId: string): Promise<boolean> {
    try {
      const thread = this.client.getMemoryThread(threadId, this.agentId);
      await thread.delete();
      return true;
    } catch (error) {
      console.error("Error deleting thread:", error);
      throw error;
    }
  }

  // Send message and get streaming response
  async sendMessage(message: string, threadId: string): Promise<any> {
    try {
      const agent = this.client.getAgent(this.agentId);

      // Send message with thread context
      const response = await agent.stream({
        messages: [{ role: "user", content: message }],
        threadId,
        resourceId: this.resourceId
      });

      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  // Process streaming response
  async processStreamResponse(response: any, onChunk: any, onComplete: any) {
    try {
      const reader = response.body.getReader();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        fullResponse += this.parseResponseChunk(chunk)

        if (onChunk && typeof onChunk === 'function') {
          onChunk(this.parseResponseChunk(chunk));
        }
      }

      if (onComplete && typeof onComplete === 'function') {
        onComplete(fullResponse);
      }
      return fullResponse;
    } catch (error) {
      console.error("Error processing stream:", error);
      throw error;
    }
  }

  // Helper method to parse response chunks and extract clean text
  parseResponseChunk(chunk: any) {
    try {
      // Extract content from chunks with key "0", preserving Markdown syntax
      const lines = chunk.split('\n');
      let result = '';

      for (const line of lines) {
        // Match lines that start with 0:" and extract the content
        // Using a regex that preserves all special characters
        const match = line.match(/^0:"(.*)"$/);
        if (match) {
          // Replace escaped characters to preserve Markdown
          const unescaped = match[1]
            .replace(/\\n/g, '\n')     // Newlines
            .replace(/\\"/g, '"')      // Quotes
            .replace(/\\\\/g, '\\')    // Backslashes
            .replace(/\\t/g, '\t');    // Tabs

          result += unescaped;
        }
      }

      return result;
    } catch (error) {
      console.error("Error parsing response chunk:", error);
      return chunk; // Return the original chunk if parsing fails
    }
  }

  // Get memory status
  async getMemoryStatus(): Promise<any> {
    try {
      const status = await this.client.getMemoryStatus(this.agentId);
      return status;
    } catch (error) {
      console.error("Error getting memory status:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export const chatService = new ChatService();