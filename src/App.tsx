import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from "./components/ErrorBoundary";
import NavBar from "./components/navBar/navBar";
import LandingPage from "./components/landingPage/LandingPage";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import PaymentInput from "./components/payment/PaymentInput";
import OrderConfirmation from "./components/payment/OrderConfirmation";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/adminPanel/ProtectedRoute";

// Lazy load Admin components for better performance
const AdminPanel = lazy(() => import("./components/adminPanel/AdminPanel"));
const AdminLogin = lazy(() => import("./components/adminPanel/AdminLogin"));

// Loading component for lazy loaded routes
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
  </div>
);

function App() {
  const location = useLocation();

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  return (
    <HelmetProvider>
      <AuthProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-gray-50">
            <Toaster position="top-center" />
            {location.pathname !== '/admin-panel' &&
             location.pathname !== '/admin-login' &&
             location.pathname !== '/placanje' &&
             !location.pathname.startsWith('/order-confirmation')
              && <NavBar />}

            <Routes>
              {/* Admin Login - javno dostupna */}
              <Route path="/admin-login" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminLogin />
                </Suspense>
              } />

              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/admin-panel" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <AdminPanel />
                  </Suspense>
                } />
              </Route>

              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/placanje" element={<PaymentInput />} />
              <Route
                path="/order-confirmation/:orderId"
                element={<OrderConfirmation />}
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </ErrorBoundary>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
