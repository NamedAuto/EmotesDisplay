import {config, emoteMap} from "./server";
import {io} from "./configureConnections";

const localURL = 'http://localhost:';
const emotesURL = '/emotes/';

export function parseMessageForEmotes(message: string): string[] {
    const emoteURLs: string[] = [];
    const url = localURL + config.backend.port + emotesURL;

    const regex = /:_.*?:/g;
    const matches = message.match(regex);

    if (matches) {
        matches.forEach((emoteText) => {
            if (emoteMap[emoteText]) {
                let cleanedText = emoteText.replace(/[:_]/g, '');
                const emoteURL = url + cleanedText;

                console.log(`Emit ${emoteURL}`);
                io.emit('new-emote', {url: emoteURL});

                emoteURLs.push(emoteMap[emoteText]);
            }
        });
    }

    return emoteURLs;
}

function emitEmotes(emoteURLS: string[]) {
    for (let i = 0; i < emoteURLS.length; i++) {
        console.log(`Emit: ${emoteURLS[i]}`);
        io.emit('new-emote', {url: emoteURLS[i]});
    }
}