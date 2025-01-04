import { useEffect, useRef, useState } from "react";
import { getConfig } from "../config/configureConfigFront";

interface MessageHandlers {
  [key: string]: (data: any) => void;
}

export const useWebSocket = (
  shouldConnect: boolean,
  messageHandlers: MessageHandlers
) => {
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (shouldConnect) {
      // Establish WebSocket connection
      socket.current = new WebSocket(`ws://localhost:${getConfig().Port}/ws`);
      // socket.current = new WebSocket(`ws://localhost:3124/ws`);

      // Set up WebSocket open event
      socket.current.onopen = () => {
        console.log(`Connected to WebSocket server`);
      };

      // Set up message event handler
      socket.current.onmessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data);
        if (messageHandlers[message.type]) {
          messageHandlers[message.type](message.data);
        } else {
          console.warn(`No handler for message type: ${message.type}`);
        }
      };

      socket.current.onclose = () => {
        console.log("Socket is closing");
      };

      socket.current.onerror = (error) => {
        console.error("Socket error ", error);
      };

      return () => {
        socket.current?.close();
      };
    }
  }, [shouldConnect]);

  return { socket: socket.current };
};
