import { Box, CircularProgress } from '@mui/material';
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
    </Box>
  );
};

export default LoadingAnimation; 