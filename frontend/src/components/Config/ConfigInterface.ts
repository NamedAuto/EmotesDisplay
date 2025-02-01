export interface Youtube {
  apiKey: string;
  videoId: string;
  messageDelay: number;
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
  groupEmotes: boolean;
  roundness: number;
  backgroundColor: string;
}

export interface Preview {
  speedOfEmotes: number;
}

export interface Authentication {
  youtubeApiKey: string;
  twitch: string;
}

export interface Config {
  youtube: Youtube;
  port: Port;
  aspectRatio: AspectRatio;
  emote: Emote;
  preview: Preview;
}
