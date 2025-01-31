import {
  AspectRatio,
  Config,
  Emote,
  Port,
  Preview,
  Youtube,
} from "../Config/ConfigInterface";
import {
  SettingsAspectRatio,
  SettingsEmote,
  SettingsPort,
  SettingsPreview,
  SettingsYoutube,
} from "./settingsInterface";

export const formatYoutubeSettings = (youtube: Youtube) => ({
  apiKey: youtube.apiKey,
  videoId: youtube.videoId,
  messageDelay: (youtube.messageDelay / 1000).toString(),
});

export const formatPortSettings = (port: Port) => ({
  port: port.port.toString(),
});

export const formatAspectRatioSettings = (aspectRatio: AspectRatio) => ({
  forceWidthHeight: aspectRatio.forceWidthHeight,
  canvasWidth: aspectRatio.width.toString(),
  canvasHeight: aspectRatio.height.toString(),
  scaleCanvas: aspectRatio.scaleCanvas.toString(),
  scaleImage: aspectRatio.scaleImage.toString(),
});

export const formatEmoteSettings = (emote: Emote) => ({
  emoteWidth: emote.width.toString(),
  randomSizeIncrease: emote.randomSizeIncrease.toString(),
  randomSizeDecrease: emote.randomSizeDecrease.toString(),
  maxEmoteCount: emote.maxEmoteCount.toString(),
  groupEmotes: emote.groupEmotes,
  emoteRoundness: emote.roundness.toString(),
  emoteBackgroundColor: emote.backgroundColor,
});

export const formatPreviewSettings = (preview: Preview) => ({
  speedOfEmotes: (preview.speedOfEmotes / 1000).toString(),
});

export const createConfigCopyWithUpdate = (
  config: Config,
  settingsYoutube: SettingsYoutube,
  settingsPort: SettingsPort,
  settingsAspectRatio: SettingsAspectRatio,
  settingsEmote: SettingsEmote,
  settingsPreview: SettingsPreview
) => {
  return {
    ...config,
    youtube: {
      ...config.youtube,
      apiKey: settingsYoutube.apiKey,
      videoId: settingsYoutube.videoId,
      messageDelay: Math.round(parseFloat(settingsYoutube.messageDelay) * 1000),
    },
    port: {
      ...config.port,
      port: parseInt(settingsPort.port, 10),
    },
    aspectRatio: {
      ...config.aspectRatio,
      forceWidthHeight: settingsAspectRatio.forceWidthHeight,
      width: parseInt(settingsAspectRatio.canvasWidth, 10),
      height: parseInt(settingsAspectRatio.canvasHeight, 10),
      scaleCanvas: parseFloat(settingsAspectRatio.scaleCanvas),
      scaleImage: parseFloat(settingsAspectRatio.scaleImage),
    },
    emote: {
      ...config.emote,
      width: parseInt(settingsEmote.emoteWidth, 10),
      randomSizeIncrease: parseInt(settingsEmote.randomSizeIncrease, 10),
      randomSizeDecrease: parseInt(settingsEmote.randomSizeDecrease, 10),
      maxEmoteCount: parseInt(settingsEmote.maxEmoteCount, 10),
      groupEmotes: settingsEmote.groupEmotes,
      roundness: parseInt(settingsEmote.emoteRoundness, 10),
      backgroundColor: settingsEmote.emoteBackgroundColor,
    },
    preview: {
      ...config.preview,
      speedOfEmotes: Math.round(
        parseFloat(settingsPreview.speedOfEmotes) * 1000
      ),
    },
  };
};
