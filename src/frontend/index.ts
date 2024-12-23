import {io, Socket} from 'socket.io-client';
import yaml from "js-yaml";
import {Config} from "../config/Config";

console.log("YAY")

let socket: Socket;
let config: Config;

async function loadConfig() {
    try {
        const response = await fetch('http://localhost:3000/config/config.yaml');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const yamlText = await response.text();
        config = yaml.load(yamlText) as Config;
        console.log('Configuration loaded:', config);

        // Now you can use the config object as needed in your application
    } catch (error) {
        console.error('Error fetching config:', error);
    }
}

async function initialize() {
    try {
        await loadConfig();
        setupSocket();
        main();
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

function main() {

}

initialize()

function setupSocket() {
    socket = io(`http://localhost:${config.backend.port}`, {
        transports: ['websocket'],
    });

    socket.on('connect', () => {
        console.log('Connected to Socket.io server');
    });

    socket.emit('message', "Hello from the frontend");

    socket.on('new-emote', (data: { url: string }) => {
        console.log('Received new emote:    ', data.url);
        displayEmote(data.url)
        // placeEmote(data.url)
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from Socket.io server');
    });
}

function displayEmote(emoteURL: string) {
    console.log(`Image URL received: ${emoteURL}`);
    const container = document.getElementById('emoteContainer') as HTMLElement;
    const emote = createImgElement(emoteURL)

    emote.onload = () => {
        const {x, y} = getRandomPosition(container, emote)
        emote.style.left = `${x}px`;
        emote.style.top = `${y}px`;
        container.appendChild(emote);
    }

    container.appendChild(emote)
}

function createImgElement(emoteURL: string) {
    const emote = document.createElement('img');
    emote.src = emoteURL;
    emote.className = 'emote';
    emote.alt = 'Image from server';
    emote.style.width = `${config.emote.width}px`; // Adjust the size as needed
    emote.style.height = `${config.emote.height}px`;
    emote.style.position = 'absolute';
    return emote;
}

function getRandomPosition(container: HTMLElement, emote: HTMLImageElement): { x: number, y: number } {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const maxX = containerWidth - emote.naturalWidth;
    const maxY = containerHeight - emote.naturalHeight;
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    console.log(`Image dimensions: ${emote.naturalWidth}x${emote.naturalHeight}`);
    console.log(`Random positions: ${randomX}px, ${randomY}px`);
    return {x: randomX, y: randomY};

}


/*
function placeEmote(url: string) {
    const container = document.getElementById('emoteContainer') as HTMLElement;
    const emote = document.createElement('img');
    emote.src = url;
    emote.className = 'emote';
    emote.style.position = 'absolute'; // Ensure absolute positioning

    emote.onload = () => {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const maxX = containerWidth - emote.naturalWidth;
        const maxY = containerHeight - emote.naturalHeight;
        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;
        console.log(`Image dimensions: ${emote.naturalWidth}x${emote.naturalHeight}`);
        console.log(`Random positions: ${randomX}px, ${randomY}px`);

        emote.style.left = `${randomX}px`;
        emote.style.top = `${randomY}px`;

        container.appendChild(emote);
    };

    // Append the image to the container after setting the onload event
    container.appendChild(emote);
}
 */
