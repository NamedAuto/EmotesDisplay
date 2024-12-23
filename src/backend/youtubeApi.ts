import {youtube} from "./server";


// https://developers.google.com/youtube/v3/docs/videos#liveStreamingDetails.activeLiveChatId
export async function getLiveChatId(videoId: string) {
    const response = await youtube.videos.list({
        part: ['liveStreamingDetails'],
        id: [videoId],
    });

    const video = response.data.items?.[0];
    return video?.liveStreamingDetails?.activeLiveChatId;
}

// https://developers.google.com/youtube/v3/live/docs/liveChatMessages
export async function getLiveChatMessages(liveChatId: string, pageToken?: string) {
    const response = await youtube.liveChatMessages.list({
        liveChatId,
        part: ['snippet', 'authorDetails'],
        pageToken,
    });

    return {
        messages: response.data.items || [],
        nextPageToken: response.data.nextPageToken,
        pollingIntervalMillis: response.data.pollingIntervalMillis,
    };
}

// https://developers.google.com/youtube/v3/live/docs/liveChatMessages
export async function getLiveChatMessagesNoPageToken(liveChatId: string) {
    const response = await youtube.liveChatMessages.list({
        liveChatId,
        part: ['snippet', 'authorDetails'],
    });

    return response.data.items?.map(item => ({
        author: item.authorDetails?.displayName || 'Unknown',
        message: item.snippet?.displayMessage || '',
        eventType: item.snippet?.type || '',
        textDetails: item.snippet?.textMessageDetails?.messageText || ''
    })) || [];
}
