import React, { useState, useEffect, useContext } from "react";
import Icon from "../../components/AppIcon";
import { Link, useLocation } from "react-router-dom";
import ProfileTab from "./components/ProfileTab";
import PasswordTab from "./components/PasswordTab";
import VehiclesTabWrapper from "./components/VehiclesTabWrapper";
import NotificationsTab from "./components/NotificationsTab";
import PrivacyTab from "./components/PrivacyTab";
import ConnectionsTab from "./components/ConnectionsTab";
import BillingTab from "./components/BillingTab";
import { Mycontext } from "context/context";

const UserProfile = ({ user, fetchUserData }) => {
 
 
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop() || "profile"; 
  const {userRole} =useContext(Mycontext)


  // Map currentPath to the corresponding component
  const renderTabContent = () => {
    switch (currentPath) {
      case "profile":
        return (
          <ProfileTab
            // user={user}
            // fetchUserData={fetchUserData}
          />
        );
      case "password":
        return (
          <PasswordTab/>
        );
      case "vehicles":
        return <VehiclesTabWrapper user={user} />;
      case "notifications":
        return <NotificationsTab />;
      case "privacy":
        return <PrivacyTab />;
      case "connections":
        return <ConnectionsTab />;
      case "billing":
        return <BillingTab />;
      default:
        return <ProfileTab
          user={user}
          fetchUserData={fetchUserData}
        />;
    }
  };
  const navItems = [
    { path: "profile", icon: "User", label: "Profile Information",roles: ["Admin", "User", "Guard"] },
    { path: "password", icon: "Lock", label: "Change Password",roles: [ "User", "Guard"] },
    { path: "vehicles", icon: "Car", label: "Vehicle Details",roles: [ "User"] },
    // { path: "notifications", icon: "Bell", label: "Notifications" },
    // { path: "privacy", icon: "Shield", label: "Privacy Settings" },
    // { path: "connections", icon: "Link", label: "Connected Accounts" },
    // { path: "billing", icon: "CreditCard", label: "Billing & Payments" },
  ];

  const allowedNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
       <div className="flex flex-col sm:flex-row gap-6 max-w-6xl mx-auto">
      <div className="w-full bg-white sm:w-64 rounded-lg shadow-sm border border-gray-200 p-2 md:p-4 h-fit ">
        <div className="flex flex-row sm:flex-col gap-3 space-y-1 overflow-x-auto sm:overflow-visible">
          {allowedNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-center sm:justify-start p-2 sm:px-4 sm:py-3 rounded-md transition-colors duration-200 text-md ${
                currentPath === item.path
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
              title={item.label} // Tooltip for mobile
            >
              <Icon name={item.icon} size={18} className="sm:mr-2" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        {renderTabContent()}
      </div>
    </div>
    </div>
    </div>

  );
};

export default UserProfile;

// return (
  // <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto p-4">
  //   {/* Sidebar Navigation */}
  //   <div className="w-full md:w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit">
  //     <div className="flex flex-col space-y-1">
  //       <Link
  //         to="profile"
  //         className={`px-4 py-3 text-left rounded-md transition-colors duration-200 ${
  //           currentPath === "profile"
  //             ? "bg-primary text-white"
  //             : "hover:bg-gray-100"
  //         }`}
  //       >
  //         <div className="flex items-center">
  //           <Icon name="User" size={18} className="mr-2" />
  //           Profile Information
  //         </div>
  //       </Link>
  //       <Link
  //         to="password"
  //         className={`px-4 py-3 text-left rounded-md transition-colors duration-200 ${
  //           currentPath === "password"
  //             ? "bg-primary text-white"
  //             : "hover:bg-gray-100"
  //         }`}
  //       >
  //         <div className="flex items-center">
  //           <Icon name="Lock" size={18} className="mr-2" />
  //           Change Password
  //         </div>
  //       </Link>
  //       <Link
  //         to="vehicles"
  //         className={`px-4 py-3 text-left rounded-md transition-colors duration-200 ${
  //           currentPath === "vehicles"
  //             ? "bg-primary text-white"
  //             : "hover:bg-gray-100"
  //         }`}
  //       >
  //         <div className="flex items-center">
  //           <Icon name="Car" size={18} className="mr-2" />
  //           Vehicle Details
  //         </div>
  //       </Link>
  //       <Link
  //         to="notifications"
  //         className={`px-4 py-3 text-left rounded-md transition-colors duration-200 ${
  //           currentPath === "notifications"
  //             ? "bg-primary text-white"
  //             : "hover:bg-gray-100"
  //         }`}
  //       >
  //         <div className="flex items-center">
  //           <Icon name="Bell" size={18} className="mr-2" />
  //           Notifications
  //         </div>
  //       </Link>
  //       <Link
  //         to="privacy"
  //         className={`px-4 py-3 text-left rounded-md transition-colors duration-200 ${
  //           currentPath === "privacy"
  //             ? "bg-primary text-white"
  //             : "hover:bg-gray-100"
  //         }`}
  //       >
  //         <div className="flex items-center">
  //           <Icon name="Shield" size={18} className="mr-2" />
  //           Privacy Settings
  //         </div>
  //       </Link>
  //       <Link
  //         to="connections"
  //         className={`px-4 py-3 text-left rounded-md transition-colors duration-200 ${
  //           currentPath === "connections"
  //             ? "bg-primary text-white"
  //             : "hover:bg-gray-100"
  //         }`}
  //       >
  //         <div className="flex items-center">
  //           <Icon name="Link" size={18} className="mr-2" />
  //           Connected Accounts
  //         </div>
  //       </Link>
  //       <Link
  //         to="billing"
  //         className={`px-4 py-3 text-left rounded-md transition-colors duration-200 ${
  //           currentPath === "billing"
  //             ? "bg-primary text-white"
  //             : "hover:bg-gray-100"
  //         }`}
  //       >
  //         <div className="flex items-center">
  //           <Icon name="CreditCard" size={18} className="mr-2" />
  //           Billing & Payments
  //         </div>
  //       </Link>
  //     </div>
  //   </div>

  //   {/* Main Content Area */}
  //   <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  //     {renderTabContent()}
  //   </div>
  // </div>