import fs from 'fs';
import path from 'path';

const emotesDir = path.resolve(__dirname, '../../public/emotes');

export function generateEmoteMap(): Record<string, string> {
    const emoteFiles = fs.readdirSync(emotesDir);
    const emoteMap: Record<string, string> = {};

    emoteFiles.forEach(file => {
        const emoteName = path.basename(file, path.extname(file));
        // Add :_  : around the emote to comply with youtube emote naming
        emoteMap[`:_${emoteName}:`] = path.join(emotesDir, file);
    });

    return emoteMap;
}