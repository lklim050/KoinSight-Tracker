import { useState } from "react";
import "./App.css";
import PortfolioPage from "./pages/PortfolioPage";
import { Navbar } from "./components/Navbar.jsx";
import AuthModal from "./pages/AuthModal.jsx";

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Initialize user state from localStorage to persist login across page refreshes
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Update localStorage whenever user state changes
  const handleLogin = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  // Handle logout by clearing user state and removing data from localStorage
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <>
      <Navbar
        setShowAuthModal={setShowAuthModal}
        user={user}
        onLogout={handleLogout}
      />
      <PortfolioPage user={user} />
      <AuthModal
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        onLogin={handleLogin}
      />
    </>
  );
}

export default App;
