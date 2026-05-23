import {
  Navbar as FlowbiteNavbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";

export function Navbar({ setShowAuthModal }) {
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
        <button
          onClick={() => setShowAuthModal(true)}
          className="
    text-white
    hover:text-purple-400
    cursor-pointer
  "
        >
          Log In
        </button>
      </NavbarCollapse>
    </FlowbiteNavbar>
  );
}
