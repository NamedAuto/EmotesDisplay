import { Box, styled } from "@mui/material";
import { keyframes } from "@emotion/react";

export const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-40px); }
`;

export const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const scale = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
`;

export const animationMap: Record<string, any> = {
  bounce: bounce,
  rotate: rotate,
  scale: scale,
};

interface AnimatedBoxProps {
  bounceHeight: number;
  rotateSpeed: number;
  scaleFactor: number;
}

// Styled component for dynamic animation
// const AnimatedBox = styled(Box)<AnimatedBoxProps>(
//   ({ bounceHeight, rotateSpeed, scaleFactor }) => ({
//     animation: `${bounce(bounceHeight)} 5s infinite, ${rotate(
//       rotateSpeed
//     )} 5s infinite, ${scale(scaleFactor)} 5s infinite`,
//   })
// );
