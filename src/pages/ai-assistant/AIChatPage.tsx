import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  CircularProgress,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Tooltip,
  Zoom,
  Chip,
  Fade,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Send as SendIcon,
  History,
  Settings,
  DeleteSweep,
  ContentCopy,
  Save,
  SmartToy,
  Add,
  Stop,
  Share as ShareIcon,
} from '@mui/icons-material';
import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '../../config';
import { useAuthStore } from '../../store';
import { 
  Analytics, 
  Assignment, 
  Help, 
  Lightbulb, 
  Search, 
  TrendingUp 
} from '@mui/icons-material';
import OpenAI from 'openai';
import { apiController } from '../../axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface StreamingMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isStreaming?: boolean;
}

interface PromptTemplate {
  icon: React.ReactNode;
  title: string;
  prompt: string;
  category: 'Analysis' | 'Reports' | 'Help' | 'Ideas';
}

const promptTemplates: PromptTemplate[] = [
  {
    icon: <Analytics />,
    title: "Data Analysis",
    prompt: "Analyze the water quality metrics for the past month and identify any concerning trends.",
    category: "Analysis"
  },
  {
    icon: <TrendingUp />,
    title: "Performance Review",
    prompt: "Generate a summary of the sanitation performance metrics for the current quarter.",
    category: "Analysis"
  },
  {
    icon: <Assignment />,
    title: "Report Generation",
    prompt: "Create a detailed report on the maintenance status of all water facilities.",
    category: "Reports"
  },
  {
    icon: <Search />,
    title: "Data Query",
    prompt: "Find all critical maintenance tasks that are pending in the northern district.",
    category: "Reports"
  },
  {
    icon: <Help />,
    title: "Troubleshooting",
    prompt: "What are the common issues with water quality monitoring and how to resolve them?",
    category: "Help"
  },
  {
    icon: <Lightbulb />,
    title: "Recommendations",
    prompt: "Suggest improvements for the current waste management system based on recent data.",
    category: "Ideas"
  },
];

const categories = {
  'Analysis': '#1976d2',  // Blue
  'Reports': '#2e7d32',   // Green
  'Help': '#ed6c02',      // Orange
  'Ideas': '#9c27b0',     // Purple
};

const TypingAnimation = () => (
  <Box sx={{ display: 'flex', gap: 1, px: 2 }}>
    <Box
      component="span"
      sx={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        bgcolor: '#25306B',
        animation: 'typing 1s infinite',
        '&:nth-of-type(2)': {
          animationDelay: '0.2s',
        },
        '&:nth-of-type(3)': {
          animationDelay: '0.4s',
        },
        '@keyframes typing': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-5px)',
          },
        },
      }}
    />
    <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#25306B', animation: 'typing 1s infinite', animationDelay: '0.2s' }} />
    <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#25306B', animation: 'typing 1s infinite', animationDelay: '0.4s' }} />
  </Box>
);

// Add new interface for Thread
interface Thread {
  id: string;
  messages: StreamingMessage[];
}

const AIChatPage: React.FC = () => {
  const [messages, setMessages] = useState<StreamingMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const { token } = useAuthStore();
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPrompts, setShowPrompts] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [currentThread, setCurrentThread] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [assistantId, setAssistantId] = useState<string | null>(null);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io(BASE_URL, {
      auth: {
        token
      }
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
    });

    socketRef.current.on('ai-response', (response: string) => {
      const newMessage: StreamingMessage = {
        id: Date.now().toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setIsLoading(false);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update the OpenAI client initialization
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    dangerouslyAllowBrowser: true
  });

  // Add error handling for missing API key
  useEffect(() => {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      setMessages([{
        id: Date.now().toString(),
        content: 'Error: OpenAI API key is not configured. Please check your environment variables.',
        sender: 'ai',
        timestamp: new Date(),
        isStreaming: false
      }]);
    }
  }, []);

  // Update assistant initialization
  useEffect(() => {
    const initializeAssistant = async () => {
      try {
        // First try to use the ID from environment variable
        if (import.meta.env.VITE_OPENAI_ASSISTANT_ID) {
          setAssistantId(import.meta.env.VITE_OPENAI_ASSISTANT_ID);
          return;
        }

        // If no ID in env, create new assistant
        // const assistant = await openai.beta.assistants.create({
        //   name: 'WashPro AI Assistant',
        //   instructions: 'You are a helpful assistant that can help with water quality monitoring and maintenance tasks.',
        //   model: 'gpt-4o-mini',
        // });
        
        // setAssistantId(assistant.id);
        // console.log('Assistant created:', assistant.id);
      } catch (error) {
        console.error('Error creating assistant:', error);
      }
    };

    initializeAssistant();
  }, []);

  // Update streamResponse function
  const streamResponse = async (userMessage: string) => {
    if (!import.meta.env.VITE_OPENAI_API_KEY || !assistantId) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: 'Error: OpenAI configuration is incomplete.',
        sender: 'ai',
        timestamp: new Date(),
        isStreaming: false
      }]);
      setIsLoading(false);
      return;
    }

    setIsTyping(true);
    setIsLoading(true);

    // Add streaming message placeholder
    const streamingMessageId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: streamingMessageId,
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      isStreaming: true
    }]);

    try {
      // Create or use existing thread
      let threadId = currentThread;
      if (!threadId) {
        const thread = await openai.beta.threads.create();
        threadId = thread.id;
        setCurrentThread(thread.id);
      }

      // Add the user message to the thread
      await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: userMessage
      });

      // Create a run with the stored assistant ID
      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
      });

      // Update the streaming message content as responses come in
      const updateStreamingMessage = (content: string) => {
        setMessages(prev => prev.map(msg => 
          msg.id === streamingMessageId 
            ? { ...msg, content, isStreaming: true }
            : msg
        ));
      };

      // Poll and update the streaming message
      let runStatus = await pollRunStatus(threadId, run.id, updateStreamingMessage);

      // Once complete, finalize the message
      if (runStatus === 'completed') {
        const messages = await openai.beta.threads.messages.list(threadId);
        const lastMessage = messages.data
          .filter(msg => msg.role === 'assistant')
          .sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0];

        if (lastMessage) {
          const content = lastMessage.content
            .filter(item => item.type === 'text')
            .map(item => item.text?.value || '')
            .join('\n');

          setMessages(prev => prev.map(msg => 
            msg.id === streamingMessageId 
              ? {
                  id: lastMessage.id,
                  content: content,
                  sender: 'ai',
                  timestamp: new Date(lastMessage.created_at),
                  isStreaming: false
                }
              : msg
          ));
        }
      }

    } catch (error: any) {
      console.error('Assistant API error:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === streamingMessageId 
          ? {
              id: msg.id,
              content: 'Sorry, I encountered an error. Please try again. ' + error?.message,
              sender: 'ai',
              timestamp: new Date(),
              isStreaming: false
            }
          : msg
      ));
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  // Update pollRunStatus to safely handle message content
  const pollRunStatus = async (threadId: string, runId: string, onUpdate: (content: string) => void) => {
    let status = 'in_progress';
    let lastMessageId = '';
    
    while (status === 'in_progress' || status === 'queued') {
      const run = await openai.beta.threads.runs.retrieve(threadId, runId);
      status = run.status;

      // Get latest messages while running
      const messages = await openai.beta.threads.messages.list(threadId);
      const latestMessage = messages.data[0];

      if (latestMessage && latestMessage.id !== lastMessageId) {
        lastMessageId = latestMessage.id;
        // Safely extract text content from the message
        const content = latestMessage.content
          .filter(item => item.type === 'text')
          .map(item => item.text?.value || '')
          .join('\n');
        
        if (content) {
          onUpdate(content);
        }
      }

      if (status === 'failed' || status === 'expired' || status === 'cancelled') {
        throw new Error(`Run ended with status: ${status}`);
      }

      if (status === 'requires_action') {
        console.log('Function call required');
      }

      if (status !== 'completed') {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return status;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const newMessage: StreamingMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShowPrompts(false);

    await streamResponse(inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTemplateClick = (prompt: string) => {
    setInputMessage(prompt);
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // You can add a snackbar notification here
  };

  const handleClearChat = async () => {
    setMessages([]);
    if (currentThread) {
      try {
        // Note: As of now, OpenAI doesn't provide a direct way to delete threads
        // You might want to store the thread ID for future reference
        setCurrentThread(null);
      } catch (error) {
        console.error('Error clearing chat:', error);
      }
    }
  };

  const handleNewChat = async () => {
    setMessages([]);
    setShowPrompts(true);
    setSelectedCategory(null);
    setCurrentThread(null);
  };

  const filteredTemplates = selectedCategory 
    ? promptTemplates.filter(t => t.category === selectedCategory)
    : promptTemplates;

  const handleShareMessage = async (content: string) => {
    try {
      await navigator.share({
        text: content,
      });
    } catch (error) {
      console.error('Error sharing message:', error);
    }
  };

  const MessageBubble: React.FC<{ message: StreamingMessage }> = ({ message }) => (
    <Box
      sx={{
        maxWidth: '70%',
        p: 2,
        borderRadius: 2,
        bgcolor: message.sender === 'user' ? '#25306B' : '#f8f9fa',
        color: message.sender === 'user' ? 'white' : 'text.primary',
        border: message.sender === 'user' ? 'none' : '1px solid #e0e0e0',
        position: 'relative',
        '&:hover .message-actions': {
          opacity: 1,
        },
        '& .markdown-content': {
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            mt: 2,
            mb: 1,
            fontWeight: 'bold',
          },
          '& p': {
            mb: 1,
          },
          '& ul, & ol': {
            pl: 3,
            mb: 1,
          },
          '& li': {
            mb: 0.5,
          },
          '& code': {
            p: 0.5,
            borderRadius: 1,
            bgcolor: message.sender === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            fontFamily: 'monospace',
          },
          '& pre': {
            my: 1,
            borderRadius: 1,
            '& code': {
              p: 0,
              bgcolor: 'transparent',
            }
          },
          '& blockquote': {
            borderLeft: 4,
            borderColor: message.sender === 'user' ? 'rgba(255,255,255,0.2)' : 'primary.main',
            pl: 2,
            py: 0.5,
            my: 1,
            bgcolor: message.sender === 'user' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          },
        }
      }}
    >
      {message.sender === 'ai' && !message.isStreaming && (
        <Box 
          className="message-actions"
          sx={{ 
            position: 'absolute',
            top: 8,
            right: -40,
            opacity: 0,
            transition: 'opacity 0.2s',
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5
          }}
        >
          <Tooltip title="Copy" TransitionComponent={Zoom} placement="left">
            <IconButton 
              size="small" 
              onClick={() => handleCopyMessage(message.content)}
              sx={{
                bgcolor: 'white',
                boxShadow: 1,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
              }}
            >
              <ContentCopy fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share" TransitionComponent={Zoom} placement="left">
            <IconButton 
              size="small"
              onClick={() => handleShareMessage(message.content)}
              sx={{
                bgcolor: 'white',
                boxShadow: 1,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
              }}
            >
              <ShareIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      <Box className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';
              const path = className?.split(':')[1];

              return !inline ? (
                <Box sx={{ position: 'relative' }}>
                  {path && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -20,
                        left: 0,
                        color: 'text.secondary',
                        fontSize: '0.75rem',
                        bgcolor: 'background.paper',
                        px: 1,
                        py: 0.5,
                        borderRadius: '4px 4px 0 0',
                        borderBottom: 'none',
                      }}
                    >
                      {path}
                    </Box>
                  )}
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={language}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                  <IconButton
                    size="small"
                    onClick={() => handleCopyMessage(String(children))}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      color: 'white',
                      opacity: 0.7,
                      '&:hover': {
                        opacity: 1,
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </Box>
      {message.isStreaming && (
        <Box component="span" sx={{ ml: 1 }}>
          <TypingAnimation />
        </Box>
      )}
      <Typography 
        variant="caption" 
        sx={{ 
          display: 'block', 
          mt: 1,
          color: message.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'text.secondary'
        }}
      >
        {new Date(message.timestamp).toLocaleTimeString()}
      </Typography>
    </Box>
  );

  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Add function to cancel stream
  const handleCancelStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // Add loading state check
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', backgroundColor: '#f8f9fa', p: 3, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#25306B', fontWeight: 600 }}>
          AI Assistant
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="New Chat" TransitionComponent={Zoom}>
            <IconButton onClick={handleNewChat} sx={{ color: '#25306B' }}>
              <Add />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chat History" TransitionComponent={Zoom}>
            <IconButton onClick={() => setShowDrawer(true)} sx={{ color: '#25306B' }}>
              <History />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear Chat" TransitionComponent={Zoom}>
            <IconButton onClick={handleClearChat} sx={{ color: '#25306B' }}>
              <DeleteSweep />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings" TransitionComponent={Zoom}>
            <IconButton sx={{ color: '#25306B' }}>
              <Settings />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {showPrompts && (
        <>
          {/* Category Filters */}
          <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
            <Chip 
              label="All"
              onClick={() => setSelectedCategory(null)}
              variant={selectedCategory === null ? 'filled' : 'outlined'}
              sx={{ 
                '&.MuiChip-filled': { 
                  bgcolor: '#25306B', 
                  color: 'white' 
                },
                '&.MuiChip-outlined': {
                  borderColor: '#25306B',
                  color: '#25306B'
                }
              }}
            />
            {Object.keys(categories).map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'filled' : 'outlined'}
                sx={{ 
                  '&.MuiChip-filled': { 
                    bgcolor: categories[category as keyof typeof categories],
                    color: 'white'
                  },
                  '&.MuiChip-outlined': {
                    borderColor: categories[category as keyof typeof categories],
                    color: categories[category as keyof typeof categories]
                  }
                }}
              />
            ))}
          </Box>

          {/* Quick Prompts */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
              Quick Prompts
            </Typography>
            <Grid container spacing={2}>
              {filteredTemplates.map((template, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Fade in timeout={300} style={{ transitionDelay: `${index * 50}ms` }}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        transition: 'all 0.2s ease',
                        border: '1px solid #e0e0e0',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: categories[template.category as keyof typeof categories],
                          bgcolor: 'rgba(0, 0, 0, 0.01)',
                          '& .hover-icon': {
                            opacity: 1,
                          }
                        }
                      }}
                    >
                      <CardActionArea 
                        onClick={() => handleTemplateClick(template.prompt)}
                        sx={{ height: '100%', p: 2 }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box 
                            sx={{ 
                              mr: 1,
                              color: categories[template.category as keyof typeof categories],
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            {template.icon}
                          </Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {template.title}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {template.prompt}
                        </Typography>
                        <Box 
                          sx={{ 
                            mt: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'white',
                              bgcolor: categories[template.category as keyof typeof categories],
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                            }}
                          >
                            {template.category}
                          </Typography>
                          <IconButton 
                            size="small" 
                            className="hover-icon"
                            sx={{ opacity: 0, transition: 'opacity 0.2s' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTemplateClick(template.prompt);
                            }}
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardActionArea>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}

      {/* Messages Container */}
      <Box 
        sx={{ 
          flex: 1, 
          mb: 2, 
          p: 2, 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          bgcolor: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          transition: 'all 0.2s ease'
        }}
      >
        {messages.length === 0 && !showPrompts && (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              color: 'text.secondary'
            }}
          >
            <SmartToy sx={{ fontSize: 48, mb: 2, color: '#25306B' }} />
            <Typography variant="h6">
              Start a New Conversation
            </Typography>
            <Typography variant="body2">
              Type a message or select a prompt to begin
            </Typography>
          </Box>
        )}
        {messages.map((message) => (
          <Fade in timeout={500} key={message.id}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                gap: 1,
              }}
            >
              {message.sender === 'ai' && (
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  sx={{ 
                    '& .MuiBadge-badge': { 
                      backgroundColor: '#44b700',
                      boxShadow: 'none'
                    }
                  }}
                >
                  <Avatar 
                    src="/ai-avatar.png" 
                    sx={{ bgcolor: '#25306B' }}
                  />
                </Badge>
              )}
              <MessageBubble message={message} />
              {message.sender === 'user' && (
                <Avatar sx={{ bgcolor: '#1a237e' }}>
                  {useAuthStore.getState().user?.name?.[0] || 'U'}
                </Avatar>
              )}
            </Box>
          </Fade>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box 
        sx={{ 
          p: 2,
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          bgcolor: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: 1
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              '& fieldset': {
                borderColor: '#e0e0e0'
              },
              '&:hover fieldset': {
                borderColor: '#25306B'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#25306B'
              }
            }
          }}
        />
        <IconButton 
          onClick={isLoading ? handleCancelStream : handleSendMessage}
          disabled={!inputMessage.trim() && !isLoading}
          sx={{
            bgcolor: '#25306B',
            color: 'white',
            '&:hover': {
              bgcolor: '#1a1f4b'
            },
            '&.Mui-disabled': {
              bgcolor: '#f5f5f5',
              color: '#bdbdbd'
            }
          }}
        >
          {isLoading ? (
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress size={24} color="inherit" />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Stop sx={{ fontSize: 12 }} />
              </Box>
            </Box>
          ) : (
            <SendIcon />
          )}
        </IconButton>
      </Box>

      {/* History Drawer */}
      <Drawer
        anchor="right"
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            borderLeft: '1px solid #e0e0e0',
            boxShadow: 'none'
          }
        }}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Chat History</Typography>
          <List>
            {messages.map((message) => (
              <ListItem key={message.id}>
                <ListItemIcon>
                  {message.sender === 'user' ? <Avatar sx={{ width: 24, height: 24 }} /> : <SmartToy />}
                </ListItemIcon>
                <ListItemText 
                  primary={message.content.substring(0, 30) + '...'}
                  secondary={new Date(message.timestamp).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default AIChatPage;