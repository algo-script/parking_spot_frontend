import React from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import { formatTimeString } from "utils/helperFunctions";

const ParkingSpotList = ({ 
  spots, 
  isLoading, 
  // selectedSpot, 
  // onSpotSelect, 
  onSpotClick 
}) => {

  // console.log("spots",spots ) 
  // Format time string to AM/PM format
  // const formatTime = (timeString) => {
  //   if (!timeString) return "";
    
  //   try {
  //     const [hours, minutes] = timeString.split(":");
  //     const hour = parseInt(hours, 10);
  //     const period = hour >= 12 ? "PM" : "AM";
  //     const displayHour = hour % 12 || 12;
  //     return `${displayHour}:${minutes} ${period}`;
  //   } catch (e) {
  //     return timeString;
  //   }
  // };
  // const formatDateTime = (isoString) => {
  //   if (!isoString) return "";
  //   const date = new Date(isoString);
  //   return date.toLocaleString("en-IN", {
  //     day: "2-digit",
  //     month: "short",
  //     year: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: true,
  //   });
  // };

  // Render loading skeletons
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-[500px]">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Nearby Parking</h2>
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        </div>
        
        <div className="overflow-y-auto h-[calc(500px-60px)]">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="p-4 border-b border-gray-200 animate-pulse">
              <div className="flex">
                <div className="w-20 h-20 bg-gray-200 rounded-md mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3 mt-2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render empty state
  if (spots.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-[500px]">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Nearby Parking</h2>
        </div>
        
        <div className="flex flex-col items-center justify-center h-[calc(500px-60px)] p-6 text-center">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <Icon name="Search" size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No parking spots found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or search in a different area</p>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
            onClick={() => window.location.reload()}
          >
            Reset Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-[500px]">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Nearby Parking</h2>
          <div className="text-sm text-gray-500">{spots.length} spots</div>
        </div>
      </div>
      
      <div className="overflow-y-auto h-[calc(500px-60px)]">
        {spots.map((spot) => {
          // const isSelected = selectedSpot && selectedSpot.id === spot.id;
          
          return (
            <div 
              key={spot._id}
              className={`p-4 border-b border-gray-200 cursor-pointer transition-colors duration-200  hover:bg-gray-50`}
              onClick={() => {
                // onSpotSelect(spot);
                onSpotClick(spot._id);
              }}
              tabIndex={0}
              role="button"
              // aria-pressed={isSelected}
              // onKeyDown={(e) => {
              //   if (e.key === 'Enter' || e.key === ' ') {
              //     onSpotSelect(spot);
              //     onSpotClick(spot.id);
              //   }
              // }}
            >
              <div className="flex">
                <div className="w-20 h-20 bg-gray-200 rounded-md mr-3 overflow-hidden">
                  <Image 
                    images = {spot.images} 
                    alt={spot.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-gray-900">{spot.name}</h3>
                    <div className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                      spot.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {spot.isAvailable ? 'Available' : 'Unavailable'}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">
                    <Icon name="MapPin" size={14} className="inline mr-1 text-gray-400" />
                    {spot.address}
                  </p>
                  
                  <p className="text-sm text-gray-600 mt-1">
                    <Icon name="Clock" size={14} className="inline mr-1 text-gray-400" />
                    {formatTimeString(spot.timeAvailability.start)} - {formatTimeString(spot.timeAvailability.end)}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <Icon name="Star" size={14} className="text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{spot.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({spot.totalReviews})</span>
                    </div>
                    
                    <div className="text-lg font-semibold text-primary">
                      ${spot.hourlyRate}/hr
                    </div>
                  </div>
                </div>
              </div>
{/*               
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {spot.amenities.map((amenity, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-md"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                  
                  <button
                    className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSpotClick(spot.id);
                    }}
                  >
                    <span>View Details</span>
                    <Icon name="ArrowRight" size={16} className="ml-1" />
                  </button>
                </div>
              )} */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParkingSpotList;