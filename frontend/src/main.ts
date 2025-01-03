// import './style.css';
// import './app.css';

// import {io, Socket} from 'socket.io-client';
import {
  getConfig,
  loadBackground,
  loadConfigFront,
} from "./config/configureConfigFront";
// import './styles.css';

console.log("Starting HTML");

let socket: WebSocket;
// let background;

async function initialize() {
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
}

function main() {
  {
    const boundary = document.getElementById("backgroundContainer");
    if (boundary) {
      setupSocket();
      loadImageOntoCanvas();
    }
  }
}

initialize();

function setupSocket() {
  const webSocketUrl = `http://localhost:${getConfig().Port}/ws`;
  socket = new WebSocket(webSocketUrl);

  socket.onopen = () => {
    console.log(`Connected to websocker server: ${webSocketUrl}`);
    socket.send(
      JSON.stringify({ type: "message", data: "Hello from the frontend" })
    );
  };

  interface Message {
    type: string;
    data: string | string[];
}

socket.onmessage = (event: MessageEvent) => {
    const message: Message = JSON.parse(event.data);
    if (message.type === "new-emote") {

        if (Array.isArray(message.data)) {
            console.log("Received new emotes array: ", message.data);
            message.data.forEach((emoteUrl: string) => {
                placeEmoteInBackground(emoteUrl);
            });

        } else if (typeof message.data === 'string') {
            console.log("Received new emote string: ", message.data);
            placeEmoteInBackground(message.data);

        } else {
            console.warn("Expected message.data to be an array or string, but got:", message.data);
        }
    }
};


  socket.onclose = () => {
    console.log("Disconnected from websocket server");
  };

  socket.onerror = (error) => {
    console.error("Websocket error: ", error);
  };
}

const backgroundContainer = document.getElementById("backgroundContainer")!;
const backgroundImage = document.getElementById(
  "backgroundImage"
) as HTMLImageElement;
const backgroundCanvas = document.getElementById(
  "backgroundCanvas"
) as HTMLCanvasElement;
const ctx = backgroundCanvas.getContext("2d", { willReadFrequently: true })!;

const emotes: HTMLImageElement[] = [];

function setContainerAndCanvasSize() {
  const scaleCanvas = getConfig().AspectRatio.ScaleCanvas;
  const scaleImage = getConfig().AspectRatio.ScaleImage;
  const maxWidth = getConfig().AspectRatio.Width * scaleCanvas;
  const maxHeight = getConfig().AspectRatio.Height * scaleCanvas;
  const imageWidth = backgroundImage.naturalWidth * scaleImage;
  const imageHeight = backgroundImage.naturalHeight * scaleImage;
  let newWidth = imageWidth;
  let newHeight = imageHeight;

  if (imageWidth > maxWidth || imageHeight > maxHeight) {
    const widthRatio = maxWidth / imageWidth;
    const heightRatio = maxHeight / imageHeight;
    const scalingFactor = Math.min(widthRatio, heightRatio);
    newWidth = imageWidth * scalingFactor;
    newHeight = imageHeight * scalingFactor;
  }

  backgroundContainer.style.width = `${newWidth}px`;
  backgroundContainer.style.height = `${newHeight}px`;
  backgroundCanvas.width = newWidth;
  backgroundCanvas.height = newHeight;
}

function loadImageOntoCanvas(): void {
  loadBackground()
    .then((url) => {
      if (url) {
        backgroundImage.src = url + "?" + new Date().getTime();
      }
    })
    .catch((error) => {
      console.error("Failed to load image:", error);
    });

  backgroundImage.crossOrigin = "anonymous";
  backgroundImage.onload = () => {
    setContainerAndCanvasSize();
    ctx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    ctx.drawImage(
      backgroundImage,
      0,
      0,
      backgroundCanvas.width,
      backgroundCanvas.height
    );
  };
}

function isWithinBackground(x: number, y: number): boolean {
  const pixelData = ctx.getImageData(x, y, 1, 1).data;
  // Check if the alpha value is not transparent
  return pixelData[3] > 0;
}

function createEmote(emoteUrl: string): HTMLImageElement {
  const emote = document.createElement("img");
  emote.crossOrigin = "anonymous";
  emote.className = "emote";
  emote.src = emoteUrl + "?" + new Date().getTime();
  changeEmoteSizeRandom(emote);
  emote.style.borderRadius = getConfig().Emote.Roundness + "%";
  emote.style.backgroundColor = getConfig().Emote.BackgroundColor;
  return emote;
}

function changeEmoteSizeRandom(emote: HTMLImageElement) {
  const randomBinary = Math.random() < 0.5 ? 0 : 1;
  let sizeChange;
  if (randomBinary) {
    sizeChange = getConfig().Emote.RandomSizeIncrease;
  } else {
    sizeChange = -getConfig().Emote.RandomSizeDecrease;
  }

  const newWidth = getConfig().Emote.Width + sizeChange;
  const newHeight = getConfig().Emote.Height + sizeChange;
  emote.style.width = newWidth + "px";
  emote.style.height = newHeight + "px";
}

function setPosition(emote: HTMLImageElement, x: number, y: number): void {
  emote.style.left = `${x}px`;
  emote.style.top = `${y}px`;
}

function placeEmoteInBackground(emoteUrl: string): void {
  const emote = createEmote(emoteUrl);
  let x: number;
  let y: number;

  do {
    x = Math.random() * backgroundCanvas.width;
    y = Math.random() * backgroundCanvas.height;
  } while (!isWithinBackground(x, y));

  setPosition(emote, x, y);
  emote.style.transform = "translate(-50%, -50%)";
  backgroundContainer.appendChild(emote);

  emotes.push(emote);
  if (emotes.length > getConfig().Emote.MaxEmoteCount) {
    const oldestEmote = emotes.shift();
    if (oldestEmote) {
      backgroundContainer.removeChild(oldestEmote);
    }
  }
}
