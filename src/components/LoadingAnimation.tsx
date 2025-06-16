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
   <>
   test
   </>
  );
};

export default LoadingAnimation;
