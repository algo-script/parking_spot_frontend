import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import AuthModal from 'pages/AuthModal';
import { Mycontext } from '../../context/context';


const Header = ({
  variant = 'default',
  userLoggedIn = false,
  userName = 'User',
  userAvatar ,
  onSearch,
  className = '',
}) => {
  const { token,setToken } = useContext(Mycontext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('signin');
  const location = useLocation();
  const navigate = useNavigate();
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isUserMenuOpen]);
  
  // Fallback avatar component
  const renderAvatar = (size = 8) => {
    if (userAvatar) {
      return (
        <img
          src={`${import.meta.env.VITE_APP_BASE_URL}/${userAvatar}`}
          alt={userName}
          className={`w-${size} h-${size} rounded-full`}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
      );
    }
    return (
      <div 
        className={`w-${size} h-${size} rounded-full bg-gray-200 flex items-center justify-center`}
        style={{ display: userAvatar ? 'none' : 'flex' }}
      >
        <Icon name="User" size={size === 8 ? 16 : 20} className="text-gray-500" />
      </div>
    );
  };

  

  const handleLogout = () => {
    setToken(null);
  };

  const navigateToProfile = () =>{  
    navigate("/user-profile/profile")
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Close menus when location changes
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  // const handleSearchSubmit = (e) => {
  //   e.preventDefault();
  //   if (onSearch) onSearch(searchQuery);
  // };

  // const handleSearchChange = (e) => {
  //   setSearchQuery(e.target.value);
  // };

  const openSignInModal = () => {
    setAuthModalTab('signin');
    setAuthModalOpen(true);
  };

  const openSignUpModal = () => {
    setAuthModalTab('signup');
    setAuthModalOpen(true);
  };

  const isTransparent = variant === 'transparent';
  const isCompact = variant === 'compact';

  const baseClasses = `w-full z-50 ${isCompact ? 'py-2' : 'py-4'}`;
  const variantClasses = isTransparent
    ? 'bg-transparent text-white' : 'bg-white shadow-md text-gray-900';
  // Base nav items that are always visible
  const baseNavItems = [
    { name: 'Find Parking', path: '/', icon: 'Search' }
  ];

  // Nav items that require authentication
  const authNavItems = [
    { name: 'My Spots', path: '/my-parking-spots', icon: 'ParkingCircle' },
    { name: 'Add Spot', path: '/add-parking-spot', icon: 'Plus' },
  ];

  // Combine nav items based on authentication status
  const navItems = token ? [...baseNavItems, ...authNavItems] : baseNavItems;
  // const navItems = [
  //   { name: 'Find Parking', path: '/', icon: 'Search' },
  //   { name: 'My Spots', path: '/my-parking-spots', icon: 'ParkingCircle' },
  //   { name: 'Add Spot', path: '/add-parking-spot', icon: 'Plus' },
  // ];

  const userMenuItems = [
    { name: 'Profile', icon: 'User', action:navigateToProfile },
    { name: 'My Bookings', icon: 'Calendar', action: () => { } },
    { name: 'Settings', icon: 'Settings', action: () => { }},
    { name: 'Logout', icon: 'LogOut', action: handleLogout },
  ];

  const renderLogo = () => (
    <Link to="/" className="flex items-center">
      <div className={`font-display font-bold text-2xl ${isTransparent ? 'text-white' : 'text-primary'}`}>
        ParkEase
      </div>
    </Link>
  );

  // const renderSearch = () => (
  //   <form onSubmit={handleSearchSubmit} className={`${isCompact ? 'max-w-md' : 'max-w-xl'} w-full mx-auto`}>
  //     <Input
  //       type="search"
  //       placeholder="Find parking near you..."
  //       value={searchQuery}
  //       onChange={handleSearchChange}
  //       icon="MapPin"
  //       className={`${isTransparent ? 'bg-white bg-opacity-20 backdrop-blur-md border-white border-opacity-30 text-white placeholder-white placeholder-opacity-80' : ''}`}
  //     />
  //   </form>
  // );

  const renderDesktopNav = () => (
    <div className="hidden md:flex items-center space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={`flex items-center text-sm font-medium hover:text-primary ${location.pathname === item.path
              ? isTransparent ? 'text-white font-semibold' : 'text-primary' : isTransparent ? 'text-white text-opacity-90' : 'text-gray-700'
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
      ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      md:hidden
    `}>
      <div className="bg-white h-full w-4/5 max-w-sm shadow-xl flex flex-col"  ref={mobileMenuRef}>
        <div className="flex items-center justify-between p-4 border-b">
          {renderLogo()}
          <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-700">
            <Icon name="X" size={24} />
          </button>
        </div>
        {/* <div className="p-4"> */}
          {/* {renderSearch()} */}
        {/* </div> */}
        <nav className="flex-1 px-4 pb-4">
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center py-2 text-base font-medium ${location.pathname === item.path ? 'text-primary' : 'text-gray-700'
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
            <div className="flex items-center">
            {renderAvatar(10)}
              {/* <img
                src={userAvatar}
                alt={userName}
                className="w-10 h-10 rounded-full mr-3"
                // onError={(e) => {
                //   e.target.src = "/assets/images/no_image.png"
                // }}
              /> */}
              <div>
                <p className="font-medium text-gray-900">{userName}</p>
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
        {/* <img
          src={userAvatar}
          alt={userName}
          className="w-8 h-8 rounded-full"
          // onError={(e) => {
          //   e.target.src = "/assets/images/no_image.png"
          // }}
        /> */}
        <span className={`ml-2 ${isTransparent ? 'text-white' : 'text-gray-700'} hidden sm:block`}>
          {userName}
        </span>
        <Icon
          name={isUserMenuOpen ? "ChevronUp" : "ChevronDown"}
          size={16}
          className={`ml-1 ${isTransparent ? 'text-white' : 'text-gray-500'}`}
        />
      </button>

      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          {userMenuItems.map((item) => (
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
      <header className={`${baseClasses} ${variantClasses} ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                className="mr-4 md:hidden text-gray-500 focus:outline-none"
                onClick={toggleMenu}
                aria-label="Open menu"
              >
                <Icon name="Menu" size={24} className={isTransparent ? 'text-white' : 'text-gray-700'} />
              </button>
              {renderLogo()}
            </div>

            {/* {!isCompact && !isMobile && (
              <div className="hidden md:block mx-4 flex-1">
                {renderSearch()}
              </div>
            )} */}

            <div className="flex items-center space-x-4">
              {!isMobile && renderDesktopNav()}

              {userLoggedIn ? (
                renderUserMenu()
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant={isTransparent ? "outline" : "secondary"}
                    size="sm"
                    className={isTransparent ? "border-white text-white hover:bg-white hover:bg-opacity-10" : ""}
                    onClick={openSignInModal}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant={isTransparent ? "primary" : "primary"}
                    size="sm"
                    onClick={openSignUpModal}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* {isCompact && (
            <div className="mt-2">
              {renderSearch()}
            </div>
          )} */}
        </div>

        {renderMobileMenu()}
      </header>
      {authModalOpen && <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />}
    </>
  );
};

export default Header;