export interface Youtube {
  videoId: string;
  messageDelay: number;
  showGlobalEmotes: boolean;
}

export interface Twitch {
  channelName: string;
}

export interface Port {
  port: number;
}

export interface AspectRatio {
  forceWidthHeight: boolean;
  width: number;
  height: number;
  scaleCanvas: number;
  scaleImage: number;
}

export interface Emote {
  width: number;
  height: number;
  randomSizeIncrease: number;
  randomSizeDecrease: number;
  maxEmoteCount: number;
  maxEmotesPerMsg: number;
  groupEmotes: boolean;
  roundness: number;
  backgroundColor: string;
}

export interface Preview {
  maxRandomEmotes: number;
  speedOfEmotes: number;
  useChannelEmotes: boolean;
  useGlobalEmotes: boolean;
  useRandomEmotes: boolean;
}

export interface Authentication {
  youtubeApiKey: string;
  twitch: string;
}

export interface ApiKey {
  apiKey: string;
}

export interface Config {
  youtube: Youtube;
  twitch: Twitch;
  port: Port;
  aspectRatio: AspectRatio;
  emote: Emote;
  preview: Preview;
}
