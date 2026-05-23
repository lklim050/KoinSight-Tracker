import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import PortfolioPage from "./pages/PortfolioPage";
import { Navbar } from "./components/Navbar.jsx";
import AuthModal from "./pages/AuthModal.jsx";

function App() {
  const [count, setCount] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <Navbar setShowAuthModal={setShowAuthModal} />
      <PortfolioPage />
      <AuthModal
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
      />
    </>
  );
}

export default App;
