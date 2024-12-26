import path from "path";
import * as dotenv from 'dotenv';

dotenv.config();

const dotenvPath = path.resolve(__dirname, '..', '..', '.env');
dotenv.config({
    path: dotenvPath
})


import express from "express";
import {generateEmoteMap} from "./emoteMapping";
import {getLiveChatId, getLiveChatMessages} from "./youtubeApi";
import {configureEndpoints} from "./configureEndpoints";
import {parseMessageForEmotes} from "./parseMessages";
import {configureMiddleware,} from "./configureConnections";
import http from "http";
import {getConfig, loadConfigBack} from "./configureConfigBack";
import {Server} from "socket.io";
import {configureYoutube} from "./configureYoutube";
import {backgroundPath, emotePath, frontendPath, setupFilePaths, yamlPath} from "./getFilePath";
import {formatTime, shutdownGracefully} from "./shutdown";

process.title = "Emote Display";
process.on('SIGINT', shutdownGracefully);
process.on('SIGTERM', shutdownGracefully);

export const app = express();
export const server = http.createServer(app);
export const io = new Server(server);

export let emoteMap: Record<string, string>;

const base = 'http://localhost:';
let baseUrl: string;
let emoteUrl: string;

async function main() {
    try {
        setupFilePaths();
        emoteMap = generateEmoteMap(emotePath);
        await loadConfigBack('config.yaml', yamlPath)
        console.log('Configuration loaded:', getConfig());

        const port = getConfig().port.port;
        baseUrl = base + port;
        emoteUrl = baseUrl + '/emotes/'
        configureMiddleware(baseUrl, getConfig().port.port);
        configureYoutube(getConfig().youtube.apiKey);

        configureEndpoints(app, frontendPath, emotePath, yamlPath, backgroundPath);

        // setupSimple()

        if (getConfig().testing.test) {
            // Number is in seconds in config file
            setInterval(emit, getConfig().testing.speedOfEmotes * 1000);
        } else {
            getYoutubeMessages(getConfig().youtube.videoId || '',
                getConfig().youtube.messageDelay)
        }


        // ()
        console.log('Emote Map:', emoteMap);

        console.log("The app is starting now: " + formatTime());

    } catch (err) {
        console.error('Error initializing server:', err);
    }
}

function emit() {
    const keys = Object.keys(emoteMap);
    const randomIndex = Math.floor(Math.random() * keys.length);

    let x = keys[randomIndex];
    let cleanedText = x.replace(/[:_]/g, '');
    const emoteURL = emoteUrl + cleanedText;

    console.log(`Emit ${emoteURL}`);
    io.emit('new-emote', {url: emoteURL});
}


async function getYoutubeMessages(videoId: string, messageDelay: number) {
    let apiCallCounter = 0;
    // const videoId = getConfig().youtube.videoId || '';
    try {
        const liveChatId = await getLiveChatId(videoId);
        apiCallCounter++;
        console.log("Live chat id: " + liveChatId);
        if (liveChatId) {
            let nextPageToken: string | null | undefined;
            let pollingIntervalMillis = Number(messageDelay * 1000) | 3000;

            // liveChatId becomes undefined soon after a stream ends
            while (liveChatId) {
                const {
                    messages,
                    nextPageToken: newPageToken,
                    pollingIntervalMillis: newPollingInterval
                } = await getLiveChatMessages(liveChatId, nextPageToken ?? undefined);
                apiCallCounter++;

                if (messages.length > 0) {
                    messages.forEach(msg => {
                        // console.log(`${msg.authorDetails?.displayName || 'Unknown'}: ${msg.snippet?.displayMessage || 'NoMsg'}`);
                        // console.log(`${msg.snippet?.type || 'NoType'}`);
                        // console.log(`${msg.snippet?.textMessageDetails?.messageText || 'NoText'}`)
                    });
                }

                messages.forEach((message) => {
                    const emoteURLs = parseMessageForEmotes(message.snippet?.displayMessage || '',
                        emoteUrl,
                        emoteMap);
                    if (emoteURLs.length > 0) {
                        // emitEmotes(emoteURLs)
                    }
                });

                nextPageToken = newPageToken;

                await new Promise(resolve => setTimeout(resolve, pollingIntervalMillis));
                console.log(`API Call ${apiCallCounter} at: ` + formatTime())
            }

            console.log('Live chat stream is no longer available.');
            shutdownGracefully();

        } else {
            console.log('Live chat ID not found for the specified video.');
            shutdownGracefully();
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
        shutdownGracefully();
    }
}

main()
