import { WebSocketContextType } from "../WebSocket/websocketTypes";

const handleDefaultConnection = (
  something: string,
  setIsDefaultConnected: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (something == "connected") {
    setIsDefaultConnected(true);
  } else {
    setIsDefaultConnected(false);
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
  setIsDefaultConnected: React.Dispatch<React.SetStateAction<boolean>>,
  setIsYoutubeConnected: React.Dispatch<React.SetStateAction<boolean>>
) => {
  updateHandlers({
    "default-connection": (data: any) =>
      handleDefaultConnection(data, setIsDefaultConnected),
    "youtube-connection": (data: any) =>
      handleYoutubeConnection(data, setIsYoutubeConnected),
  });
};
