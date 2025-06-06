import React from "react";
import { WebSocketContextType } from "../../WebSocket/websocketTypes";
import { SettingsAuthentication } from "../settingsInterface";

const handlePreviewConnection = (
  message: any,
  setIsPreviewConnected: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsPreviewConnected(message.connection);
};

const handleYoutubeConnection = (
  message: any,
  setIsYoutubeConnected: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsYoutubeConnected(message.connection);
};

const handleTwitchconnection = (
  message: any,
  setIsTwitchConnected: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsTwitchConnected(message.connection);
};

const handleAuthenticationSave = (
  message: any,
  setSettingsAuthentication: React.Dispatch<
    React.SetStateAction<SettingsAuthentication>
  >
) => {
  setSettingsAuthentication((prevSettings) => {
    const copy = { ...prevSettings };
    if (message.youtubeApiKey) {
      copy.youtubeApiKeyssss = "";
      copy.isYoutubeApiKeyPresent = true;
    }

    if (message.twitch) {
      copy.twitch = "";
      copy.isTwitchPresent = true;
    }

    return copy;
  });
};

const handleYtApiTimeLeft = (
  message: any,
  setYtApiTimeLeft: React.Dispatch<React.SetStateAction<number>>
) => {
  setYtApiTimeLeft(message.timeLeft);
};

export const setupHandlers = (
  updateHandlers: WebSocketContextType["updateHandlers"],
  setIsPreviewConnected: React.Dispatch<React.SetStateAction<boolean>>,
  setIsYoutubeConnected: React.Dispatch<React.SetStateAction<boolean>>,
  setIsTwitchConnected: React.Dispatch<React.SetStateAction<boolean>>,
  setSettingsAuthentication: React.Dispatch<
    React.SetStateAction<SettingsAuthentication>
  >,
  setYtApiTimeLeft: React.Dispatch<React.SetStateAction<number>>
) => {
  updateHandlers({
    "preview-connection": (message: any) =>
      handlePreviewConnection(message, setIsPreviewConnected),

    "youtube-connection": (message: any) =>
      handleYoutubeConnection(message, setIsYoutubeConnected),

    "twitch-connection": (message: any) =>
      handleTwitchconnection(message, setIsTwitchConnected),

    "authentication-present": (message: any) =>
      handleAuthenticationSave(message, setSettingsAuthentication),

    "youtube-api-time-left": (message: any) =>
      handleYtApiTimeLeft(message, setYtApiTimeLeft),
  });
};
