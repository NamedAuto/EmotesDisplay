import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import CanvasComponent from "../Canvas/CanvasComponent";
import NotFound from "../NotFound/NotFound";
import Settings from "../Settings/Settings";
import { WebSocketProvider } from "../WebSocket/WebSocketProvider";

const MyRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route
          path="/"
          element={
            <WebSocketProvider>
              <Settings />
            </WebSocketProvider>
          }
        />
        <Route
          path="/show"
          element={
            <WebSocketProvider>
              <CanvasComponent />
            </WebSocketProvider>
          }
        />

        {/* <Route path="/settings" element={<Settings />} /> */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MyRoutes;
