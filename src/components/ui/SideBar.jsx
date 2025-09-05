import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const SideBar = ({
  variant = 'expanded',
  userLoggedIn = true,
  userName = 'John Doe',
  userAvatar = '/assets/images/avatar.png',
  onToggle,
  className = '',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(variant === 'collapsed');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onToggle) onToggle(newState);
  };

  const toggleMobileDrawer = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const mainNavItems = [
    { name: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
    { name: 'Find Parking', path: '/', icon: 'Search' },
    { name: 'My Parking Spots', path: '/my-parking-spots', icon: 'ParkingCircle' },
    { name: 'Add Parking Spot', path: '/add-parking-spot', icon: 'Plus' },
    { name: 'Bookings', path: '/bookings', icon: 'Calendar' },
  ];

  const secondaryNavItems = [
    { name: 'Settings', path: '/settings', icon: 'Settings' },
    { name: 'Help & Support', path: '/support', icon: 'HelpCircle' },
  ];

  const isActive = (path) => location.pathname === path;

  const renderNavItem = (item) => (
    <Link
      key={item.name}
      to={item.path}
      className={`flex items-center px-3 py-2 rounded-md transition-colors ${
        isActive(item.path)
          ? 'bg-primary text-white' :'text-gray-700 hover:bg-gray-100'
      } ${isCollapsed ? 'justify-center' : ''}`}
      aria-current={isActive(item.path) ? 'page' : undefined}
    >
      <Icon 
        name={item.icon} 
        size={20} 
        className={isActive(item.path) ? 'text-white' : 'text-gray-500'} 
      />
      {!isCollapsed && <span className="ml-3">{item.name}</span>}
    </Link>
  );

  const renderUserSection = () => (
    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-3'} py-4`}>
      {userLoggedIn ? (
        <>
          <img
            src={userAvatar}
            alt={userName}
            className="w-8 h-8 rounded-full"
          />
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">View profile</p>
            </div>
          )}
        </>
      ) : (
        <>
          {isCollapsed ? (
            <Button variant="primary" icon="LogIn" />
          ) : (
            <Button variant="primary" fullWidth>Sign In</Button>
          )}
        </>
      )}
    </div>
  );

  const renderSidebarContent = () => (
    <>
      <div className="flex items-center justify-between h-16 px-4">
        {!isCollapsed && (
          <Link to="/" className="flex items-center">
            <div className="font-display font-bold text-xl text-primary">
              ParkEase
            </div>
          </Link>
        )}
        <button
          onClick={toggleCollapse}
          className={`p-1 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none ${
            isCollapsed ? 'mx-auto' : ''
          }`}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icon name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="px-2 py-4 space-y-1">
          {mainNavItems.map(renderNavItem)}
        </nav>

        <div className={`px-3 ${isCollapsed ? 'text-center' : ''}`}>
          <div className="border-t border-gray-200 pt-4 pb-3">
            {!isCollapsed && <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Support</p>}
            <nav className="space-y-1">
              {secondaryNavItems.map(renderNavItem)}
            </nav>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        {renderUserSection()}
      </div>
    </>
  );

  // Mobile drawer
  const renderMobileDrawer = () => (
    <div className={`
      fixed inset-0 z-50 md:hidden transform transition-transform duration-300 ease-in-out
      ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="relative flex flex-col w-72 h-full bg-white shadow-xl">
        <button
          onClick={toggleMobileDrawer}
          className="absolute top-4 right-4 p-1 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
          aria-label="Close menu"
        >
          <Icon name="X" size={20} />
        </button>
        
        {renderSidebarContent()}
      </div>
      
      <div 
        className="bg-gray-900 bg-opacity-50 h-full flex-1"
        onClick={toggleMobileDrawer}
      />
    </div>
  );

  // Mobile toggle button
  const renderMobileToggle = () => (
    <div className="fixed bottom-4 left-4 md:hidden z-40">
      <button
        onClick={toggleMobileDrawer}
        className="p-3 rounded-full bg-primary text-white shadow-lg focus:outline-none"
        aria-label="Open menu"
      >
        <Icon name="Menu" size={24} />
      </button>
    </div>
  );

  return (
    <>
      <aside
        className={`
          hidden md:flex flex-col h-screen bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${className}
        `}
      >
        {renderSidebarContent()}
      </aside>
      
      {renderMobileToggle()}
      {renderMobileDrawer()}
    </>
  );
};

export default SideBar;