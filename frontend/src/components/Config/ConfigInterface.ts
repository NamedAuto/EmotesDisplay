interface EmoteConfig {
  Width: number;
  Height: number;
  RandomSizeIncrease: number;
  RandomSizeDecrease: number;
  MaxEmoteCount: number;
  GroupEmotes: boolean;
  Roundness: number;
  BackgroundColor: string;
}

interface YoutubeConfig {
  ApiKey: string;
  VideoId: string;
  MessageDelay: number;
}

interface AspectRatioConfig {
  ForceWidthHeight: boolean;
  Width: number;
  Height: number;
  ScaleCanvas: number;
  ScaleImage: number;
}

interface PreviewConfig {
  Test: boolean;
  SpeedOfEmotes: number;
}
interface PortConfig {
  Port: number;
}

export interface Config {
  Emote: EmoteConfig;
  Youtube: YoutubeConfig;
  AspectRatio: AspectRatioConfig;
  Preview: PreviewConfig;
  Port: PortConfig;
}
