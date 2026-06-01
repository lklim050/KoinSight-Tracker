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
import { LogOut } from "lucide-react";

//user and onLogout props will be used to conditionally render login/logout buttons and handle logout functionality
export function Navbar({ setShowAuthModal, user, onLogout }) {
  return (
    <FlowbiteNavbar
      fluid
      rounded
      className="fixed top-0 w-full z-50 !bg-white/5 backdrop-blur-2xl !border-b !border-white/10 !shadow-none !rounded-none"
    >
      <NavbarBrand href="#">
        <img
          src="/koinsight-logo.png"
          className="mr-3 h-6 sm:h-9"
          alt="KoinSight Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-gray-400 font-['Bruno_Ace_SC']">
          KoinSight
        </span>
      </NavbarBrand>

      <div className="flex items-center gap-6 md:order-2">
        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="#"
            className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
          >
            Home
          </a>
          <a
            href="https://koinsight.netlify.app/"
            target="_blank"
            className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
          >
            Marketplace
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
            theme={{
              floating: {
                base: "z-10 w-fit divide-y divide-white/10 overflow-hidden rounded-2xl shadow-lg !bg-[#1D1F2E] border border-white/20 focus:outline-none",
                style: {
                  auto: "",
                  dark: "",
                  light: "",
                },
                header: "block px-4 py-2 text-sm text-white",
                item: {
                  base: "flex w-full cursor-pointer items-center justify-start px-4 py-2 text-sm text-white/80 hover:!bg-white/20 focus:!bg-white/20 focus:outline-none",
                },
                divider: "my-1 h-px bg-white/10",
              },
            }}
          >
            <DropdownHeader>
              <span className="block text-sm font-semibold">
                {user.username}
              </span>
              <span className="block truncate text-sm">{user.email}</span>
            </DropdownHeader>
            <DropdownDivider />
            <DropdownItem onClick={onLogout}>
              <span className="flex items-center gap-2">
                <LogOut size={14} />
                Sign out
              </span>
            </DropdownItem>
          </Dropdown>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition cursor-pointer"
          >
            Login
          </button>
        )}
        <NavbarToggle />
      </div>

      {/* Mobile only */}
      <NavbarCollapse className="md:hidden">
        <NavbarLink
          href="#"
          active
          theme={{
            active: {
              on: "bg-white/10 text-white dark:text-white md:bg-transparent",
            },
          }}
        >
          Home
        </NavbarLink>
        <NavbarLink
          href="https://koinsight.netlify.app/"
          target="_blank"
          theme={{
            active: {
              off: "border-b border-white/10 text-white/60 hover:bg-white/10 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white",
            },
          }}
        >
          Marketplace
        </NavbarLink>
      </NavbarCollapse>
    </FlowbiteNavbar>
  );
}
