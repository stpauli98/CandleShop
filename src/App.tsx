import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/navBar/navBar";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/svijece" element={<div>Svijeće</div>} />
          <Route path="/mirisne-svijece" element={<div>Mirisne svijeće</div>} />
          <Route path="/mirisni-voskovi" element={<div>Mirisni voskovi</div>} />
          <Route path="/dekoracije" element={<div>Dekoracije</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;