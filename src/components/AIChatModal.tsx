import React, { useState, useRef, useEffect, ReactElement } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography,
  Paper,
  IconButton,
  Avatar,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  List,
  CircularProgress,
  useTheme,
  InputAdornment,
  Stack,
  Tooltip,
  Zoom,
  alpha,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Menu,
  MenuItem,
  Fade,
  Popover
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { useModalStore } from '../store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../services/chatService';
import { Crop } from 'lucide-react';
import { CropFreeRounded } from '@mui/icons-material';
import { MarkdownRenderer } from './MarkdownRenderer';

// Message interface (aligned with Mastra structure)
interface Message {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  isStreaming?: boolean; // Frontend-only property
}

// Use the simplified thread interface from chatService
interface Thread {
  id: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: any;
  resourceId?: string;
}

// Prompt template interface
interface PromptTemplate {
  icon: ReactElement;
  title: string;
  prompt: string;
  category: 'Analysis' | 'Reports' | 'Help' | 'Ideas';
}

// Typing animation component
const TypingAnimation = () => (
  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', p: 1 }}>
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: 'primary.main',
        animation: 'typing 1s infinite ease-in-out',
        animationDelay: '0s',
        '@keyframes typing': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: 0.7,
          },
          '50%': {
            transform: 'scale(1.2)',
            opacity: 1,
          },
        },
      }}
    />
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: 'primary.main',
        animation: 'typing 1s infinite ease-in-out',
        animationDelay: '0.2s',
      }}
    />
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: 'primary.main',
        animation: 'typing 1s infinite ease-in-out',
        animationDelay: '0.4s',
      }}
    />
  </Box>
);

const AIChatModal: React.FC = () => {
  const theme = useTheme();
  const { updateModal } = useModalStore();
  const queryClient = useQueryClient();
  const [inputMessage, setInputMessage] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [threadToDelete, setThreadToDelete] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [activeMenuThread, setActiveMenuThread] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [isNewThread, setIsNewThread] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  
  // Queries using chatService
  const { data: threads = [], isLoading: isThreadsLoading } = useQuery({
    queryKey: ['threads'],
    queryFn: () => chatService.getThreads(),
    staleTime: 1000 * 60, // 1 minute
  });

  useEffect(() => {
    console.log({threads});
  }, [threads]);
  
  const { data: activeThread, isLoading: isThreadLoading } = useQuery({
    queryKey: ['thread', activeThreadId],
    queryFn: () => activeThreadId ? chatService.getThread(activeThreadId) : null,
    enabled: !!activeThreadId,
    staleTime: 1000 * 30, // 30 seconds
  });
  
  // Add query to fetch messages for the active thread
  const { data: threadMessages = [], isLoading: isMessagesLoading } = useQuery({
    queryKey: ['messages', activeThreadId],
    queryFn: () => activeThreadId ? chatService.getMessages(activeThreadId) : [],
    enabled: !!activeThreadId,
    staleTime: 1000 * 30, // 30 seconds
  });
  
  // Mutations using chatService
  const createThreadMutation = useMutation({
    mutationFn: (title: string) => chatService.createThread(title),
    onSuccess: (newThread) => {
      queryClient.invalidateQueries({ queryKey: ['threads'] });
      setActiveThreadId(newThread.id);
    }
  });
  
  const deleteThreadMutation = useMutation({
    mutationFn: (threadId: string) => chatService.deleteThread(threadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads'] });
    }
  });
  
  const sendMessageMutation = useMutation({
    mutationFn: ({ threadId, content }: { threadId: string, content: string }) => 
      chatService.sendMessage(content, threadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thread', activeThreadId] });
      queryClient.invalidateQueries({ queryKey: ['messages', activeThreadId] });
    }
  });
  
  // Initialize with first thread or create new one if none exists
  useEffect(() => {
    if (threads.length > 0 && !activeThreadId && !isNewThread) {
      // Use first available thread
      const firstThread = threads[0];
      if (firstThread) {
        setActiveThreadId(firstThread.id);
      } else {
        // Create a new local thread if no threads exist
        handleNewChat();
      }
    } else if (threads.length === 0 && !isThreadsLoading && !activeThreadId && !isNewThread) {
      // Create a new local thread if no threads exist
      handleNewChat();
    }
  }, [threads, isThreadsLoading, activeThreadId, isNewThread]);
  
  // Get current messages based on active thread or local messages
  const messages = activeThreadId ? threadMessages : localMessages; // We'll get messages separately since MemoryThread doesn't include them
  
  // Calculate appropriate modal size based on states
  useEffect(() => {
    updateModal({
      maxWidth: isMaximized ? false : isExpanded ? 'xl' : 'xl',
      fullScreen: isMaximized
    });
  }, [isMaximized, isExpanded, updateModal]);

  // Scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      }
    };
    
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, streamingMessage]);
  
  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;
    
    // Set loading state
    setIsLoading(true);
    setIsStreaming(true);
    
    // Add user message to local messages immediately
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    if (isNewThread) {
      // For new threads, create the thread first with the initial message
      try {
        const newThread = await createThreadMutation.mutateAsync(inputMessage.slice(0, 20));
        setActiveThreadId(newThread.id);
        setIsNewThread(false);
        
        // Clear local messages since we're now using the thread
        setLocalMessages([]);
        
        // Send the message and process streaming response
        const response = await chatService.sendMessage(inputMessage, newThread.id);
        await processStreamingResponse(response);
        
        setInputMessage('');
        setIsLoading(false);
        setIsStreaming(false);
      } catch (error) {
        console.error('Error creating thread and sending message:', error);
        setIsLoading(false);
        setIsStreaming(false);
      }
    } else if (activeThreadId) {
      // For existing threads, just send the message
      try {
        // Send the message and process streaming response
        const response = await chatService.sendMessage(inputMessage, activeThreadId);
        await processStreamingResponse(response);
        
        setInputMessage('');
        setIsLoading(false);
        setIsStreaming(false);
      } catch (error) {
        console.error('Error sending message:', error);
        setIsLoading(false);
        setIsStreaming(false);
      }
    }
  };

  // Process streaming response from Mastra
  const processStreamingResponse = async (response: any) => {
    setStreamingMessage('');
    
    await chatService.processStreamResponse(
      response,
      (chunk: string) => {
        // Update streaming message as chunks arrive
        setStreamingMessage(prev => prev + chunk);
      },
      (fullResponse: string) => {
        // When streaming is complete, clear the streaming message
        setStreamingMessage('');
        setIsStreaming(false);
        
        // If we have an active thread, refresh the messages from the server
        if (activeThreadId) {
          queryClient.invalidateQueries({ queryKey: ['messages', activeThreadId] });
          queryClient.invalidateQueries({ queryKey: ['thread', activeThreadId] });
        } else {
          // For new threads that haven't been created yet, add to local messages
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: fullResponse,
            timestamp: new Date()
          };
          
          setLocalMessages(prev => [...prev, assistantMessage]);
        }
      }
    );
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
    // You could add a toast notification here
  };

  const handleNewChat = () => {
    // Instead of creating a thread immediately, just set up a local state
    setActiveThreadId(null);
    setIsNewThread(true);
    setLocalMessages([]);
    setStreamingMessage('');
    setIsStreaming(false);
    
    // Auto-open sidebar if it's not already open
    if (!showSidebar) {
      setShowSidebar(true);
    }
  };

  // Event handlers for thread menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, threadId: string) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setActiveMenuThread(threadId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setActiveMenuThread(null);
  };

  const handleDeleteConfirmOpen = () => {
    setThreadToDelete(activeMenuThread);
    setDeleteConfirmOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setThreadToDelete(null);
  };

  const handleDeleteThread = () => {
    if (threadToDelete) {
      // Delete the thread via chatService
      deleteThreadMutation.mutate(threadToDelete);
      
      // If deleted thread was active, switch to first available thread
      if (threadToDelete === activeThreadId) {
        const remainingThreads = threads.filter(t => t.id !== threadToDelete);
        const firstAvailableThread = remainingThreads[0];
        
        if (firstAvailableThread) {
          setActiveThreadId(firstAvailableThread.id);
        } else {
          // If no threads left, create a new one
          handleNewChat();
        }
      }
      
      handleDeleteConfirmClose();
    }
  };

  const handleChangeThread = (threadId: string) => {
    setActiveThreadId(threadId);
    setIsNewThread(false);
    setLocalMessages([]);
    setStreamingMessage('');
    setIsStreaming(false);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 960) {
      setShowSidebar(false);
    }
  };

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Format relative time for thread list
  const formatRelativeTime = (date: Date | string) => {
    const now = new Date();
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const diffMs = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return dateObj.toLocaleDateString();
    }
  };

  // Get last message from thread for preview - simplified since we don't fetch messages for preview
  const getLastMessage = (thread: Thread) => {
    return 'Recent conversation'; // Placeholder text since we don't fetch messages for list preview
  };

  // Loading states
  const isSendingMessage = sendMessageMutation.isPending;
  const isCreatingThread = createThreadMutation.isPending;
  const isDeletingThread = deleteThreadMutation.isPending;
  const isLoadingContent = isThreadLoading || isMessagesLoading;

  // Handle click on a suggested prompt
  const handlePromptClick = (prompt: string) => {
    setInputMessage(prompt);
    setShowPrompts(false); // Hide prompts after selection
  };

  // Message bubble component
  const MessageBubble: React.FC<{ message: Message }> = ({ message }) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
        mb: 2,
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          gap: 1,
        }}
      >
        <Avatar
          sx={{
            bgcolor: message.role === 'user' 
              ? 'primary.main' 
              : message.role === 'system' 
                ? 'info.main' 
                : 'secondary.main',
            width: 32,
            height: 32,
          }}
        >
          {message.role === 'user' 
            ? <PersonOutlinedIcon fontSize="small" /> 
            : message.role === 'system' 
              ? <SystemUpdateAltIcon fontSize="small" />
              : <SmartToyOutlinedIcon fontSize="small" />}
        </Avatar>
        
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            borderRadius: 2,
            maxWidth: '80%',
            backgroundColor: message.role === 'user' 
              ? alpha(theme.palette.primary.main, 0.08)
              : message.role === 'system'
                ? alpha(theme.palette.info.main, 0.08)
                : alpha(theme.palette.background.paper, 0.8),
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            color: theme.palette.text.primary,
            position: 'relative',
          }}
        >
          {message.isStreaming ? (
            <TypingAnimation />
          ) : (
            <>
              {message.role === 'assistant' ? (
                <MarkdownRenderer content={message.content} />
              ) : (
                <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.content}
                </Typography>
              )}
              
              {message.role === 'assistant' && !message.isStreaming && (
                <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'flex-end' }}>
                  <Tooltip title="Copy message">
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopyMessage(message.content)}
                      sx={{ opacity: 0.5, p: 0.5 }}
                    >
                      <ContentCopyIcon fontSize="small" sx={{ width: 16, height: 16 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </>
          )}
        </Paper>
      </Box>
      <Typography 
        variant="caption" 
        sx={{ 
          mt: 0.5, 
          ml: message.role === 'user' ? 0 : 5,
          mr: message.role === 'user' ? 5 : 0,
          opacity: 0.5 
        }}
      >
        {/* {message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} */}
      </Typography>
    </Box>
  );

  // Streaming message bubble
  const StreamingBubble = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        mb: 2,
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 1,
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'secondary.main',
            width: 32,
            height: 32,
          }}
        >
          <SmartToyOutlinedIcon fontSize="small" />
        </Avatar>
        
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            borderRadius: 2,
            maxWidth: '80%',
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            color: theme.palette.text.primary,
            position: 'relative',
          }}
        >
          {streamingMessage ? (
            <MarkdownRenderer content={streamingMessage + '▍'} />
          ) : (
            <TypingAnimation />
          )}
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box 
      sx={{ 
        height: isMaximized ? '90vh' : '75vh', 
        display: 'flex', 
        overflow: 'hidden',
        borderRadius: isMaximized ? 0 : 2,
        position: 'relative',
        width: '100%',
        transition: theme.transitions.create(['height', 'width'], {
          duration: theme.transitions.duration.standard,
          easing: theme.transitions.easing.easeInOut
        })
      }}
    >
      {/* History Sidebar */}
      <Fade in={showSidebar} timeout={500}>
        <Box
          sx={{
            width: 280,
            borderRight: `1px solid ${theme.palette.divider}`,
            display: showSidebar ? 'flex' : 'none',
            flexDirection: 'column',
            flexShrink: 0,
            backgroundColor: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.background.paper, 0.7)
              : alpha(theme.palette.grey[50], 0.9),
            transition: theme.transitions.create('width', {
              duration: 500,
              easing: theme.transitions.easing.easeInOut
            }),
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}` 
          }}>
            <Typography variant="subtitle1" fontWeight={600}>Chat History</Typography>
            <Box>
              <Tooltip title="Close sidebar">
                <IconButton size="small" onClick={() => setShowSidebar(false)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          <List sx={{ py: 0, overflowY: 'auto', flexGrow: 1 }}>
            {isThreadsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress size={24} />
              </Box>
            ) : threads.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No conversations yet
                </Typography>
              </Box>
            ) : (
              threads.map((thread) => (
                <ListItemButton 
                  key={thread.id}
                  selected={activeThreadId === thread.id}
                  onClick={() => handleChangeThread(thread.id)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                    transition: 'background-color 0.3s ease-in-out',
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 40 }}>
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main 
                      }}
                    >
                      <SmartToyOutlinedIcon fontSize="small" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={
                      <Typography 
                        variant="body2" 
                        noWrap
                        fontWeight={activeThreadId === thread.id ? 600 : 400}
                      >
                        {thread.title}
                      </Typography>
                    }
                    secondary={
                      <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" noWrap sx={{ maxWidth: 100, opacity: 0.7 }}>
                          {getLastMessage(thread).length > 20 
                            ? getLastMessage(thread).substring(0, 20) + '...' 
                            : getLastMessage(thread)}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          {formatRelativeTime(thread.updatedAt || thread.createdAt)}
                        </Typography>
                      </Box>
                    }
                  />
                  <IconButton 
                    size="small" 
                    onClick={(e) => handleMenuOpen(e, thread.id)}
                    sx={{ 
                      opacity: 0.6,
                      '&:hover': { opacity: 1 } 
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </ListItemButton>
              ))
            )}
          </List>
        </Box>
      </Fade>

      {/* Thread options menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
        slotProps={{
          paper: {
            elevation: 2,
            sx: {
              minWidth: 150,
              overflow: 'visible',
              mt: 1,
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleDeleteConfirmOpen}>
          <DeleteOutlineIcon fontSize="small" sx={{ mr: 1, color: theme.palette.error.main }} />
          Delete Thread
        </MenuItem>
      </Menu>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteConfirmClose}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Thread</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this conversation? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteThread} 
            color="error" 
            autoFocus
            disabled={isDeletingThread}
          >
            {isDeletingThread ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main Chat Area */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          width: showSidebar ? 'calc(100% - 280px)' : '100%',
          overflow: 'hidden',
          transition: theme.transitions.create(['width'], {
            duration: theme.transitions.duration.standard,
            easing: theme.transitions.easing.easeInOut
          }),
        }}
      >
        {/* Header */}
        <Box 
          sx={{ 
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={showSidebar ? "Hide history" : "Show history"}>
              <IconButton 
                size="small" 
                onClick={() => setShowSidebar(!showSidebar)}
                sx={{ mr: 1 }}
              >
                <MenuOpenIcon 
                  fontSize="small" 
                  sx={{ 
                    transform: showSidebar ? 'rotate(0deg)' : 'rotate(180deg)',
                    transition: 'transform 0.3s'
                  }} 
                />
              </IconButton>
            </Tooltip>
            <Typography variant="subtitle1" fontWeight={600}>
              {activeThread?.title || (isNewThread ? "New Conversation" : "AI Assistant")}
              {isLoadingContent && <CircularProgress size={16} sx={{ ml: 1 }} />}
            </Typography>
          </Box>
          
          <Box>
            <Tooltip title="New conversation">
              <IconButton 
                size="small" 
                onClick={handleNewChat}
                disabled={isCreatingThread}
              >
                {isCreatingThread ? (
                  <CircularProgress size={16} />
                ) : (
                  <AddIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title={isMaximized ? "Exit fullscreen" : "Fullscreen"}>
              <IconButton 
                size="small" 
                onClick={() => setIsMaximized(!isMaximized)}
              >
                {isMaximized ? (
                  <Zoom in={isMaximized} timeout={300}>
                    <CloseIcon fontSize="small" />
                  </Zoom>
                ) : (
                  <Zoom in={!isMaximized} timeout={300}>
                    <CropFreeRounded fontSize="small" />
                  </Zoom>
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {/* Chat Messages */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            p: 2,
            backgroundColor: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.background.default, 0.5)
              : alpha(theme.palette.grey[50], 0.5),
            width: '100%',
            transition: theme.transitions.create(['width'], {
              duration: theme.transitions.duration.standard,
              easing: theme.transitions.easing.easeInOut
            }),
          }}
        >
          {isLoadingContent ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : messages.length === 0 && !isStreaming ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              textAlign: 'center',
              p: 3
            }}>
              <Avatar 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  mb: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main
                }}
              >
                <SmartToyOutlinedIcon fontSize="large" />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                Welcome to WashPro AI Assistant
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500 }}>
                I'm here to help answer your questions and provide assistance. 
                Type your message below to start a new conversation.
              </Typography>
            </Box>
          ) : (
            <Fade in={true} timeout={500}>
              <Box>
                {messages.map((message) => (
                  <MessageBubble key={message.id || `msg-${Math.random()}`} message={message} />
                ))}
                {isStreaming && <StreamingBubble />}
                <div ref={messagesEndRef} />
              </Box>
            </Fade>
          )}
        </Box>
        
        {/* Prompt templates */}
        <Collapse in={showPrompts} timeout={400}>
          <Box 
            sx={{ 
              p: 1.5, 
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                Suggested prompts
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => setShowPrompts(false)}
                sx={{ p: 0.25 }}
              >
                <CloseIcon fontSize="small" sx={{ width: 16, height: 16 }} />
              </IconButton>
            </Box>
            
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                flexWrap: 'wrap', 
                gap: 0.5,
                '& > *': {
                  mb: 0.5,
                }
              }}
            >
              {/* ... existing prompt templates code ... */}
            </Stack>
          </Box>
        </Collapse>
        
        {/* Input area */}
        <Box 
          sx={{ 
            p: 1.5, 
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {!showPrompts && (
            <Box sx={{ alignSelf: 'flex-start', mb: 1 }}>
              <IconButton 
                size="small" 
                onClick={() => setShowPrompts(true)}
                sx={{ p: 0.5 }}
              >
                <ExpandLessIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Type your message here..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              variant="outlined"
              size="small"
              disabled={(!activeThreadId && !isNewThread) || isLoadingContent || isSendingMessage || isStreaming}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.background.default, 0.5)
                    : alpha(theme.palette.grey[100], 0.5),
                  fontSize: '0.875rem',
                  p: 1.5,
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleSendMessage}
                      disabled={isLoading || inputMessage.trim() === '' || (!activeThreadId && !isNewThread) || isSendingMessage || isStreaming}
                      color="primary"
                      size="small"
                      sx={{ 
                        ml: 1,
                        bgcolor: theme.palette.primary.main,
                        color: '#fff',
                        '&:hover': {
                          bgcolor: theme.palette.primary.dark,
                        },
                        '&.Mui-disabled': {
                          bgcolor: alpha(theme.palette.primary.main, 0.3),
                          color: '#fff',
                        }
                      }}
                    >
                      {isSendingMessage || isStreaming ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <SendIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AIChatModal; 