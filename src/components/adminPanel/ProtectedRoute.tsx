import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    // Still checking auth state
    return <div>Učitavanje...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin-login" />;
};

export default ProtectedRoute;
