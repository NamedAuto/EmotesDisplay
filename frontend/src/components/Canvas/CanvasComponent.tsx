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
} from "../../config/configureConfigFront";
import { useWebSocket } from "../../websocket/mywebsocket";
import useEmotes from "./useEmotes";

const CanvasComponent: React.FC = () => {
  const backgroundImageRef = useRef<HTMLImageElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const emotesLayerRef = useRef<HTMLDivElement>(null);
  const backgroundContainerRef = useRef<HTMLDivElement>(null);

  const { emotes, placeEmoteInBackground } = useEmotes(backgroundCanvasRef);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleNewEmote = useCallback((emoteUrl: string) => {
    console.log("Received new emote:", emoteUrl);
    placeEmoteInBackground(emoteUrl);
  }, []);

  const messageHandlers = useMemo(
    () => ({
      "new-emote": handleNewEmote,
    }),
    [handleNewEmote]
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
      // const scaleImage = getConfig().AspectRatio.ScaleImage;
      // const imageWidth = backgroundImageRef.current.naturalWidth * scaleImage;
      // const imageHeight = backgroundImageRef.current.naturalHeight * scaleImage;
      const imageWidth = backgroundImageRef.current.naturalWidth;
      const imageHeight = backgroundImageRef.current.naturalHeight;
      if (getConfig().AspectRatio.ForceWidthHeight) {
        // const scaleCanvas = getConfig().AspectRatio.ScaleCanvas;
        // const maxWidth = getConfig().AspectRatio.Width * scaleCanvas;
        // const maxHeight = getConfig().AspectRatio.Height * scaleCanvas;
        const maxWidth = getConfig().AspectRatio.Width;
        const maxHeight = getConfig().AspectRatio.Height;
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
      } else {
        backgroundContainerRef.current.style.width = `${imageWidth}px`;
        backgroundContainerRef.current.style.height = `${imageHeight}px`;
        backgroundCanvasRef.current.width = imageWidth;
        backgroundCanvasRef.current.height = imageHeight;
      }
    }
  };

  /*
  const setContainerAndCanvasSize = () => {
    if (
      backgroundContainerRef.current &&
      backgroundImageRef.current &&
      backgroundCanvasRef.current
    ) {
      const scaleImage = getConfig().AspectRatio.ScaleImage;
      const imageWidth = backgroundImageRef.current.naturalWidth * scaleImage;
      const imageHeight = backgroundImageRef.current.naturalHeight * scaleImage;
      if (getConfig().AspectRatio.ForceWidthHeight) {
        const scaleCanvas = getConfig().AspectRatio.ScaleCanvas;
        const maxWidth = getConfig().AspectRatio.Width * scaleCanvas;
        const maxHeight = getConfig().AspectRatio.Height * scaleCanvas;


        const widthRatio = maxWidth / imageWidth;
        const heightRatio = maxHeight / imageHeight;
        const scale = Math.min(widthRatio, heightRatio);
        const newWidth = imageWidth * scale;
        const newHeight = imageHeight * scale;

        backgroundContainerRef.current.style.width = `${maxWidth}px`;
        backgroundContainerRef.current.style.height = `${maxHeight}px`;
        backgroundCanvasRef.current.width = newWidth;
        backgroundCanvasRef.current.height = newHeight;
        backgroundImageRef.current.style.width = `${newWidth}px`;;
        backgroundImageRef.current.style.height = `${newHeight}px`;;
      } else {
        backgroundContainerRef.current.style.width = `${imageWidth}px`;
        backgroundContainerRef.current.style.height = `${imageHeight}px`;
        backgroundCanvasRef.current.width = imageWidth;
        backgroundCanvasRef.current.height = imageHeight;
      }
    }
  };
*/

  return (
    <div id="backgroundContainer" ref={backgroundContainerRef}>
      <img id="backgroundImage" ref={backgroundImageRef} alt="Background" />
      <canvas id="backgroundCanvas" ref={backgroundCanvasRef}></canvas>
      <div
        className="emotesLayer"
        ref={emotesLayerRef}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {emotes.map((emote, idx) => (
          <img
            key={idx}
            src={emote.src}
            className="emote"
            crossOrigin="anonymous"
            style={{
              position: "absolute",
              left: emote.x,
              top: emote.y,
              width: emote.size,
              height: emote.size,
              borderRadius: `${getConfig().Emote.Roundness}%`,
              backgroundColor: getConfig().Emote.BackgroundColor,
              transform: "translate(-50%, -50%)",
              zIndex: 3,
            }}
            alt={`emote-${idx}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CanvasComponent;
