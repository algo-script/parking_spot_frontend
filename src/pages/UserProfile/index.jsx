import React, { useState, useEffect } from "react";
import Icon from "../../components/AppIcon";
import { Link, useLocation } from "react-router-dom";
import ProfileTab from "./components/ProfileTab";
import PasswordTab from "./components/PasswordTab";
import VehiclesTabWrapper from "./components/VehiclesTabWrapper";
import NotificationsTab from "./components/NotificationsTab";
import PrivacyTab from "./components/PrivacyTab";
import ConnectionsTab from "./components/ConnectionsTab";
import BillingTab from "./components/BillingTab";

const UserProfile = ({ user, fetchUserData }) => {
 
 
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop() || "profile"; 

  // Map currentPath to the corresponding component
  const renderTabContent = () => {
    switch (currentPath) {
      case "profile":
        return (
          <ProfileTab
            user={user}
            fetchUserData={fetchUserData}
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

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto p-4">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit">
        <div className="flex flex-col space-y-1">
          <Link
            to="profile"
            className={`px-4 py-3 text-left rounded-md transition-colors duration-200 ${
              currentPath === "profile"
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center">
              <Icon name="User" size={18} className="mr-2" />
              Profile Information
            </div>
          </Link>
          <Link
            to="password"
            className={`px-4 py-3 text-left rounded-md transition-colors duration-200 ${
              currentPath === "password"
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center">
              <Icon name="Lock" size={18} className="mr-2" />
              Change Password
            </div>
          </Link>
          <Link
            to="vehicles"
            className={`px-4 py-3 text-left rounded-md transition-colors duration-200 ${
              currentPath === "vehicles"
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center">
              <Icon name="Car" size={18} className="mr-2" />
              Vehicle Details
            </div>
          </Link>
          <Link
            to="notifications"
            className={`px-4 py-3 text-left rounded-md transition-colors duration-200 ${
              currentPath === "notifications"
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center">
              <Icon name="Bell" size={18} className="mr-2" />
              Notifications
            </div>
          </Link>
          <Link
            to="privacy"
            className={`px-4 py-3 text-left rounded-md transition-colors duration-200 ${
              currentPath === "privacy"
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center">
              <Icon name="Shield" size={18} className="mr-2" />
              Privacy Settings
            </div>
          </Link>
          <Link
            to="connections"
            className={`px-4 py-3 text-left rounded-md transition-colors duration-200 ${
              currentPath === "connections"
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center">
              <Icon name="Link" size={18} className="mr-2" />
              Connected Accounts
            </div>
          </Link>
          <Link
            to="billing"
            className={`px-4 py-3 text-left rounded-md transition-colors duration-200 ${
              currentPath === "billing"
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center">
              <Icon name="CreditCard" size={18} className="mr-2" />
              Billing & Payments
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default UserProfile;

