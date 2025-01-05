import React, { useEffect, useRef } from "react";
import { Config } from "../Config/ConfigInterface";
import { loadBackground } from "../Config/FetchBackground";
import { useConfig } from "../Config/Config";
import useEmotes from "./useEmotes";
import { useWebSocketContext } from "../WebSocket/WebSocketProvider";

const CanvasTest: React.FC = () => {
  const backgroundImageRef = useRef<HTMLImageElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const emotesLayerRef = useRef<HTMLDivElement>(null);
  const backgroundContainerRef = useRef<HTMLDivElement>(null);

  const config = useConfig(); // Use the config context here
  const { emotes, placeEmoteInBackground } = useEmotes(
    config,
    backgroundCanvasRef
  );

  const { socket, isConnected, updateHandlers } = useWebSocketContext();

  useEffect(() => {
    const handleNewEmote = (emoteUrl: string) => {
      console.log("Received new emote:", emoteUrl);
      placeEmoteInBackground(emoteUrl);
    };

    updateHandlers({
      "new-emote": handleNewEmote,
    });
  }, [updateHandlers]);

  useEffect(() => {
    if (!config) return;

    const initialize = async () => {
      try {
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", main);
        } else {
          main();
        }
      } catch (error) {
        console.error("Error loading DOM:", error);
      }
    };

    const main = () => {
      if (backgroundContainerRef.current) {
        loadImageOntoCanvas(config);
      }
    };

    // Initialize only if config is available
    initialize();
  }, []);

  const loadImageOntoCanvas = async (config: Config) => {
    try {
      const url = await loadBackground(config);
      if (url && backgroundImageRef.current) {
        backgroundImageRef.current.src = `${url}?${new Date().getTime()}`;
        backgroundImageRef.current.crossOrigin = "anonymous";
        backgroundImageRef.current.onload = () => {
          setContainerAndCanvasSize(config);
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

  const setContainerAndCanvasSize = (config: Config) => {
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
