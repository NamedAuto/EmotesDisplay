import {io, Socket} from 'socket.io-client';
import {config, loadConfig} from "./configureConfig";
import './styles.css';
import path from "path";

console.log("YAY")

let socket: Socket;
let background;

async function initialize() {
    try {
        await loadConfig();


        document.addEventListener('DOMContentLoaded', main);

        // setupSocket();
        main();
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

function main() {
    {
        const boundary = document.getElementById('triangleContainer');
        if (boundary) {
            setupSocket(boundary);
            loadImageOntoCanvas();
        }
    }
}

initialize()

function setupSocket(boundary: HTMLElement) {
    socket = io(`http://localhost:${config.port.backend}`, {
        transports: ['websocket'],
    });

    socket.on('connect', () => {
        console.log('Connected to Socket.io server');
    });

    socket.emit('message', "Hello from the frontend");

    socket.on('new-emote', (data: { url: string }) => {
        console.log('Received new emote:    ', data.url);
        // displayEmote(data.url)
        // addEmote(boundary, data.url);
        // createEmoteImage(boundary, data.url);
        placeEmote(data.url)
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from Socket.io server');
    });
}

const triangleContainer = document.getElementById('triangleContainer')!;
const triangleImage = document.getElementById('triangleImage') as HTMLImageElement;
const triangleCanvas = document.getElementById('triangleCanvas') as HTMLCanvasElement;
const ctx = triangleCanvas.getContext('2d', {willReadFrequently: true})!;

const emotes: HTMLImageElement[] = [];

function setContainerAndCanvasSize() {
    const scaleCanvas = config.aspectRatio.scaleCanvas;
    const scaleImage = config.aspectRatio.scaleImage;
    const maxWidth = config.aspectRatio.width * scaleCanvas;
    const maxHeight = config.aspectRatio.height * scaleCanvas;
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
        ctx.drawImage(triangleImage, 0, 0, triangleCanvas.width, triangleCanvas.height);
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
    const emote = document.createElement('img');
    emote.src = emoteUrl;
    emote.className = 'emote';
    changeEmoteSizeRandom(emote)
    emote.style.borderRadius = config.aspectRatio.emote.roundness + '%';
    emote.style.backgroundColor = config.aspectRatio.emote.backgroundColor;
    return emote;
}

function changeEmoteSizeRandom(emote: HTMLImageElement) {
    const randomBinary = Math.random() < 0.5 ? 0 : 1;
    let sizeChange;
    if(randomBinary) {
        sizeChange = config.aspectRatio.emote.randomSizeIncrease;
    } else {
        sizeChange = -config.aspectRatio.emote.randomSizeDecrease;
    }

    const newWidth = config.aspectRatio.emote.width + sizeChange;
    const newHeight = config.aspectRatio.emote.height + sizeChange;
    emote.style.width = newWidth + 'px';
    emote.style.height = newHeight + 'px';
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
    emote.style.transform = 'translate(-50%, -50%)';
    triangleContainer.appendChild(emote);

    emotes.push(emote)
    if (emotes.length > config.aspectRatio.emote.maxEmoteCount) {
        const oldestEmote = emotes.shift();
        if (oldestEmote) {
            triangleContainer.removeChild(oldestEmote);
        }
    }
}



