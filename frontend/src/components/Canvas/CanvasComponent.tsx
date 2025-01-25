import Box from "@mui/material/Box";
import React, { RefObject, useEffect, useRef } from "react";
import { Config } from "../Config/ConfigInterface";
import { useConfig } from "../Config/ConfigProvider";
import { loadBackground } from "../Config/FetchBackground";
import { useWebSocketContext } from "../WebSocket/WebSocketProvider";
import { Position } from "./positionInterface";
import { UseEmotes } from "./useEmotes";
import "../../style.css";

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
  const { updateHandlers } = useWebSocketContext();
  const nonTransparentPositions = useRef<Position[]>([]);

  const { emotesGroups, placeEmotesGroupInBackground } = UseEmotes(
    config,
    backgroundCanvasRef
  );

  useEffect(() => {
    const handleNewEmote = (emoteUrls: string[]) => {
      console.log("Received new emotes:", emoteUrls);
      placeEmotesGroupInBackground(emoteUrls, nonTransparentPositions);
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
    // console.log("AM IN HERE");
    let width = canvasRef.current.width;
    let height = canvasRef.current.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    // console.log("Initial Image Data is:", imageData);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3]; // Get the alpha value

      if (alpha > 0) {
        // Check if the pixel is non-transparent
        // console.log("IT IS")
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
            {group.emotes.map((emote, emoteIdx) => {
              return (
                <img
                  key={emoteIdx}
                  src={emote.src}
                  className={`emote ${emote.animation}`}
                  crossOrigin="anonymous"
                  style={{
                    position: "absolute",
                    left: emote.pos.x,
                    top: emote.pos.y,
                    width: emote.size,
                    height: emote.size,
                    borderRadius: `${config.Emote.Roundness}%`,
                    backgroundColor: config.Emote.BackgroundColor,
                    zIndex: 3,
                  }}
                  alt={`emote-${emoteIdx}`}
                />
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CanvasComponent;
