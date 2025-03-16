import React, { useState, useRef, useEffect, ReactElement } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography,
  Paper,
  IconButton,
  Avatar,
  Drawer,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  List,
  Divider,
  Chip,
  CircularProgress,
  useTheme,
  Card,
  InputAdornment,
  Stack,
  Tooltip,
  Zoom,
  alpha,
  Collapse,
  Badge,
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
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import { useModalStore } from '../store';

// Interface for threads
interface Thread {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: StreamingMessage[];
}

// Message interface
interface StreamingMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isStreaming?: boolean;
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
  const [inputMessage, setInputMessage] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [activeThread, setActiveThread] = useState<string>('1');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [threadToDelete, setThreadToDelete] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [activeMenuThread, setActiveMenuThread] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Create some mock threads
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: '1',
      title: 'New Chat',
      lastMessage: 'Hello! I\'m WashPro AI Assistant.',
      timestamp: new Date(),
      messages: [
        {
          id: '1-msg-1',
          content: 'Hello! I\'m WashPro AI Assistant. How can I help you today?',
          sender: 'ai',
          timestamp: new Date(),
        }
      ]
    },
    {
      id: '2',
      title: 'Water Usage Analysis',
      lastMessage: 'Here\'s the water usage analysis you requested.',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      messages: [
        {
          id: '2-msg-1',
          content: 'Hello! I\'m WashPro AI Assistant. How can I help you today?',
          sender: 'ai',
          timestamp: new Date(Date.now() - 86400000),
        },
        {
          id: '2-msg-2',
          content: 'Can you analyze our water usage across all stations last month?',
          sender: 'user',
          timestamp: new Date(Date.now() - 86400000 + 1000),
        },
        {
          id: '2-msg-3',
          content: 'Here\'s the water usage analysis you requested. Our stations used 15% less water compared to the previous month, with Station #5 being the most efficient.',
          sender: 'ai',
          timestamp: new Date(Date.now() - 86400000 + 60000),
        }
      ]
    },
    {
      id: '3',
      title: 'Equipment Maintenance',
      lastMessage: 'I recommend scheduling maintenance every 3 months.',
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      messages: [
        {
          id: '3-msg-1',
          content: 'Hello! I\'m WashPro AI Assistant. How can I help you today?',
          sender: 'ai',
          timestamp: new Date(Date.now() - 172800000),
        },
        {
          id: '3-msg-2',
          content: 'What\'s the recommended maintenance schedule for our equipment?',
          sender: 'user',
          timestamp: new Date(Date.now() - 172800000 + 1000),
        },
        {
          id: '3-msg-3',
          content: 'I recommend scheduling maintenance every 3 months to ensure optimal performance and longevity of your equipment.',
          sender: 'ai',
          timestamp: new Date(Date.now() - 172800000 + 60000),
        }
      ]
    }
  ]);
  
  // Get current messages based on active thread
  const messages = threads.find(t => t.id === activeThread)?.messages || [];
  
  // Predefined prompt templates
  const promptTemplates: PromptTemplate[] = [
    {
      icon: <AssessmentOutlinedIcon />,
      title: 'Performance Analysis',
      prompt: 'Analyze the performance of our wash stations in the last quarter.',
      category: 'Analysis'
    },
    {
      icon: <AssessmentOutlinedIcon />,
      title: 'Water Usage',
      prompt: 'Summarize water usage across all stations and identify opportunities for conservation.',
      category: 'Analysis'
    },
    {
      icon: <HelpOutlineOutlinedIcon />,
      title: 'Equipment Maintenance',
      prompt: 'What is the recommended maintenance schedule for our wash equipment?',
      category: 'Help'
    },
    {
      icon: <LightbulbOutlinedIcon />,
      title: 'Efficiency Improvements',
      prompt: 'Suggest ways to improve efficiency at our busiest locations.',
      category: 'Ideas'
    },
  ];

  // Calculate appropriate modal size based on states
  useEffect(() => {
    updateModal({
      maxWidth: isMaximized ? false : isExpanded ? 'xl' : 'lg',
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
  }, [messages]);

  // Mock function to simulate AI response
  const simulateAIResponse = (userMessage: string) => {
    setIsLoading(true);
    
    // Generate a mock message ID based on timestamp
    const messageId = Date.now().toString();
    
    // Add user message to the current thread
    setThreads(prev => prev.map(thread => 
      thread.id === activeThread 
        ? {
            ...thread,
            lastMessage: userMessage,
            timestamp: new Date(),
            messages: [
              ...thread.messages,
              {
                id: messageId,
                content: userMessage,
                sender: 'user',
                timestamp: new Date()
              }
            ]
          }
        : thread
    ));
    
    // Simulate typing delay
    setTimeout(() => {
      // Add AI "typing" message
      setThreads(prev => prev.map(thread => 
        thread.id === activeThread 
          ? {
              ...thread,
              messages: [
                ...thread.messages,
                {
                  id: `${messageId}-ai-typing`,
                  content: '',
                  sender: 'ai',
                  timestamp: new Date(),
                  isStreaming: true
                }
              ]
            }
          : thread
      ));
      
      // Simulate response delay
      setTimeout(() => {
        // Replace typing message with actual response
        const aiResponse = `This is a simulated response to: "${userMessage}". In a real implementation, this would be connected to an AI service.`;
        
        setThreads(prev => prev.map(thread => 
          thread.id === activeThread 
            ? {
                ...thread,
                lastMessage: aiResponse,
                messages: thread.messages.map(msg => 
                  msg.id === `${messageId}-ai-typing` 
                    ? {
                        ...msg,
                        id: `${messageId}-ai`,
                        content: aiResponse,
                        isStreaming: false
                      }
                    : msg
                )
              }
            : thread
        ));
        
        setIsLoading(false);
      }, 2000);
    }, 500);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;
    
    simulateAIResponse(inputMessage);
    setInputMessage('');
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

  const handleClearChat = () => {
    setThreads(prev => prev.map(thread => 
      thread.id === activeThread 
        ? {
            ...thread,
            lastMessage: 'Hello! I\'m WashPro AI Assistant.',
            messages: [{
              id: Date.now().toString(),
              content: 'Hello! I\'m WashPro AI Assistant. How can I help you today?',
              sender: 'ai',
              timestamp: new Date(),
            }]
          }
        : thread
    ));
  };

  const handleNewChat = () => {
    const newThreadId = `thread-${Date.now()}`;
    
    setThreads(prev => [
      {
        id: newThreadId,
        title: 'New Chat',
        lastMessage: 'Hello! I\'m WashPro AI Assistant.',
        timestamp: new Date(),
        messages: [{
          id: `${newThreadId}-msg-1`,
          content: 'Hello! I\'m WashPro AI Assistant. How can I help you today?',
          sender: 'ai',
          timestamp: new Date(),
        }]
      },
      ...prev
    ]);
    
    setActiveThread(newThreadId);
    
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
      // Delete the thread
      setThreads(prev => prev.filter(thread => thread.id !== threadToDelete));
      
      // If deleted thread was active, switch to first available thread
      if (threadToDelete === activeThread) {
        const firstAvailableThread = threads.find(thread => thread.id !== threadToDelete);
        if (firstAvailableThread) {
          setActiveThread(firstAvailableThread.id);
        } else {
          // If no threads left, create a new one
          handleNewChat();
        }
      }
      
      handleDeleteConfirmClose();
    }
  };

  const handleChangeThread = (threadId: string) => {
    setActiveThread(threadId);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 960) {
      setShowSidebar(false);
    }
  };

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Format relative time for thread list
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Message bubble component
  const MessageBubble: React.FC<{ message: StreamingMessage }> = ({ message }) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
        mb: 2,
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          gap: 1,
        }}
      >
        <Avatar
          sx={{
            bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
            width: 32,
            height: 32,
          }}
        >
          {message.sender === 'user' ? <PersonOutlinedIcon fontSize="small" /> : <SmartToyOutlinedIcon fontSize="small" />}
        </Avatar>
        
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            borderRadius: 2,
            maxWidth: '80%',
            backgroundColor: message.sender === 'user' 
              ? alpha(theme.palette.primary.main, 0.08)
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
              <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                {message.content}
              </Typography>
              
              {message.sender === 'ai' && (
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
          ml: message.sender === 'user' ? 0 : 5,
          mr: message.sender === 'user' ? 5 : 0,
          opacity: 0.5 
        }}
      >
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Typography>
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
          duration: theme.transitions.duration.standard
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
              <Tooltip title="New chat">
                <IconButton size="small" onClick={handleNewChat}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Close sidebar">
                <IconButton size="small" onClick={() => setShowSidebar(false)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          <List sx={{ py: 0, overflowY: 'auto', flexGrow: 1 }}>
            {threads.map((thread) => (
              <ListItemButton 
                key={thread.id}
                selected={activeThread === thread.id}
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
                      fontWeight={activeThread === thread.id ? 600 : 400}
                    >
                      {thread.title}
                    </Typography>
                  }
                  secondary={
                    <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" noWrap sx={{ maxWidth: 100, opacity: 0.7 }}>
                        {thread.lastMessage.length > 20 
                          ? thread.lastMessage.substring(0, 20) + '...' 
                          : thread.lastMessage}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {formatRelativeTime(thread.timestamp)}
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
            ))}
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
          <Button onClick={handleDeleteThread} color="error" autoFocus>
            Delete
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
              {threads.find(t => t.id === activeThread)?.title || "AI Assistant"}
            </Typography>
          </Box>
          
          <Box>
            <Tooltip title="New conversation">
              <IconButton size="small" onClick={handleNewChat}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={isExpanded ? "Collapse" : "Expand"}>
              <IconButton 
                size="small" 
                onClick={handleExpandToggle}
                sx={{ 
                  mx: 0.5,
                  transition: 'transform 0.3s',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                {isExpanded ? 
                  <CloseFullscreenIcon fontSize="small" /> : 
                  <OpenInFullIcon fontSize="small" />
                }
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
                    <ExpandMoreIcon fontSize="small" />
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
          <Fade in={true} timeout={500}>
            <Box>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </Box>
          </Fade>
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
              {promptTemplates.map((template, index) => (
                <Chip
                  key={index}
                  icon={template.icon}
                  label={template.title}
                  onClick={() => handleTemplateClick(template.prompt)}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    borderRadius: 3,
                    fontSize: '0.75rem',
                    height: 28,
                    '& .MuiChip-icon': {
                      fontSize: '0.875rem',
                    }
                  }}
                />
              ))}
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
                      disabled={isLoading || inputMessage.trim() === ''}
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
                      {isLoading ? (
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