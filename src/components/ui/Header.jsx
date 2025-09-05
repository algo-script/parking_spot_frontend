import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "../AppIcon";
import Button from "./Button";
import { Mycontext } from "../../context/context";
import AuthModal from "pages/AuthModal";
import { ModelContext } from "context/modelcontext";


const Header = ({ userLoggedIn }) => {
  const { token, setToken, userRole ,user} = useContext(Mycontext);
  const {authModalOpen,authModalTab,openSignUpModal,openSignInModal,setAuthModalOpen} = useContext(ModelContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const navigate = useNavigate();
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
      if (
        isUserMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isUserMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

 
  // Fallback avatar component
  const renderAvatar = (size = 8) => {
    if (user?.profileImage) {
      return (
        <img
          src={`${import.meta.env.VITE_APP_BASE_URL}/${user?.profileImage}`}
          alt={user?.name}
          className={`w-${size} h-${size} rounded-full`}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "block";
          }}
        />
      );
    }
    return (
      <div
        className={`w-${size} h-${size} rounded-full bg-gray-200 flex items-center justify-center`}
        style={{ display: user?.profileImage ? "none" : "flex" }}
      >
        <Icon
          name="User"
          size={size === 8 ? 16 : 20}
          className="text-gray-500"
        />
      </div>
    );
  };

 

  const handleLogout = () => {
    setToken(null);
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };
  // console.log("userklk",user);

  const navigateToProfile = () => {
    navigate("/user-profile/profile");
  };

  const navigateToBooking = () => {
    navigate("/my-booking");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  // Base nav items that are always visible
  const baseNavItems = [{ name: "Find Parking", path: "/", icon: "Search" }];

  // Nav items that require authentication
  const authNavItems = [
    { name: "My Spots", path: "/my-parking-spots", icon: "ParkingCircle" },
    { name: "Add Spot", path: "/add-parking-spot", icon: "Plus" },
  ];

  const navItems = token ? [...baseNavItems, ...authNavItems] : baseNavItems;
  // Nav items for guards
  const guardNavItems = [
    { name: "Spot Details", path: "/", icon: "Shield" },
    { name: "Spot Bookings", path: "/booking-details", icon: "Calendar" },
    { name: "QR Scanner", path: "/qr-scanner", icon: "QrCode" },
  ];

  const adminNavItems = [
    { name: "Users", path: "/users", icon: "People" },
    // { name: 'Parking Spots', path: '/parking-spots', icon: 'ParkingCircle' },
    // { name: 'Bookings', path: '/bookings', icon: 'Calendar' },
    // { name: 'Vehicles', path: '/vehicles', icon: 'DirectionsCar' },
    // { name: 'Guards', path: '/guards', icon: 'Shield' },
  ];

  // Determine which nav items to show based on role
  let roleNavItems = [];
  if (userRole === "Admin") {
    roleNavItems = adminNavItems;
  } else if (userRole === "User") {
    roleNavItems = navItems;
  } else if (userRole === "Guard") {
    roleNavItems = guardNavItems;
  }

  const userMenuItems = [
    { name: 'Profile', icon: 'User', action:navigateToProfile },
    { name: 'My Bookings', icon: 'Calendar', action: navigateToBooking},
    { name: 'Settings', icon: 'Settings', action: () => { }},
    { name: 'Logout', icon: 'LogOut', action: handleLogout },
  ];

  const guardMenuItems = [
    { name: 'Profile', icon: 'User', action: navigateToProfile },
    { name: 'Logout', icon: 'LogOut', action: handleLogout },
  ];

  const adminMenuItems = [
    { name: 'Profile', icon: 'User', action:navigateToProfile },
    { name: 'Settings', icon: 'Settings', action: () => { }},
    { name: 'Logout', icon: 'LogOut', action: handleLogout },
  ];

  let menuItems = [];

  if (userRole === "Guard") {
    menuItems = guardMenuItems;
  } else if (userRole === "Admin") {
    menuItems = adminMenuItems;
  } else {
    menuItems = userMenuItems; // Default for normal users
  }

  const renderLogo = () => (
    <Link to="/" className="flex items-center">
      <div className={`font-display font-bold text-2xl text-primary`}>
        ParkEase
      </div>
    </Link>
  );

  const renderDesktopNav = () => (
    <div className="hidden md:flex items-center space-x-6">
      {roleNavItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={`flex items-center text-sm font-medium hover:text-primary ${
            location.pathname === item.path ? "text-primary" : "text-gray-700"
          }`}
        >
          <Icon name={item.icon} size={16} className="mr-1" />
          {item.name}
        </Link>
      ))}
    </div>
  );

  const renderMobileMenu = () => (
    <div
      className={`
      fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out
      ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
      md:hidden
    `}
    >
      <div
        className="bg-white h-full w-4/5 max-w-sm shadow-xl flex flex-col"
        ref={mobileMenuRef}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {renderLogo()}
          <button
            onClick={toggleMenu}
            className="text-gray-500 hover:text-gray-700"
          >
            <Icon name="X" size={24} />
          </button>
        </div>
        <nav className="flex-1 px-4 pb-4">
          <ul className="space-y-4">
            {roleNavItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center py-2 text-base font-medium ${
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-gray-700"
                  }`}
                  onClick={toggleMenu}
                >
                  <Icon name={item.icon} size={20} className="mr-3" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {userLoggedIn && (
          <div className="p-4 border-t">
            <div className="flex items-center gap-5">
              {renderAvatar(10)}
              <div onClick={navigateToProfile}>
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-800">View profile</p>
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                icon="LogOut"
                fullWidth
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
      <div
        className="bg-gray-900 bg-opacity-50 h-full w-1/5"
        onClick={toggleMenu}
      />
    </div>
  );

  const renderUserMenu = () => (
    <div className="relative" ref={userMenuRef}>
      <button
        onClick={toggleUserMenu}
        className="flex items-center focus:outline-none"
        aria-expanded={isUserMenuOpen}
        aria-haspopup="true"
      >
        {renderAvatar()}
        <span className={`ml-2  text-gray-700 hidden sm:block`}>
          {user?.name}
        </span>
        <Icon
          name={isUserMenuOpen ? "ChevronUp" : "ChevronDown"}
          size={16}
          className={`ml-1 'text-gray-500'`}
        />
      </button>
      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={item.action}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Icon name={item.icon} size={16} className="mr-2 text-gray-500" />
                {item.name}
              </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <header className="w-full z-50 py-4 bg-gray-50 text-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                className="mr-4 md:hidden text-gray-500 focus:outline-none"
                onClick={toggleMenu}
                aria-label="Open menu"
              >
                <Icon name="Menu" size={24} className="text-gray-700" />
              </button>
              {renderLogo()}
            </div>

            <div className="flex items-center space-x-4">
              {!isMobile && renderDesktopNav()}

              {userLoggedIn ? (
                renderUserMenu()
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant={"secondary"}
                    size="sm"
                    onClick={openSignInModal}
                  >
                    Sign In
                  </Button>
                  <Button variant="primary" size="sm" onClick={openSignUpModal}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {renderMobileMenu()}
      </header>
      {authModalOpen && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialTab={authModalTab}
        />
      )}
    </>
  );
};

export default Header;

// {isUserMenuOpen && (
//   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
//     {menuItems.map((item) => (
//       <button
//         key={item.name}
//         onClick={item.action}
//         className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//       >
//         <Icon name={item.icon} size={16} className="mr-2 text-gray-500" />
//         {item.name}
//       </button>
//     ))}
//   </div>
// )}
