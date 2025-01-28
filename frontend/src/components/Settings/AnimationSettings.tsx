import { Keyframes, keyframes } from "@emotion/react";

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-40px); }
`;

/*
value to rotate clockwise or counterclockwise
multiple of 360 for smooth
*/
const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const rotateAndReverse = keyframes`
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(360deg); }
`;

/*
value to slide left and slide right
*/
const slide = keyframes`
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(40px); }
`;

const scale = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
`;

export const animationMap: Record<string, Keyframes> = {
  bounce: bounce,
  rotate: rotate,
  scale: scale,
  slide: slide,
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
