import { WebSocketContextType } from "../WebSocket/websocketTypes";

const handlePreviewConnection = (
  something: string,
  setIsPreviewConnected: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (something == "connected") {
    setIsPreviewConnected(true);
  } else {
    setIsPreviewConnected(false);
  }
};

const handleYoutubeConnection = (
  something: string,
  setIsYoutubeConnected: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (something == "connected") {
    setIsYoutubeConnected(true);
  } else {
    setIsYoutubeConnected(false);
  }
};

export const setupHandlers = (
  updateHandlers: WebSocketContextType["updateHandlers"],
  setIsPreviewConnected: React.Dispatch<React.SetStateAction<boolean>>,
  setIsYoutubeConnected: React.Dispatch<React.SetStateAction<boolean>>
) => {
  updateHandlers({
    "preview-connection": (data: any) =>
      handlePreviewConnection(data, setIsPreviewConnected),
    "youtube-connection": (data: any) =>
      handleYoutubeConnection(data, setIsYoutubeConnected),
  });
};
