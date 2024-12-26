import fs from 'fs';
import path from 'path';

export function generateEmoteMap(emotePath: string): Record<string, string> {
    const emoteFiles = fs.readdirSync(emotePath);
    const emoteMap: Record<string, string> = {};

    emoteFiles.forEach(file => {
        const emoteName = path.basename(file, path.extname(file));
        // Add :_  : around the emote to comply with youtube emote naming
        emoteMap[`:_${emoteName}:`] = path.join(emotePath, file);
    });

    return emoteMap;
}