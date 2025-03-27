import { ReactNode, useState, useEffect } from 'react';
import { Fab, Box, styled, keyframes, useTheme, Typography, Zoom } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { useModalStore } from '../store';
import AIChatModal from './AIChatModal';

// Define keyframes for the glowing effect
const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(63, 81, 181, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(63, 81, 181, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(63, 81, 181, 0);
  }
`;

const rotateAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Create a container for the button with the glowing effect
const GlowContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  zIndex: 1050,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '120%',
    height: '120%',
    left: '-10%',
    top: '-10%',
    borderRadius: '50%',
    background: 'rgba(63, 81, 181, 0.1)',
    zIndex: -1,
  },
}));

// Style the button with pseudo elements for glow effects
const StyledFab = styled(Fab)(({ theme }) => ({
  animation: `${pulseAnimation} 2s infinite`,
  boxShadow: '0 4px 20px rgba(63, 81, 181, 0.5)',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: `0 0 25px 5px rgba(63, 81, 181, 0.7)`,
  },
  transition: 'all 0.3s ease-in-out',
}));

// Add a ripple effect around the button
const RippleEffect = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '200%',
  height: '200%',
  borderRadius: '50%',
  border: '2px solid rgba(63, 81, 181, 0.3)',
  opacity: 0,
  animation: `ripple 2s infinite ease-out`,
  '@keyframes ripple': {
    '0%': {
      transform: 'translate(-50%, -50%) scale(0.3)',
      opacity: 0.8,
    },
    '100%': {
      transform: 'translate(-50%, -50%) scale(1)',
      opacity: 0,
    },
  },
}));

// Label for the AI button
const AILabel = styled(Box)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: '#fff',
  padding: '4px 10px',
  borderRadius: 12,
  fontSize: '0.75rem',
  fontWeight: 600,
  marginTop: 8,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  letterSpacing: 0.5,
  display: 'flex',
  alignItems: 'center',
  gap: 4,
}));

interface GlowingActionButtonProps {
  icon?: ReactNode;
  onClick?: () => void;
}

export default function GlowingActionButton({
  icon = <SmartToyOutlinedIcon />,
  onClick,
}: GlowingActionButtonProps) {
  const theme = useTheme();
  const { openModal } = useModalStore();
  const [isHovered, setIsHovered] = useState(false);
  const [showLabel, setShowLabel] = useState(false);

  // Show label after a short delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowLabel(true);
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Open the AI Chat modal with larger default size
      openModal(<AIChatModal />, { 
        title: "AI Assistant", 
        maxWidth: "sm",
        showCloseButton: true
      });
    }
  };

  return (
    <GlowContainer>
      <Box sx={{ position: 'relative' }}>
        <RippleEffect />
        <StyledFab
          onClick={handleClick}
          size="small"
          color="primary"
          aria-label="chat"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            '& .MuiSvgIcon-root': {
              animation: isHovered ? `${rotateAnimation} 1s ease-in-out` : 'none',
            },
          }}
        >
          {icon}
        </StyledFab>
      </Box>
      {/* <Zoom in={showLabel} timeout={500}>
        <AILabel>
          <SmartToyOutlinedIcon fontSize="small" sx={{ width: 16, height: 16 }} />
          <Typography variant="caption" sx={{ fontWeight: 600 }}>AI ASSISTANT</Typography>
        </AILabel>
      </Zoom> */}
    </GlowContainer>
  );
} 