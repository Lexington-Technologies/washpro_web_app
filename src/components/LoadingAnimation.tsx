import { Box } from "@mui/material";
import { keyframes } from "@mui/system"; // Import keyframes from MUI System
import {Loader} from '../assets/svg';

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
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f8fafc",
        gap: 2,
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Animated Logo */}
        <Box
          component="img"
          src={Loader}
          sx={{
            width: 80,
            marginTop: 3,
            animation: `${pulse} 2s infinite ease-in-out`,
          }}
        />
      </Box>

      <Box
        sx={{
          fontSize: "1.2rem",
          fontWeight: 500,
          color: "#2563EB",
          animation: `${pulse} 2s infinite`,
        }}
      >
        Loading, please wait...
      </Box>
    </Box>
  );
};

export default LoadingAnimation;
