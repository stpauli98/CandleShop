import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "./components/navBar/navBar";
import LandingPage from "./components/landingPage/LandingPage";
import Candles from "./pages/Candles/Candles";
import ScentedCandles from "./pages/scentedCandles/ScentedCandles";
import ScentedWaxes from "./pages/scentedWaxes/ScentedWaxes";
import Decoration from "./pages/decoration/Decoration";
import AdminPanel from "./components/adminPanel/AdminPanel";
import AdminLogin from "./components/adminPanel/AdminLogin";
import PrivacyPolicy from "./components/PrivacyPolicy";
import PaymentInput from "./components/payment/PaymentInput";
import {OrderConfirmation} from "./components/payment/OrderConfirmation";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {location.pathname !== '/admin-panel' &&
       location.pathname !== '/admin-login' &&
       location.pathname !== '/placanje' && <NavBar />}
      
      <Routes>
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        
        <Route path="/" element={<LandingPage />} />
        <Route path="/svijece" element={<Candles />} />
        <Route path="/mirisne-svijece" element={<ScentedCandles />} />
        <Route path="/mirisni-voskovi" element={<ScentedWaxes />} />
        <Route path="/dekoracija" element={<Decoration />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route path="/placanje" element={<PaymentInput />} />
        <Route 
          path="/order-confirmation" 
          element={
            <OrderConfirmation 
              order={location.state?.order || {}}
            />
          } 
        />  
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;