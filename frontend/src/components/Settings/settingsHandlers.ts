import { WebSocketContextType } from "../WebSocket/websocketTypes";
import { SettingsAuthentication } from "./settingsInterface";

const handlePreviewConnection = (
  message: any,
  setIsPreviewConnected: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (message.connection === "connected") {
    setIsPreviewConnected(true);
  } else {
    setIsPreviewConnected(false);
  }
};

const handleYoutubeConnection = (
  message: any,
  setIsYoutubeConnected: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (message.connection === "connected") {
    setIsYoutubeConnected(true);
  } else {
    setIsYoutubeConnected(false);
  }
};

const handleAuthenticationSave = (
  message: any,
  settingsAuthentication: SettingsAuthentication,
  setSettingsAuthentication: React.Dispatch<
    React.SetStateAction<SettingsAuthentication>
  >
) => {
  setSettingsAuthentication((prevSettings) => {
    const copy = { ...prevSettings };
    if (message.youtubeApiKey) {
      console.log("HELLO");
      copy.youtubeApiKey = "";
      copy.isYoutubeApiKeyPresent = true;
    }

    if (message.twitch) {
      console.log("THERE");
      copy.twitch = "";
      copy.isTwitchPresent = true;
    }

    console.log("Updated state before set: ", JSON.stringify(copy));
    return copy;
  });

  // const copy = { ...settingsAuthentication };
  // console.log("Copy: " + JSON.stringify(copy));
  // if (message.youtubeApiKey) {
  //   console.log("HELLO");
  //   copy.youtubeApiKey = "";
  //   copy.isYoutubeApiKeyPresent = true;
  // }

  // if (message.twitch) {
  //   console.log("THERE");
  //   copy.twitch = "";
  //   copy.isTwitchPresent = true;
  // } else {
  //   // show user error
  // }

  // console.log("Save: " + JSON.stringify(copy));
  // setSettingsAuthentication(copy);
};

export const setupHandlers = (
  updateHandlers: WebSocketContextType["updateHandlers"],
  setIsPreviewConnected: React.Dispatch<React.SetStateAction<boolean>>,
  setIsYoutubeConnected: React.Dispatch<React.SetStateAction<boolean>>,
  settingsAuthentication: SettingsAuthentication,
  setSettingsAuthentication: React.Dispatch<
    React.SetStateAction<SettingsAuthentication>
  >
) => {
  updateHandlers({
    "preview-connection": (message: any) =>
      handlePreviewConnection(message, setIsPreviewConnected),

    "youtube-connection": (message: any) =>
      handleYoutubeConnection(message, setIsYoutubeConnected),

    "authentication-present": (message: any) =>
      handleAuthenticationSave(
        message,
        settingsAuthentication,
        setSettingsAuthentication
      ),
  });
};
