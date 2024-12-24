import express from "express";
import path from "path";
import fs from "fs";
import {generateEmoteMap} from "./emoteMapping";
import {getLiveChatId, getLiveChatMessages} from "./youtubeApi";

import yaml from "js-yaml";
import {Config} from "../config/Config";
import {google} from "googleapis";
import {youtube_v3} from "@googleapis/youtube";
import {configureEndpoints} from "./configureEndpoints";
import {parseMessageForEmotes} from "./parseMessages";
import {configureMiddleware, io, listen} from "./configureConnections";
import http from "http";
import {yamlPath} from "./getFilePath";
process.title = "Emote Display";

export const emoteMap: Record<string, string> = generateEmoteMap();

export let youtube: youtube_v3.Youtube;
export let config: Config;
export const app = express();
export const server = http.createServer(app);

async function loadConfig(): Promise<Config> {
    return new Promise((resolve, reject) => {
        const configPath = path.join(yamlPath, 'config.yaml')
        fs.readFile(configPath, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }
            try {
                config = yaml.load(data) as Config;
                resolve(config);
            } catch (e) {
                reject(e);
            }
        });
    });
}

async function main() {
    try {
        config = await loadConfig()
        console.log('Configuration loaded:', config);
        // app = express()
        // server = http.createServer(app);
        configureMiddleware();

        setupYoutube();
        configureEndpoints();

        // setupSimple()

        if (config.testing.test) {
            setInterval(emit, 500);
        } else {
            getYoutubeMessages()
        }


        // listen()
        console.log('Emote Map:', emoteMap);

        console.log("I am starting now: " + Date.now());

    } catch (err) {
        console.error('Error initializing server:', err);
    }
}

function setupYoutube() {
    youtube = google.youtube({
        version: 'v3',
        auth: config.youtube.apiKey,
    });
}

const keys = Object.keys(emoteMap);

function emit() {
    const randomIndex = Math.floor(Math.random() * keys.length);

    let x = keys[randomIndex];
    let cleanedText = x.replace(/[:_]/g, '');
    const emoteURL = 'http://localhost:8080/emotes/' + cleanedText;

    console.log(`Emit ${emoteURL}`);
    io.emit('new-emote', {url: emoteURL});
}


async function getYoutubeMessages() {
    let apiCallCounter = 0;
    const videoId = config.youtube.videoId || '';
    try {
        const liveChatId = await getLiveChatId(videoId);
        apiCallCounter++;
        console.log(liveChatId);
        if (liveChatId) {
            let nextPageToken: string | null | undefined;
            let pollingIntervalMillis = Number(config.youtube.messageDelay * 1000) | 3000;

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
                        console.log(`${msg.authorDetails?.displayName || 'Unknown'}: ${msg.snippet?.displayMessage || 'NoMsg'}`);
                        // console.log(`${msg.snippet?.type || 'NoType'}`);
                        // console.log(`${msg.snippet?.textMessageDetails?.messageText || 'NoText'}`)
                    });
                }

                messages.forEach((message) => {
                    const emoteURLs = parseMessageForEmotes(message.snippet?.displayMessage || '');
                    if (emoteURLs.length > 0) {
                        // emitEmotes(emoteURLs)
                    }
                });

                nextPageToken = newPageToken;

                await new Promise(resolve => setTimeout(resolve, pollingIntervalMillis));
                console.log(`API Call ${apiCallCounter} at :` + Date.now())
            }

            console.log('Live chat stream is no longer available.');
            // TODO: Shut down front and backend

        } else {
            console.log('Live chat ID not found for the specified video.');
            // TODO: Maybe shut down front and backend
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

main()