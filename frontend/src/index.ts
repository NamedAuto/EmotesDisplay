// import {io, Socket} from 'socket.io-client';
import { getConfig, loadConfigFront } from "./config/configureConfigFront";
// import './styles.css';

console.log("Starting HTML");

let socket: WebSocket;
// let background;

async function initialize() {
  try {
    await loadConfigFront();

    console.log("PAST CONFIG");
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", main);
    } else {
      console.log("GOING TO MAIN");
      main();
    }
  } catch (error) {
    console.error("Error loading config:", error);
  }
}

function main() {
  {
    const boundary = document.getElementById("triangleContainer");
    if (boundary) {
      console.log(getConfig());
      setupSocket();
      loadImageOntoCanvas();
    }
  }
}

initialize();

function setupSocket() {
  console.log(getConfig().Port.App);
  console.log(`${window.location.hostname}:${window.location.port}`)
  socket = new WebSocket(`http://localhost:${getConfig().Port.App}/ws`);

  socket.onopen = () => {
    console.log("Connected to Socket.io server");
    socket.send(
      JSON.stringify({ type: "message", data: "Hello from the frontend" })
    );
  };

  // socket.emit('message', "Hello from the frontend");

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "new-emote") {
      console.log("Received new emote: ", message.data);
      placeEmote(message.data);
    }
  };

  socket.onclose = () => {
    console.log("Disconnected from Socket.io server");
  };

  socket.onerror = (error) => {
    console.error("Websocket error: ", error);
  };
}

const triangleContainer = document.getElementById("triangleContainer")!;
const triangleImage = document.getElementById(
  "triangleImage"
) as HTMLImageElement;
const triangleCanvas = document.getElementById(
  "triangleCanvas"
) as HTMLCanvasElement;
const ctx = triangleCanvas.getContext("2d", { willReadFrequently: true })!;

const emotes: HTMLImageElement[] = [];

function setContainerAndCanvasSize() {
  const scaleCanvas = getConfig().AspectRatio.ScaleCanvas;
  const scaleImage = getConfig().AspectRatio.ScaleImage;
  const maxWidth = getConfig().AspectRatio.Width * scaleCanvas;
  const maxHeight = getConfig().AspectRatio.Height * scaleCanvas;
  const imageWidth = triangleImage.naturalWidth * scaleImage;
  const imageHeight = triangleImage.naturalHeight * scaleImage;
  let newWidth = imageWidth;
  let newHeight = imageHeight;

  if (imageWidth > maxWidth || imageHeight > maxHeight) {
    const widthRatio = maxWidth / imageWidth;
    const heightRatio = maxHeight / imageHeight;
    const scalingFactor = Math.min(widthRatio, heightRatio);
    newWidth = imageWidth * scalingFactor;
    newHeight = imageHeight * scalingFactor;
  }

  triangleContainer.style.width = `${newWidth}px`;
  triangleContainer.style.height = `${newHeight}px`;
  triangleCanvas.width = newWidth;
  triangleCanvas.height = newHeight;
}

// Function to load the triangle image onto the canvas
function loadImageOntoCanvas(): void {
  // let image;
  // // const imagePath = `file://${process.cwd()}/public/background/circle.png`;
  // if(process.env.NODE_ENV === 'production') {
  //     const execPath = process.execPath;
  //     image =  path.join(path.dirname(execPath), 'background');
  // } else {
  //     image = path.join(process.cwd(), 'public', 'background');
  // }

  // image+='/circle.png'

  triangleImage.onload = () => {
    setContainerAndCanvasSize();
    ctx.clearRect(0, 0, triangleCanvas.width, triangleCanvas.height);
    ctx.drawImage(
      triangleImage,
      0,
      0,
      triangleCanvas.width,
      triangleCanvas.height
    );
  };
  triangleImage.src = triangleImage.src; // Trigger the onload event
}

// Function to check if a point is within the triangle area using pixel data
function isWithinTriangle(x: number, y: number): boolean {
  const pixelData = ctx.getImageData(x, y, 1, 1).data;
  // Check if the alpha value is not transparent
  return pixelData[3] > 0;
}

// Function to create a new emote element
function createEmote(emoteUrl: string): HTMLImageElement {
  const emote = document.createElement("img");
  emote.src = emoteUrl;
  emote.className = "emote";
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

// Function to set the position of an emote
function setPosition(emote: HTMLImageElement, x: number, y: number): void {
  emote.style.left = `${x}px`;
  emote.style.top = `${y}px`;
}

// Function to place an emote within the triangle
function placeEmote(emoteUrl: string): void {
  const emote = createEmote(emoteUrl);
  let x: number;
  let y: number;

  do {
    x = Math.random() * triangleCanvas.width;
    y = Math.random() * triangleCanvas.height;
  } while (!isWithinTriangle(x, y));

  setPosition(emote, x, y);
  emote.style.transform = "translate(-50%, -50%)";
  triangleContainer.appendChild(emote);

  emotes.push(emote);
  if (emotes.length > getConfig().Emote.MaxEmoteCount) {
    const oldestEmote = emotes.shift();
    if (oldestEmote) {
      triangleContainer.removeChild(oldestEmote);
    }
  }
}
