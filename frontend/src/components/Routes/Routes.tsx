import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import NotFound from "../NotFound/NotFound";
import Navbar from "../Navbar/Navbar";
import CanvasComponent from "../Canvas/CanvasComponent";

export default class MyRoutes extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<CanvasComponent />} />
          <Route path="/test" element={<CanvasComponent />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    );
  }
}
