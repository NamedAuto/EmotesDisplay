export interface SettingsYoutube {
  apiKey: string;
  videoId: string;
  messageDelay: string;
}

export interface SettingsPort {
  port: string;
}

export interface SettingsAspectRatio {
  forceWidthHeight: boolean;
  canvasWidth: string;
  canvasHeight: string;
  scaleCanvas: string;
  scaleImage: string;
}

export interface SettingsEmote {
  emoteWidth: string;
  randomSizeIncrease: string;
  randomSizeDecrease: string;
  maxEmoteCount: string;
  groupEmotes: boolean;
  emoteRoundness: string;
  emoteBackgroundColor: string;
}

export interface SettingsPreview {
  speedOfEmotes: string;
}

export interface SettingsAuthentication {
  isYoutubeApiKeyPresent: boolean;
  isTwitchPresent: boolean;
  youtubeApiKey: string;
  twitch: string;
}
