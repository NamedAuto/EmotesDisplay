import { Config } from "../Config/ConfigInterface";
import { MySettings } from "./settingsInterface";

export const formatSettings = (config: Config) => ({
  apiKey: config.Youtube.ApiKey,
  videoId: config.Youtube.VideoId,
  messageDelay: (config.Youtube.MessageDelay / 1000).toString(),
  port: config.Port.Port.toString(),
  forceWidthHeight: config.AspectRatio.ForceWidthHeight,
  canvasWidth: config.AspectRatio.Width.toString(),
  canvasHeight: config.AspectRatio.Height.toString(),
  scaleCanvas: config.AspectRatio.ScaleCanvas.toString(),
  scaleImage: config.AspectRatio.ScaleImage.toString(),
  emoteWidth: config.Emote.Width.toString(),
  randomSizeIncrease: config.Emote.RandomSizeIncrease.toString(),
  randomSizeDecrease: config.Emote.RandomSizeDecrease.toString(),
  maxEmoteCount: config.Emote.MaxEmoteCount.toString(),
  groupEmotes: config.Emote.GroupEmotes,
  emoteRoundness: config.Emote.Roundness.toString(),
  emoteBackgroundColor: config.Emote.BackgroundColor,
  test: config.Preview.Test,
  speedOfEmotes: (config.Preview.SpeedOfEmotes / 1000).toString(),
});

export const createConfigCopyWithUpdate = (
  config: Config,
  settings: MySettings
) => {
  return {
    ...config,
    Youtube: {
      ...config.Youtube,
      ApiKey: settings.apiKey,
      VideoId: settings.videoId,
      MessageDelay: Math.round(parseFloat(settings.messageDelay) * 1000),
    },
    Port: {
      ...config.Port,
      Port: parseInt(settings.port, 10),
    },
    AspectRatio: {
      ...config.AspectRatio,
      ForceWidthHeight: settings.forceWidthHeight,
      Width: parseInt(settings.canvasWidth, 10),
      Height: parseInt(settings.canvasHeight, 10),
      ScaleCanvas: parseFloat(settings.scaleCanvas),
      ScaleImage: parseFloat(settings.scaleImage),
    },
    Emote: {
      ...config.Emote,
      Width: parseInt(settings.emoteWidth, 10),
      RandomSizeIncrease: parseInt(settings.randomSizeIncrease, 10),
      RandomSizeDecrease: parseInt(settings.randomSizeDecrease, 10),
      MaxEmoteCount: parseInt(settings.maxEmoteCount, 10),
      GroupEmotes: settings.groupEmotes,
      Roundness: parseInt(settings.emoteRoundness, 10),
      BackgroundColor: settings.emoteBackgroundColor,
    },
    Preview: {
      ...config.Preview,
      Test: settings.test,
      SpeedOfEmotes: Math.round(parseFloat(settings.speedOfEmotes) * 1000),
    },
  };
};
