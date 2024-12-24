import {io, Socket} from 'socket.io-client';
import {config, loadConfig} from "./configureConfig";

console.log("YAY")

let socket: Socket;

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
        }
    }
}

initialize()

function setupSocket(boundary: HTMLElement) {
    socket = io(`http://localhost:${config.backend.port}`, {
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
const triangleImage = document.getElementById('triangle-image') as HTMLImageElement;
const triangleCanvas = document.getElementById('triangleCanvas') as HTMLCanvasElement;
const ctx = triangleCanvas.getContext('2d', {willReadFrequently: true})!;

// Function to load the triangle image onto the canvas
function loadImageOntoCanvas(): void {
    triangleImage.onload = () => {
        const imageAspectRatio = triangleImage.width / triangleImage.height


        if (imageAspectRatio >= 1) {
            triangleContainer.style.width = '1000px';
            triangleContainer.style.height = `${1000 / imageAspectRatio}px`;
            triangleCanvas.width = 1000;
            triangleCanvas.height = 1000 / imageAspectRatio;
        } else {
            triangleContainer.style.width = `${1000 * imageAspectRatio}px`;
            triangleContainer.style.height = '1000px';
            triangleCanvas.width = 1000 * imageAspectRatio;
            triangleCanvas.height = 1000
        }
        //
        // triangleCanvas.width = triangleImage.width;
        // triangleCanvas.height = triangleImage.height;
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
    return emote;
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
}

// Load the image onto the canvas
loadImageOntoCanvas();



