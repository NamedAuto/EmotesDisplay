import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useConfig } from "../Config/Config";

interface MessageHandlers {
  [key: string]: (data: any) => void;
}

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  updateHandlers: (handlers: MessageHandlers) => void;
}

// Update the provider type to accept children
interface WebSocketProviderProps {
  children: React.ReactNode;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const config = useConfig(); // Get config (e.g., port)
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Store message handlers in a ref to avoid re-rendering
  const handlersRef = useRef<MessageHandlers>({});

  useEffect(() => {
    if (!config?.Port) return; // Early return if config is not available
    console.log("CURRENT PORT: " + config.Port);

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
      ws.close(); // Clean up the socket when the component unmounts
      setSocket(null);
    };
  }, [config?.Port]); // Reconnect if port changes

  // Update the message handlers dynamically
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
