import { useState } from "react";

function NavBar({ onLogout, menuLinks, userData }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoutClick = () => {
    onLogout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile Menu Icon */}
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-blue-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              <svg
                className="hidden h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            {/* Logo */}
            <div className="flex flex-shrink-0 items-center">
              <img
                className="h-20 pt-1 pb-1 w-auto"
                src="/images/logo.png"
                alt="Your Company"
              />
            </div>
            <div className="flex flex-shrink-0 items-center">
              <img
                className="h-20 pt-2 pb-2 w-auto"
                src="/images/name.png"
                alt="Your Company"
              />
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Nav Menu (Desktop) */}
            <div className="hidden sm:m-6 sm:block">
              <div className="flex space-x-4">
                {menuLinks.map((link) => (
                  <a
                    key={link.to}
                    href={link.to}
                    className="text-gray-700 group hover:bg-blue-900 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out hover:shadow-md"
                    aria-current="page"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            {/* Profile Icon and Menu */}
            <div className="relative ml-3 group">
              <div>
                {/* Profile Icon */}
                <button
                  type="button"
                  className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 ease-in-out hover:shadow-md"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">Open user menu</span>
                  {userData.profileImage ? (
                    <img
                      src={userData.profileImage} // Use the base64 data directly
                      alt="Profile"
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <img
                      src="/images/user.png"
                      alt="Default Profile"
                      className="h-12 w-12 rounded-full"
                    />
                  )}
                </button>
              </div>
              <div
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabIndex="-1"
              >
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-black hover:bg-blue-900 hover:text-white"
                  role="menuitem"
                  tabIndex="-1"
                  id="user-menu-item-0"
                >
                  Your Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-black hover:bg-blue-900 hover:text-white"
                  role="menuitem"
                  tabIndex="-1"
                  id="user-menu-item-2"
                  onClick={handleLogoutClick}
                >
                  Sign out
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2 bg-gray-100 hover:shadow-md">
            {menuLinks.map((link) => (
              <a
                key={link.to}
                href={link.to}
                className="text-gray-700 group hover:bg-blue-900 hover:text-white rounded-md block px-3 py-2 text-base text-sm font-medium transition-all duration-200 ease-in-out"
                aria-current="page"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;
