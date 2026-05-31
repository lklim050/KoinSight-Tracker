import {
  Navbar as FlowbiteNavbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
} from "flowbite-react";

//user and onLogout props will be used to conditionally render login/logout buttons and handle logout functionality
export function Navbar({ setShowAuthModal, user, onLogout }) {
  return (
    <FlowbiteNavbar
      fluid
      rounded
      className="fixed top-0 w-full z-50 !bg-white/5 backdrop-blur-2xl !border-b !border-white/10 !shadow-none !rounded-none"
    >
      <NavbarBrand href="#">
        <img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-gray-400">
          KoinSight Tracker
        </span>
      </NavbarBrand>

      <div className="flex items-center gap-6 md:order-2">
        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="#"
            className="text-sm font-medium text-gray-900 dark:text-white"
          >
            Home
          </a>
          <a
            href="https://koinsight.netlify.app/"
            target="_blank"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-white"
          >
            Marketplace
          </a>
          <a
            href="https://koinsight.netlify.app/watchlist"
            target="_blank"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-white"
          >
            Watchlist
          </a>
        </div>

        {/* Avatar or Login */}
        {user ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                placeholderInitials={user.username.charAt(0).toUpperCase()}
                rounded
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm font-semibold">
                {user.username}
              </span>
              <span className="block truncate text-sm">{user.email}</span>
            </DropdownHeader>
            <DropdownDivider />
            <DropdownItem onClick={onLogout}>Sign out</DropdownItem>
          </Dropdown>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-purple-600 px-3 py-2 rounded-lg text-white hover:bg-purple-700 cursor-pointer"
          >
            Log In
          </button>
        )}
        <NavbarToggle />
      </div>

      {/* Mobile only */}
      <NavbarCollapse className="md:hidden">
        <NavbarLink href="#" active>
          Home
        </NavbarLink>
        <NavbarLink href="https://koinsight.netlify.app/" target="_blank">
          Marketplace
        </NavbarLink>
        <NavbarLink
          href="https://koinsight.netlify.app/watchlist"
          target="_blank"
        >
          Watchlist
        </NavbarLink>
      </NavbarCollapse>
    </FlowbiteNavbar>
  );
}
