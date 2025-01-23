import { Box, keyframes } from '@mui/material';


const pulse = keyframes`
  0% {
    opacity: 0.5;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0.5;
    transform: scale(0.9);
  }
`;

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
        gap: 2,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Animated Loader
        <Box
          sx={{
            width: 100,
            height: 100,
            border: '8px solid #e0e0e0',
            borderTop: '8px solid #2563EB',
            borderRadius: '50%',
            animation: `${spin} 1.5s linear infinite`,
          }}
        ></Box> */}
        
        {/* Animated Logo */}
        <img
          src="/loader.png"
          width={80}
          style={{
            marginTop: 25,
            animation: `${pulse} 2s infinite ease-in-out`,
          }}
        />
      </Box>
      
      <Box
        sx={{
          fontSize: '1.2rem',
          fontWeight: 500,
          color: '#2563EB',
          animation: `${pulse} 2s infinite`,
        }}
      >
        Loading, please wait...
      </Box>
    </Box>
  );
};

export default LoadingAnimation;