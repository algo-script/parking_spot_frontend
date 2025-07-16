import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 font-medium">Loading parking spot details...</p>
    </div>
  );
};

export default LoadingSpinner;