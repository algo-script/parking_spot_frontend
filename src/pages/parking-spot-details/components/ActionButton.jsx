import React, { useState } from "react";
import Icon from "../../../components/AppIcon";

const ActionButton = ({ onClick, onUnavailable ,isAvailable}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (isAvailable) {
        onClick();
      } else {
        onUnavailable();
      }
    }, 1500);
  };
  
  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="flex items-center justify-center w-full py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Checking Availability...
        </>
      ) : (
        <>
          <Icon name="Calendar" size={20} className="mr-2" />
          Book Now
        </>
      )}
    </button>
  );
};

export default ActionButton;