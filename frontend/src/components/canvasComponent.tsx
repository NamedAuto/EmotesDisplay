import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from "react";
import {
  getConfig,
  loadBackground,
  loadConfigFront,
} from "../config/configureConfigFront";
import { useWebSocket } from "./mywebsocket";
import useEmotes from "./useEmotes";

const CanvasComponent: React.FC = () => {
  const backgroundImageRef = useRef<HTMLImageElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const { emotes, placeEmoteInBackground, backgroundContainerRef } =
    useEmotes(backgroundCanvasRef);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleNewEmote = useCallback((emoteUrl: string) => {
    console.log("Received new emote:", emoteUrl);
    placeEmoteInBackground(emoteUrl);
  }, []);

  //   const [users, setUsers] = useState<string[]>([]);
  //   const handleUserJoined = useCallback((userName: string) => {
  //     console.log("New user joined:", userName);
  //     setUsers((prevUsers) => [...prevUsers, userName]);
  //   }, []);

  const messageHandlers = useMemo(
    () => ({
      "new-emote": handleNewEmote,
      //   "user-joined": handleUserJoined,
    }),
    [handleNewEmote] //, handleUserJoined]
  );

  const { socket } = useWebSocket(isInitialized, messageHandlers);

  useEffect(() => {
    const initialize = async () => {
      try {
        await loadConfigFront();
        setIsInitialized(true);
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", main);
        } else {
          main();
        }
      } catch (error) {
        console.error("Error loading config:", error);
      }
    };

    const main = () => {
      if (backgroundContainerRef.current) {
        loadImageOntoCanvas();
      }
    };

    initialize();
  }, [backgroundContainerRef]);

  //   useEffect(() => {
  //     if (isInitialized) {
  //       useWebSocket({
  //         "new-emote": handleNewEmote,
  //         "user-joined": handleUserJoined,
  //       });
  //     }
  //   }, [isInitialized, handleNewEmote, handleUserJoined]);

  const loadImageOntoCanvas = async () => {
    try {
      const url = await loadBackground();
      if (url && backgroundImageRef.current) {
        backgroundImageRef.current.src = `${url}?${new Date().getTime()}`;
        backgroundImageRef.current.crossOrigin = "anonymous";
        backgroundImageRef.current.onload = () => {
          setContainerAndCanvasSize();
          if (backgroundCanvasRef.current && backgroundImageRef.current) {
            const ctx = backgroundCanvasRef.current.getContext("2d", {
              willReadFrequently: true,
            })!;
            ctx.clearRect(
              0,
              0,
              backgroundCanvasRef.current.width,
              backgroundCanvasRef.current.height
            );
            ctx.drawImage(
              backgroundImageRef.current,
              0,
              0,
              backgroundCanvasRef.current.width,
              backgroundCanvasRef.current.height
            );
          }
        };
      }
    } catch (error) {
      console.error("Failed to load image:", error);
    }
  };

  const setContainerAndCanvasSize = () => {
    if (
      backgroundContainerRef.current &&
      backgroundImageRef.current &&
      backgroundCanvasRef.current
    ) {
      const scaleCanvas = getConfig().AspectRatio.ScaleCanvas;
      const scaleImage = getConfig().AspectRatio.ScaleImage;
      const maxWidth = getConfig().AspectRatio.Width * scaleCanvas;
      const maxHeight = getConfig().AspectRatio.Height * scaleCanvas;
      const imageWidth = backgroundImageRef.current.naturalWidth * scaleImage;
      const imageHeight = backgroundImageRef.current.naturalHeight * scaleImage;
      let newWidth = imageWidth;
      let newHeight = imageHeight;

      if (imageWidth > maxWidth || imageHeight > maxHeight) {
        const widthRatio = maxWidth / imageWidth;
        const heightRatio = maxHeight / imageHeight;
        const scalingFactor = Math.min(widthRatio, heightRatio);
        newWidth = imageWidth * scalingFactor;
        newHeight = imageHeight * scalingFactor;
      }

      backgroundContainerRef.current.style.width = `${newWidth}px`;
      backgroundContainerRef.current.style.height = `${newHeight}px`;
      backgroundCanvasRef.current.width = newWidth;
      backgroundCanvasRef.current.height = newHeight;
    }
  };

  return (
    <div id="backgroundContainer" ref={backgroundContainerRef}>
      <img id="backgroundImage" ref={backgroundImageRef} alt="Background" />
      <canvas id="backgroundCanvas" ref={backgroundCanvasRef}></canvas>
    </div>
  );
};

export default CanvasComponent;
