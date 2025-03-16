import { forwardRef, ReactNode } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton, 
  Slide,
  useTheme,
  styled,
  Typography,
  Button,
  Box,
  alpha
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import { useModalStore } from '../store';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1, 3, 3),
  },
  '& .MuiPaper-root': {
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  '& .MuiDialog-paperFullScreen': {
    borderRadius: 0,
  }
}));

// Default content to display when no specific content is provided
const DefaultContent = () => {
  const theme = useTheme();
  const { closeModal } = useModalStore();
  
  return (
    <Box sx={{ textAlign: 'center', py: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
        Welcome to WashPro
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        This is a global modal that can be accessed from anywhere in the application.
        You can customize this content by passing different components to the modal store.
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={closeModal}
          sx={{ 
            borderRadius: 8,
            px: 4,
            fontWeight: 500,
            boxShadow: `0 4px 14px ${theme.palette.primary.main}40`
          }}
        >
          Got it
        </Button>
      </Box>
    </Box>
  );
};

interface GlobalModalProps {
  title?: string;
  showCloseButton?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  actions?: ReactNode;
  fullScreen?: boolean;
}

export default function GlobalModal({ 
  title,
  showCloseButton = true,
  maxWidth = 'sm',
  actions,
  fullScreen = false
}: GlobalModalProps) {
  const theme = useTheme();
  const { isOpen, content, closeModal, fullScreen: storeFullScreen } = useModalStore();

  // Use either props or store value for fullScreen
  const isFullScreen = storeFullScreen !== undefined ? storeFullScreen : fullScreen;

  return (
    <StyledDialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={closeModal}
      aria-describedby="global-modal-description"
      maxWidth={maxWidth}
      fullWidth
      fullScreen={isFullScreen}
    >
      {title && (
        <DialogTitle 
          sx={{ 
            m: 0, 
            p: 2, 
            fontWeight: 500,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.background.paper, 0.8)
              : alpha(theme.palette.background.paper, 0.8),
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {showCloseButton && (
            <IconButton
              aria-label="close"
              onClick={closeModal}
              size="small"
              sx={{
                color: theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}
      <DialogContent 
        dividers={!!title}
        sx={{
          p: isFullScreen ? 0 : undefined,
          bgcolor: isFullScreen ? 'background.default' : 'background.paper',
        }}
      >
        {content || <DefaultContent />}
      </DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </StyledDialog>
  );
} 