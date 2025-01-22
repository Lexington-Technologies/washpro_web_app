import { Box, CircularProgress, Typography } from '@mui/material';
import { SmartToy } from '@mui/icons-material';
import { RiWaterFlashFill } from 'react-icons/ri';

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
        <RiWaterFlashFill 
          style={{ 
            fontSize: 48, 
            color: '#25306B',
            animation: 'pulse 2s infinite',
            marginTop: 25,
          }} 
        />
        <CircularProgress
          size={100}
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