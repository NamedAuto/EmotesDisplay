import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App";
import { ConfigProvider } from "./components/Config/Config";
import { WebSocketProvider } from "./components/WebSocket/WebsocketProvider";

const container = document.getElementById("root");

const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <ConfigProvider>
      <WebSocketProvider>
        <App />
      </WebSocketProvider>
    </ConfigProvider>
  </React.StrictMode>
);
