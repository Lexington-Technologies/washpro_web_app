declare module '@google/generative-ai' {
  export enum HarmCategory {
    HARM_CATEGORY_UNSPECIFIED = 'HARM_CATEGORY_UNSPECIFIED',
    HARM_CATEGORY_HATE_SPEECH = 'HARM_CATEGORY_HATE_SPEECH',
    HARM_CATEGORY_SEXUALLY_EXPLICIT = 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    HARM_CATEGORY_HARASSMENT = 'HARM_CATEGORY_HARASSMENT',
    HARM_CATEGORY_DANGEROUS_CONTENT = 'HARM_CATEGORY_DANGEROUS_CONTENT'
  }

  export enum HarmBlockThreshold {
    BLOCK_NONE = 'BLOCK_NONE',
    BLOCK_ONLY_HIGH = 'BLOCK_ONLY_HIGH',
    BLOCK_MEDIUM_AND_ABOVE = 'BLOCK_MEDIUM_AND_ABOVE',
    BLOCK_LOW_AND_ABOVE = 'BLOCK_LOW_AND_ABOVE'
  }

  export interface GenerationConfig {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
    responseMimeType?: string;
  }

  export interface ChatHistory {
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }

  export interface StreamResult {
    response: {
      text: () => string;
    };
    stream: AsyncIterable<{
      text: () => string;
    }>;
  }

  export interface GenerativeModel {
    startChat: (config: { 
      generationConfig?: GenerationConfig;
      history?: ChatHistory[];
      systemInstruction?: string;
    }) => {
      sendMessage: (message: string) => Promise<StreamResult>;
      sendMessageStream: (message: string) => Promise<StreamResult>;
    };
  }

  export class GoogleGenerativeAI {
    constructor(apiKey: string);
    getGenerativeModel(config: { 
      model: string;
      systemInstruction?: string;
    }): GenerativeModel;
  }
} 