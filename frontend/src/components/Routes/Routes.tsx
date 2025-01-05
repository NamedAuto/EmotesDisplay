import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import CanvasTest from "../Canvas/CanvasTest";
import NotFound from "../NotFound/NotFound";
import Settings from "../Settings/Settings";

export default class MyRoutes extends React.Component {
  render() {
    return (
      <BrowserRouter>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<CanvasTest />} />
          {/* <Route path="/test" element={<CanvasComponent />} /> */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    );
  }
}
