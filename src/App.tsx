import { Routes, Route } from "react-router-dom";
import NavBar from "./components/navBar/navBar";
import LandingPage from "./components/LandingPage";
import Svijece from "./pages/svijece/Svijece";
import MirisneSvijece from "./pages/mirisneSvijece/MirisneSvijece";
import MirisniVoskovi from "./pages/mirisniVoskovi/MirisniVoskovi";

function App() {
  return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/svijece" element={<Svijece />} />
          <Route path="/mirisne-svijece" element={<MirisneSvijece />} />
          <Route path="/mirisni-voskovi" element={<MirisniVoskovi />} />
          <Route path="/dekoracije" element={<div>Dekoracije</div>} />
        </Routes>
      </div>
  );
}

export default App;