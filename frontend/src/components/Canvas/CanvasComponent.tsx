import React, { useEffect, useRef, useState } from "react";
import { Config } from "../Config/ConfigInterface";
import { loadBackground } from "../Config/FetchBackground";
import { useConfig } from "../Config/ConfigProvider";
import useEmotes from "./useEmotes";
import { useWebSocketContext } from "../WebSocket/WebSocketProvider";
import Box from "@mui/material/Box";
import useWindowSize from "./windowSize";

const CanvasComponent: React.FC = () => {
  const backgroundImageRef = useRef<HTMLImageElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const emotesLayerRef = useRef<HTMLDivElement>(null);
  const backgroundContainerRef = useRef<HTMLDivElement>(null);

  // const { width, height } = useWindowSize();
  // const [scale, setScale] = useState(1);
  // const initialWidth = 1920; // or your preferred reference width
  // const initialHeight = 1080; // or your preferred reference height

  // // Calculate scale factor based on window size
  // useEffect(() => {
  //   const scaleWidth = width / initialWidth;
  //   const scaleHeight = height / initialHeight;
  //   setScale(Math.min(scaleWidth, scaleHeight)); // Maintain the aspect ratio
  // }, [width, height]);

  const config = useConfig();
  const { socket, isConnected, updateHandlers } = useWebSocketContext();

  const { emotesGroups, placeEmotesGroupInBackground } = useEmotes(
    config,
    backgroundCanvasRef
  );

  useEffect(() => {
    const handleNewEmote = (emoteUrls: string[]) => {
      console.log("Received new emotes:", emoteUrls);
      placeEmotesGroupInBackground(emoteUrls);
    };

    updateHandlers({
      "new-emote": handleNewEmote,
    });
  }, [updateHandlers]);

  useEffect(() => {
    if (!config) {
      console.log("Config not ready");
      return;
    }

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

    return () => {
      console.log("I am closing");
    };
  }, [config]);

  /*
  TODO: Fix two background images loading during Strict.Mode
    The first one is not removed and instead, the second image is overlapped on top
  */
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
    <Box
      id="backgroundContainer"
      ref={backgroundContainerRef}
      // style={{
      //   width: `${initialWidth}px`,
      //   height: `${initialHeight}px`,
      //   transform: `scale(${scale})`,
      //   // transformOrigin: 'top left',
      //   position: 'relative',
      // }}
    >
      <img id="backgroundImage" ref={backgroundImageRef} alt="Background" />
      <canvas id="backgroundCanvas" ref={backgroundCanvasRef}></canvas>
      <Box
        className="emotesLayer"
        ref={emotesLayerRef}
        // style={{ position: "absolute", top: 0, left: 0 }}
      >
        {emotesGroups.map((group, groupIdx) => (
          <Box
            key={groupIdx}
            className="emote-group"
            sx={{
              // position: "absolute",
              // top: `${groupIdx * 100}px`,
              // left: "50%",
              // transform: "translate(-50%, -50%)",
              zIndex: 3,
            }}
          >
            {group.emotes.map((emote, emoteIdx) => (
              <img
                key={emoteIdx}
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
                  transform: "translate(0%, -50%)",
                  zIndex: 3,
                }}
                alt={`emote-${emoteIdx}`}
              />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CanvasComponent;
