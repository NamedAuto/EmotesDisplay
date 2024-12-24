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
        createEmoteImage(boundary, data.url);
        // placeEmote(data.url)
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from Socket.io server');
    });
}

// Function to generate random position inside the triangle
function getRandomPosition(width: number, height: number, size: number) {
    // const x1 = -200, y1 = 600;
    // const x2 = 200, y2 = 600;
    // const x3 = 0, y3 = 0;

    // const width = 400;
    // const height = 600;

    let u = Math.random();
    let v = Math.random();

    if (u + v > 1) {
        u = 1 - u;
        v = 1 - v;
    }

    // const x = (1 - u - v) * x1 + u * x2 + v * x3;
    // const y = (1 - u - v) * y1 + u * y2 + v * y3;

    const x = (1 - u - v) * (-width / 2) + u * (width / 2);
    const y = (1 - u - v) * height + u * height;

    return { x, y };
}


let count = 0;

// Function to create an emote image element
function createEmoteImage(triangleContainer: HTMLElement, url: string) {
    const emoteImage = document.createElement('img');
    emoteImage.src = url;
    emoteImage.classList.add('emote');

    // Random size between 20px and 50px
    const size = 50//Math.random() * (50 - 20) + 20;
    emoteImage.style.width = `${size}px`;
    emoteImage.style.height = `${size}px`;

    // Get random position within the triangle
    const { x, y } = getRandomPosition(200, 600, size);
    console.log(`Position: x = ${x}, y = ${y}`);


    // Apply the random position to the emote image
    emoteImage.style.left = `${x}px`;
    emoteImage.style.top = `${y}px`;

    // if(count == 0){
    //     emoteImage.style.left = `0`;
    //     emoteImage.style.top = `0px`;
    //     count++;
    // }

    emoteImage.style.transform = 'translate(-50%, -50%)';

    // emoteImage.style.left = `0`;
    // emoteImage.style.top = `0px`;
    // Append the emote image to the triangle container
    triangleContainer.appendChild(emoteImage);
}


