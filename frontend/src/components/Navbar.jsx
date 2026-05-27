import {
  Navbar as FlowbiteNavbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";

//user and onLogout props will be used to conditionally render login/logout buttons and handle logout functionality
export function Navbar({ setShowAuthModal, user, onLogout }) {
  return (
    <FlowbiteNavbar fluid rounded className="fixed top-0 w-full z-50">
      <NavbarBrand href="https://flowbite-react.com">
        <img
          src="/favicon.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite React Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Portfolio Tracker
        </span>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
        <NavbarLink href="#" active>
          Home
        </NavbarLink>
        <NavbarLink href="#">Marketplace</NavbarLink>
        <NavbarLink href="#">Watchlist</NavbarLink>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-white">{user.username}</span>
            <button
              onClick={onLogout}
              className="text-white hover:text-purple-400 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="text-white hover:text-purple-400 cursor-pointer"
          >
            Log In
          </button>
        )}
      </NavbarCollapse>
    </FlowbiteNavbar>
  );
}
