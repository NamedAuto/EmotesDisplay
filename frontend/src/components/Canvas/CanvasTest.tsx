import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from "react";
import { loadBackground } from "../../config/configureConfigFront";
import { useWebSocket } from "../../websocket/mywebsocket";
import useEmotes from "./useEmotes";
import { useConfig } from "../Config/Config";
import { Config } from "../../config/Config";

const CanvasTest: React.FC = () => {
  const backgroundImageRef = useRef<HTMLImageElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const emotesLayerRef = useRef<HTMLDivElement>(null);
  const backgroundContainerRef = useRef<HTMLDivElement>(null);

  const { emotes, placeEmoteInBackground } = useEmotes(backgroundCanvasRef);
  const [isInitialized, setIsInitialized] = useState(false);

  const config = useConfig(); // Use the config context here

  // Ensure we don't attempt to initialize until config is available
  useEffect(() => {
    // if (!config) return; // If config is not available, skip initialization

    // const initialize = async () => {
    //   try {
    //     console.log("HI");
    //     // setIsInitialized(true);
    //     console.log("THIS IS MY CONFIG: " + config);

    //     if (document.readyState === "loading") {
    //       document.addEventListener("DOMContentLoaded", main);
    //     } else {
    //       main();
    //     }
    //   } catch (error) {
    //     console.error("Error loading config:", error);
    //   }
    // };

    // const main = () => {
    //   if (backgroundContainerRef.current) {
    //     loadImageOntoCanvas(config);
    //   }
    // };

    // // Initialize only if config is available
    // initialize();
    console.log("I AM IN HERE");
  }, [config]); // Depend on config so it runs only after the config is loaded

  const loadImageOntoCanvas = async (config: Config) => {
    try {
      const url = await loadBackground();
      if (url && backgroundImageRef.current) {
        console.log("MY CONFIG: ", config); // Log the config to make sure it's loaded

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
      const imageWidth = backgroundImageRef.current.naturalWidth;
      const imageHeight = backgroundImageRef.current.naturalHeight;

      if (config.AspectRatio.ForceWidthHeight) {
        const maxWidth = config.AspectRatio.Width;
        const maxHeight = config.AspectRatio.Height;
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
              borderRadius: `${config.Emote.Roundness}%`,
              backgroundColor: config.Emote.BackgroundColor,
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

export default CanvasTest;
