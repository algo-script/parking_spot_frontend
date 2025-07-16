import React from "react";

const MapSelector = ({ latitude, longitude, onPositionChange }) => {
  // In a real implementation, this would include map interaction logic
  // For now, we'll just display a map with the given coordinates
  
  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-gray-300 relative">
      <iframe
        width="100%"
        height="100%"
        loading="lazy"
        title="Parking Spot Location"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`}
      ></iframe>
      
      {/* Overlay to simulate draggable pin functionality */}
      <div 
        className="absolute top-0 left-0 right-0 bottom-0 bg-transparent cursor-move"
        onClick={(e) => {
          // In a real implementation, this would update the pin position
          // For demo purposes, we'll just simulate a small random movement
          const offsetX = (Math.random() * 0.01) - 0.005;
          const offsetY = (Math.random() * 0.01) - 0.005;
          onPositionChange(latitude + offsetX, longitude + offsetY);
        }}
      />
      
      {/* Centered pin */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
        <div className="w-2 h-2 bg-primary absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45"></div>
      </div>
    </div>
  );
};

export default MapSelector;