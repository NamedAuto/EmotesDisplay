export interface SettingsYoutube {
  videoId: string;
  messageDelay: string;
  showGlobalEmotes: boolean;
}

export interface SettingsTwitch {
  channelName: string;
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
  maxEmotesPerMsg: string;
  groupEmotes: boolean;
  emoteRoundness: string;
  emoteBackgroundColor: string;
}

export interface SettingsPreview {
  maxRandomEmotes: string;
  speedOfEmotes: string;
  useChannelEmotes: boolean;
  useGlobalEmotes: boolean;
  useRandomEmotes: boolean;
}

export interface SettingsAuthentication {
  isYoutubeApiKeyPresent: boolean;
  isTwitchPresent: boolean;
  youtubeApiKeyssss: string;
  twitch: string;
}

export interface SettingsApiKey {
  apiKey: string;
}

export interface HasApiKeyResponse {
  exists: boolean;
}

export interface YtApiTimeLeft {
  timeLeft: number;
}
