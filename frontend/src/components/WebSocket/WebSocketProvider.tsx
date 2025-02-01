import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useConfig } from "../Config/ConfigProvider";

interface MessageHandlers {
  [key: string]: (data: any) => void;
}

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  updateHandlers: (handlers: MessageHandlers) => void;
  sendMessage: (message: object) => void;
}

interface WebSocketProviderProps {
  children: React.ReactNode;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const config = useConfig();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const handlersRef = useRef<MessageHandlers>({});

  useEffect(() => {
    if (!config?.port) return;

    const port = config.port.port;
    const ws = new WebSocket(`ws://localhost:${port}/ws`);
    setSocket(ws);

    ws.onopen = () => {
      console.log(`Connected to WebSocket server at ws://localhost:${port}/ws`);
      setIsConnected(true);
    };

    ws.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      if (handlersRef.current[message.eventType]) {
        handlersRef.current[message.eventType](message);
      } else {
        console.warn(`No handler for message type: ${message.eventType}`);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket is closing");
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
      setSocket(null);
    };
  }, [config?.port]);

  const updateHandlers = (handlers: MessageHandlers) => {
    handlersRef.current = handlers;
  };

  const sendMessage = (message: object) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not open. Cannot send message.");
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ socket, isConnected, updateHandlers, sendMessage }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider"
    );
  }
  return context;
};
