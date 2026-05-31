import { useState, useEffect } from "react";
import "./App.css";
import PortfolioPage from "./pages/PortfolioPage";
import { Navbar } from "./components/Navbar.jsx";
import AuthModal from "./components/AuthModal.jsx";
import MagicRings from "./components/ui/MagicRings.jsx";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { Routes, Route, Navigate } from "react-router-dom";
import AssetDetailPage from "./pages/AssetDetailPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Initialize user state from localStorage to persist login across page refreshes
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true });
    return () => lenis.destroy();
  }, []);

  // Update localStorage whenever user state changes
  const handleLogin = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
    window.location.href = "/portfolio"; // Redirect to portfolio page after login
  };

  // Handle logout by clearing user state and removing data from localStorage
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      <Navbar
        setShowAuthModal={setShowAuthModal}
        user={user}
        onLogout={handleLogout}
      />
      {/* Animated background effect from Reactbits*/}
      <div className="fixed inset-0 -z-10 bg-slate-950 pointer-events-none">
        <MagicRings
          color="#66DE7D"
          colorTwo="#70f38a"
          ringCount={8}
          opacity={0.2}
          followMouse={false}
          clickBurst={false}
        />
      </div>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/portfolio" replace />
            ) : (
              <LandingPage setShowAuthModal={setShowAuthModal} />
            )
          }
        />
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute user={user}>
              <PortfolioPage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asset/:assetId"
          element={
            <ProtectedRoute user={user}>
              <AssetDetailPage user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>

      <AuthModal
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        onLogin={handleLogin}
      />
    </>
  );
}

export default App;
