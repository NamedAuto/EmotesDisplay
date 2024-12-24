import fs from 'fs';
import path from 'path';
import {emotePath} from "./getFilePath";

// let emotePath: string;
// if (process.env.NODE_ENV == "production") {
//     const execPath = process.execPath;
//     emotePath = path.join(path.dirname(execPath), 'public', 'emotes');
// } else {
//     console.log("HELLO FROM IN HERE")
//     emotePath = path.join(process.cwd(), 'emotes');
// }


// const emotesDir = path.resolve(__dirname, '../../public/emotes');

export function generateEmoteMap(): Record<string, string> {
    // const emotesDir = path.join(emotePath, 'emotes');
    const emoteFiles = fs.readdirSync(emotePath);
    const emoteMap: Record<string, string> = {};

    emoteFiles.forEach(file => {
        const emoteName = path.basename(file, path.extname(file));
        // Add :_  : around the emote to comply with youtube emote naming
        emoteMap[`:_${emoteName}:`] = path.join(emotePath, file);
    });

    return emoteMap;
}