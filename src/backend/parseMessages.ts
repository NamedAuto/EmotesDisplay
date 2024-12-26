import {io} from "./server";

const emotesURL = '/emotes/';

export function parseMessageForEmotes(message: string,
                                      emoteUrl: string,
                                      emoteMap: Record<string, string>
): string[] {
    const emoteUrls: string[] = [];

    const regex = /:_.*?:/g;
    const matches = message.match(regex);

    if (matches) {
        matches.forEach((emoteText) => {
            if (emoteMap[emoteText]) {
                let cleanedText = emoteText.replace(/[:_]/g, '');
                const newEmoteUrl = emoteUrl + cleanedText;

                console.log(`Emit ${newEmoteUrl}`);
                io.emit('new-emote', {url: newEmoteUrl});

                emoteUrls.push(emoteMap[emoteText]);
            }
        });
    }

    return emoteUrls;
}

function emitEmotes(emoteUrls: string[]) {
    for (let i = 0; i < emoteUrls.length; i++) {
        console.log(`Emit: ${emoteUrls[i]}`);
        io.emit('new-emote', {url: emoteUrls[i]});
    }
}