import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "./components/navBar/navBar";
import LandingPage from "./components/LandingPage";
import Svijece from "./pages/svijece/Svijece";
import MirisneSvijece from "./pages/mirisneSvijece/MirisneSvijece";
import MirisniVoskovi from "./pages/mirisniVoskovi/MirisniVoskovi";
import Dekoracija from "./pages/dekoracija/Dekoracija";
import AdminPanel from "./adminPanel/AdminPanel";
import AdminLogin from "./adminPanel/AdminLogin";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {location.pathname !== '/admin-panel' &&
       location.pathname !== '/admin-login' && <NavBar />}
      
      <Routes>
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        
        <Route path="/" element={<LandingPage />} />
        <Route path="/svijece" element={<Svijece />} />
        <Route path="/mirisne-svijece" element={<MirisneSvijece />} />
        <Route path="/mirisni-voskovi" element={<MirisniVoskovi />} />
        <Route path="/dekoracije" element={<Dekoracija />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;