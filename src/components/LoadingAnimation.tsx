import { Box, CircularProgress, Typography } from '@mui/material';
import { SmartToy } from '@mui/icons-material';

const LoadingAnimation = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f8fafc',
        gap: 2
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <SmartToy 
          sx={{ 
            fontSize: 48, 
            color: '#25306B',
            animation: 'pulse 2s infinite'
          }} 
        />
        <CircularProgress
          size={64}
          sx={{
            position: 'absolute',
            color: '#25306B',
          }}
        />
      </Box>
      <Typography variant="h6" color="text.secondary">
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingAnimation; 