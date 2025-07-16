import React from "react";
import { Link } from "react-router-dom";
import Icon from "../components/AppIcon";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-4 rounded-full">
            <Icon name="MapPin" size={48} color="var(--color-primary)" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/home-search-screen"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary-dark transition-colors duration-200"
        >
          <Icon name="ArrowLeft" size={18} className="mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;