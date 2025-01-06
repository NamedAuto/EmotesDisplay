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
    if (!config?.Port) return;

    const ws = new WebSocket(`ws://localhost:${config.Port}/ws`);
    setSocket(ws);

    ws.onopen = () => {
      console.log(
        `Connected to WebSocket server at ws://localhost:${config.Port}/ws`
      );
      setIsConnected(true);
    };

    ws.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      if (handlersRef.current[message.type]) {
        handlersRef.current[message.type](message.data);
      } else {
        console.warn(`No handler for message type: ${message.type}`);
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
  }, [config?.Port]);

  const updateHandlers = (handlers: MessageHandlers) => {
    handlersRef.current = handlers;
  };

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, updateHandlers }}>
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
