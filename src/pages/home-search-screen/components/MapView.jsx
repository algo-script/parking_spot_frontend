import React, { useEffect, useRef } from "react";
import Icon from "../../../components/AppIcon";

const MapView = ({ 
  userLocation, 
  parkingSpots, 
  selectedSpot, 
  onSpotSelect, 
  onSpotClick 
}) => {
  const mapRef = useRef(null);

  // This component would typically use a mapping library like Google Maps or Mapbox
  // For this implementation, we'll create a mock map interface

  useEffect(() => {
    // In a real implementation, this would initialize the map
    console.log("Map initialized with user location:", userLocation);
  }, [userLocation]);

  useEffect(() => {
    // In a real implementation, this would update markers when parking spots change
    console.log("Parking spots updated on map:", parkingSpots.length);
  }, [parkingSpots]);

  useEffect(() => {
    // In a real implementation, this would highlight the selected spot
    if (selectedSpot) {
      console.log("Selected spot on map:", selectedSpot.id);
    }
  }, [selectedSpot]);

  // Calculate center point for the iframe map (average of all spots or user location)
  const mapCenter = userLocation || { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco

  return (
    <div className="relative w-full h-full" ref={mapRef}>
      {/* Mock Map Implementation using Google Maps iframe */}
      <iframe
        width="100%"
        height="100%"
        loading="lazy"
        title="Parking Map"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&z=14&output=embed`}
        className="absolute inset-0"
      ></iframe>

      {/* Mock Parking Spot Markers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* User Location Marker */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ 
            left: '50%', 
            top: '50%',
            zIndex: 10
          }}
        >
          <div className="bg-blue-500 rounded-full p-2 shadow-lg animate-pulse">
            <Icon name="Navigation" size={16} color="white" />
          </div>
          <div className="mt-1 bg-white px-2 py-1 rounded-md shadow-md text-xs font-medium">
            You are here
          </div>
        </div>

        {/* Parking Spot Markers - In a real implementation, these would be positioned based on coordinates */}
        {parkingSpots.map((spot, index) => {
          // Mock positioning for demonstration
          const isSelected = selectedSpot && selectedSpot.id === spot.id;
          const left = `${20 + (index * 10)}%`;
          const top = `${30 + ((index % 3) * 15)}%`;
          
          return (
            <div 
              key={spot.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
              style={{ 
                left, 
                top,
                zIndex: isSelected ? 5 : 1
              }}
              onClick={() => {
                onSpotSelect(spot);
                // Simulate a slight delay before navigation
                setTimeout(() => onSpotClick(spot.id), 300);
              }}
            >
              <div 
                className={`rounded-full p-2 shadow-md transition-all duration-200 ${
                  spot.isAvailable 
                    ? isSelected 
                      ? 'bg-primary scale-125' :'bg-success hover:scale-110' :'bg-gray-400 hover:scale-110'
                }`}
              >
                <Icon name="ParkingCircle" size={16} color="white" />
              </div>
              {isSelected && (
                <div className="mt-1 bg-white px-2 py-1 rounded-md shadow-md text-xs font-medium whitespace-nowrap">
                  ${spot.hourlyRate}/hr
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <button 
          className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200"
          aria-label="Zoom in"
        >
          <Icon name="Plus" size={20} />
        </button>
        <button 
          className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200"
          aria-label="Zoom out"
        >
          <Icon name="Minus" size={20} />
        </button>
        <button 
          className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200"
          aria-label="Center on my location"
        >
          <Icon name="Locate" size={20} />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute top-4 left-4 bg-white rounded-md shadow-md p-2">
        <div className="flex items-center text-xs mb-1">
          <div className="w-3 h-3 rounded-full bg-success mr-2"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;