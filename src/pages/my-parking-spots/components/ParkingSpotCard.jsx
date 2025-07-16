import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import StatusToggle from "./StatusToggle";
import TimeSelector from "./TimeSelector";

const ParkingSpotCard = ({ 
  spot, 
  booking, 
  userType, 
  onToggleAvailability, 
  onUpdateTimeWindow 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Format date and time
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format time only
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Toggle map visibility
  const toggleMap = (e) => {
    e.stopPropagation();
    setShowMap(!showMap);
  };

  // Handle availability toggle
  const handleToggleAvailability = (e) => {
    e.stopPropagation();
    if (onToggleAvailability && spot) {
      onToggleAvailability(spot.id, !spot.isAvailable);
    }
  };

  // Handle time window update
  const handleTimeWindowUpdate = (startTime, endTime) => {
    if (onUpdateTimeWindow && spot) {
      onUpdateTimeWindow(spot.id, startTime, endTime);
    }
  };

  // Render owner view of a parking spot
  const renderOwnerView = () => {
    return (
      <>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
            {spot.address}
          </h3>
          <StatusToggle 
            isAvailable={spot.isAvailable} 
            onChange={handleToggleAvailability} 
          />
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{spot.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Icon name="Clock" size={16} className="text-gray-500 mr-1" />
            <span className="text-sm text-gray-700">
              {formatTime(spot.availableTimeStart)} - {formatTime(spot.availableTimeEnd)}
            </span>
          </div>
          <div className="text-primary font-semibold">
            {formatPrice(spot.price)}/{spot.priceUnit}
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 border-t pt-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Availability Hours</h4>
              <TimeSelector 
                startTime={spot.availableTimeStart}
                endTime={spot.availableTimeEnd}
                onTimeChange={handleTimeWindowUpdate}
              />
            </div>
            
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Upcoming Bookings ({spot.upcomingBookings.length})
            </h4>
            
            {spot.upcomingBookings.length > 0 ? (
              <div className="space-y-3">
                {spot.upcomingBookings.map(booking => (
                  <div key={booking.id} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{booking.userName}</p>
                        <p className="text-xs text-gray-600">
                          {formatDateTime(booking.startTime)} - {new Date(booking.endTime).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-primary">
                        {formatPrice(booking.totalAmount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No upcoming bookings</p>
            )}
            
            {showMap && spot.location && (
              <div className="mt-4 h-48 rounded-md overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  title={spot.address}
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${spot.location.lat},${spot.location.lng}&z=14&output=embed`}>
                </iframe>
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  // Render renter view of a booking
  const renderRenterView = () => {
    const isUpcoming = booking.status === "upcoming";
    
    return (
      <>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
            {booking.address}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full ${
            isUpcoming ? 'bg-primary bg-opacity-10 text-primary' : 'bg-gray-200 text-gray-700'
          }`}>
            {isUpcoming ? 'Upcoming' : 'Completed'}
          </span>
        </div>
        
        <div className="flex items-center mb-3">
          <Icon name="User" size={16} className="text-gray-500 mr-1" />
          <span className="text-sm text-gray-700">Owner: {booking.ownerName}</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Icon name="Calendar" size={16} className="text-gray-500 mr-1" />
            <span className="text-sm text-gray-700">
              {formatDateTime(booking.startTime)} - {new Date(booking.endTime).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </span>
          </div>
          <div className="text-primary font-semibold">
            {formatPrice(booking.totalAmount)}
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 border-t pt-4">
            {isUpcoming && (
              <div className="flex space-x-2 mb-4">
                <button className="btn btn-outline flex-1 py-1 flex items-center justify-center text-sm">
                  <Icon name="MessageCircle" size={16} className="mr-1" />
                  Contact Owner
                </button>
                <button className="btn btn-outline flex-1 py-1 flex items-center justify-center text-sm text-error border-error hover:bg-error hover:bg-opacity-10">
                  <Icon name="X" size={16} className="mr-1" />
                  Cancel
                </button>
              </div>
            )}
            
            {showMap && booking.location && (
              <div className="mt-2 h-48 rounded-md overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  title={booking.address}
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${booking.location.lat},${booking.location.lng}&z=14&output=embed`}>
                </iframe>
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200"
      onClick={toggleExpanded}
    >
      <div className="flex">
        <div className="w-1/3 h-32 relative">
          <Image
            src={userType === "owner" ? spot?.image : booking?.image}
            alt={userType === "owner" ? spot?.address : booking?.address}
            className="w-full h-full object-cover"
          />
          <button 
            onClick={toggleMap}
            className="absolute bottom-2 right-2 bg-white bg-opacity-90 p-1 rounded-full shadow-sm"
            aria-label="Toggle map view"
          >
            <Icon name="Map" size={18} className="text-primary" />
          </button>
        </div>
        <div className="w-2/3 p-4">
          {userType === "owner" ? renderOwnerView() : renderRenterView()}
        </div>
      </div>
      
      <div className="px-4 py-2 bg-gray-50 border-t flex justify-center">
        <button className="text-sm text-gray-600 flex items-center">
          {isExpanded ? (
            <>
              <Icon name="ChevronUp" size={16} className="mr-1" />
              Show less
            </>
          ) : (
            <>
              <Icon name="ChevronDown" size={16} className="mr-1" />
              Show more
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ParkingSpotCard;