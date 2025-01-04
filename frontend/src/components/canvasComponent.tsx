import React, { useEffect, useRef, useState } from "react";
// import "./style.css";
// import "./app.css";
import {
  getConfig,
  loadBackground,
  loadConfigFront,
} from "../config/configureConfigFront";

const CanvasComponent: React.FC = () => {
  const backgroundContainerRef = useRef<HTMLDivElement>(null);
  const backgroundImageRef = useRef<HTMLImageElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const [emotes, setEmotes] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    const initialize = async () => {
      try {
        await loadConfigFront();
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
        setupSocket();
        loadImageOntoCanvas();
      }
    };

    initialize();
  }, []);

  const setupSocket = () => {
    const webSocketUrl = `http://localhost:${getConfig().Port}/ws`;
    const socket = new WebSocket(webSocketUrl);

    socket.onopen = () => {
      console.log(`Connected to websocket server: ${webSocketUrl}`);
      socket.send(
        JSON.stringify({ type: "message", data: "Hello from the frontend" })
      );
    };

    socket.onmessage = (event: MessageEvent) => {
      const message: { type: string; data: string | string[] } = JSON.parse(
        event.data
      );
      if (message.type === "new-emote") {
        if (Array.isArray(message.data)) {
          console.log("Received new emotes array: ", message.data);
          message.data.forEach((emoteUrl: string) => {
            placeEmoteInBackground(emoteUrl);
          });
        } else if (typeof message.data === "string") {
          console.log("Received new emote string: ", message.data);
          placeEmoteInBackground(message.data);
        } else {
          console.warn(
            "Expected message.data to be an array or string, but got:",
            message.data
          );
        }
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from websocket server");
    };

    socket.onerror = (error) => {
      console.error("Websocket error: ", error);
    };
  };

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

  const isWithinBackground = (x: number, y: number): boolean => {
    if (backgroundCanvasRef.current) {
      const ctx = backgroundCanvasRef.current.getContext("2d", {
        willReadFrequently: true,
      })!;
      const pixelData = ctx.getImageData(x, y, 1, 1).data;
      return pixelData[3] > 0;
    }
    return false;
  };

  const createEmote = (emoteUrl: string): HTMLImageElement => {
    const emote = document.createElement("img");
    emote.crossOrigin = "anonymous";
    emote.className = "emote";
    emote.src = `${emoteUrl}?${new Date().getTime()}`;
    changeEmoteSizeRandom(emote);
    emote.style.borderRadius = `${getConfig().Emote.Roundness}%`;
    emote.style.backgroundColor = getConfig().Emote.BackgroundColor;
    return emote;
  };

  const changeEmoteSizeRandom = (emote: HTMLImageElement) => {
    const randomBinary = Math.random() < 0.5 ? 0 : 1;
    let sizeChange;
    if (randomBinary) {
      sizeChange = getConfig().Emote.RandomSizeIncrease;
    } else {
      sizeChange = -getConfig().Emote.RandomSizeDecrease;
    }

    const newWidth = getConfig().Emote.Width + sizeChange;
    const newHeight = getConfig().Emote.Height + sizeChange;
    emote.style.width = `${newWidth}px`;
    emote.style.height = `${newHeight}px`;
  };

  const setPosition = (emote: HTMLImageElement, x: number, y: number) => {
    emote.style.left = `${x}px`;
    emote.style.top = `${y}px`;
  };

  const placeEmoteInBackground = (emoteUrl: string) => {
    const emote = createEmote(emoteUrl);
    let x: number;
    let y: number;

    do {
      x = Math.random() * (backgroundCanvasRef.current?.width || 0);
      y = Math.random() * (backgroundCanvasRef.current?.height || 0);
    } while (!isWithinBackground(x, y));

    setPosition(emote, x, y);
    emote.style.transform = "translate(-50%, -50%)";
    if (backgroundContainerRef.current) {
      backgroundContainerRef.current.appendChild(emote);
    }

    setEmotes((prevEmotes) => {
      const newEmotes = [...prevEmotes, emote];
      if (newEmotes.length > getConfig().Emote.MaxEmoteCount) {
        const oldestEmote = newEmotes.shift();
        if (oldestEmote && backgroundContainerRef.current) {
          backgroundContainerRef.current.removeChild(oldestEmote);
        }
      }
      return newEmotes;
    });
  };

  return (
    <div id="backgroundContainer" ref={backgroundContainerRef}>
      <img id="backgroundImage" ref={backgroundImageRef} alt="Background" />
      <canvas id="backgroundCanvas" ref={backgroundCanvasRef}></canvas>
    </div>
  );
};

export default CanvasComponent;
