import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "./components/navBar/navBar";
import LandingPage from "./components/LandingPage";
import Svijece from "./pages/svijece/Svijece";
import MirisneSvijece from "./pages/mirisneSvijece/MirisneSvijece";
import MirisniVoskovi from "./pages/mirisniVoskovi/MirisniVoskovi";

function App() {
  useEffect(() => {
    // Scroll to top na refresh
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, [])
  return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/svijece" element={<Svijece />} />
          <Route path="/mirisne-svijece" element={<MirisneSvijece />} />
          <Route path="/mirisni-voskovi" element={<MirisniVoskovi />} />
          <Route path="/dekoracije" element={<div>Dekoracije</div>} />
          <Route path="*" element={<Navigate to= "/" />} /> // Redirect to the landing page in case of unknown route
        </Routes>
      </div>
  );
}

export default App;