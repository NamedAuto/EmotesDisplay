import {youtube_v3} from "@googleapis/youtube";
import {google} from "googleapis";


let youtube: youtube_v3.Youtube;

export function configureYoutube(apiKey: string) {
    youtube = google.youtube({
        version: 'v3',
        auth: apiKey,
    });
}

export const getYoutube = (): youtube_v3.Youtube => {
    if (!youtube) {
        throw new Error('Youtube is not configured. Configure Youtube first');
    }

    return youtube;
}