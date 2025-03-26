import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import React, { RefObject, useEffect, useRef } from "react";
import "../../style.css";
import { Config } from "../Config/ConfigInterface";
import { useConfig } from "../Config/ConfigProvider";
import { loadBackground } from "../Config/FetchBackground";
import { useWebSocketContext } from "../WebSocket/WebSocketProvider";
import { Position } from "./positionInterface";
import { UseEmotes } from "./useEmotes";

const CanvasComponent: React.FC = () => {
  const backgroundImageRef = useRef<HTMLImageElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const emotesLayerRef = useRef<HTMLDivElement>(null);
  const backgroundContainerRef = useRef<HTMLDivElement>(null);

  const { config } = useConfig();
  const { updateHandlers } = useWebSocketContext();
  const nonTransparentPositions = useRef<Position[]>([]);

  const { emotesGroups, placeEmotesGroupInBackground } = UseEmotes(
    config,
    backgroundCanvasRef
  );

  useEffect(() => {
    const handlePreviewEmotes = (message: any) => {
      const emoteUrls = message.data;
      console.log("Received preview emotes:", emoteUrls);
      placeEmotesGroupInBackground(emoteUrls, nonTransparentPositions);
    };

    const handleYoutubeEmotes = (message: any) => {
      const emoteUrls = message.data;
      console.log("Received youtube emotes:", emoteUrls);
      placeEmotesGroupInBackground(emoteUrls, nonTransparentPositions);
    };

    const handleTwitchEmotes = (message: any) => {
      const emoteUrls = message.data;
      console.log("Received twitch emotes:", emoteUrls);
      placeEmotesGroupInBackground(emoteUrls, nonTransparentPositions);
    };

    updateHandlers({
      "preview-emote": handlePreviewEmotes,
      "youtube-emote": handleYoutubeEmotes,
      "twitch-emote": handleTwitchEmotes,
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
            storeNonTransparentPoints(
              ctx,
              backgroundCanvasRef as RefObject<HTMLCanvasElement>
            );
          }
        };
      }
    } catch (error) {
      console.error("Failed to load image:", error);
    }
  };

  const storeNonTransparentPoints = (
    ctx: CanvasRenderingContext2D,
    canvasRef: React.RefObject<HTMLCanvasElement>
  ) => {
    let width = canvasRef.current.width;
    let height = canvasRef.current.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3]; // Get the alpha value

      if (alpha > 0) {
        const x = (i / 4) % width;
        const y = Math.floor(i / 4 / width);
        nonTransparentPositions.current.push({ x, y });
      }
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

      if (config.aspectRatio.forceWidthHeight) {
        const maxWidth = config.aspectRatio.width;
        const maxHeight = config.aspectRatio.height;
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

  const StyledImage = styled("img")<{ borderRadius?: string; filter?: string }>`
    width: 200px;
    height: 200px;
    border-radius: ${(props) => props.borderRadius || "0%"};
    filter: ${(props) => props.filter || "none"};
  `;
  return (
    <Box id="backgroundContainer" ref={backgroundContainerRef}>
      <img id="backgroundImage" ref={backgroundImageRef} alt="Background" />
      <canvas id="backgroundCanvas" ref={backgroundCanvasRef}></canvas>
      <Box className="emotesLayer" ref={emotesLayerRef}>
        {emotesGroups.map((group, groupIdx) => (
          <Box
            key={groupIdx}
            className="emote-group"
            sx={{
              zIndex: 3,
            }}
          >
            {group.emotes.map((emote, emoteIdx) => (
              <Box
                key={emoteIdx + "-box"}
                sx={{
                  position: "absolute",
                  left: emote.pos.x,
                  top: emote.pos.y,
                  width: emote.size,
                  height: emote.size,
                  // animation: `${
                  //   animationMap[emote.animation]
                  // } 5s linear infinite`,
                }}
              >
                <StyledImage
                  key={emoteIdx}
                  src={emote.src}
                  className={`emote ${emote.animation}`}
                  crossOrigin="anonymous"
                  style={{
                    width: emote.size,
                    height: emote.size,
                    borderRadius: `${emote.roundness}%`,
                    backgroundColor: config.emote.backgroundColor,
                  }}
                  alt={`emote-${emoteIdx}`}
                />
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CanvasComponent;
