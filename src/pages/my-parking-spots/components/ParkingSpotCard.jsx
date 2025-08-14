import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import StatusToggle from "./StatusToggle";
import TimeSelector from "./TimeSelector";
import moment from "moment";
import { formatTimeString } from "utils/helperFunctions";
import Locationmap from "./Locationmap";
import { useNavigate } from "react-router-dom";

const ParkingSpotCard = ({
  spot,
  booking,
  userType,
  onToggleAvailability,
  onUpdateTimeWindow,
  onCancelBooking
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

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

  const formatDays = (days) => {
    const activeDays = Object.entries(days)
      .filter(([_, value]) => value)
      .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1));

    return activeDays.length > 0 ? activeDays.join(", ") : "No days selected";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMap = (e) => {
    e.stopPropagation();
    setShowMap(!showMap);
  };

  const handleToggleAvailability = (e) => {
    e.stopPropagation();
    if (onToggleAvailability && spot) {
      onToggleAvailability(spot._id, !spot.isAvailable);
    }
  };

  const handleEditClick = () => {
    navigate("/add-parking-spot", {
      state: {
        spotDetails: spot, 
        isEdit: true, 
      },
    });
  };

  const handleTimeWindowUpdate = (startTime, endTime) => {
    if (onUpdateTimeWindow && spot) {
      onUpdateTimeWindow(spot._id, startTime, endTime);
    }
  };

  const handleCancelClick = () =>{
    if (onCancelBooking && booking) {
      onCancelBooking(booking._id);
    }
  }

  

  const renderOwnerView = () => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200">
        <div className="sm:flex">
        
          <div className="w-full h-48 relative sm:w-1/3">
            <Image
              images={spot.images}
              alt={spot.address}
              className="w-full h-full object-cover"
            />
            <button
              onClick={toggleMap}
              className="absolute bottom-2 right-2 bg-white bg-opacity-90 p-1 rounded-full shadow-sm"
              aria-label="Toggle map view"
            >
              <Icon
                name="Map"
                size={18}
                className="text-primary"
                title="Toggle map view"
              />
            </button>
          </div>

        
          <div className="p-4 sm:w-2/3">
            <div className="flex flex-col-reverse justify-between items-start mb-3 sm:flex-row sm:items-center">
              <h3 className="text-lg font-semibold text-gray-900 flex-1 break-words pr-2">
                {spot.address}
              </h3>
              <div className="flex items-center justify-end w-full space-x-2 sm:justify-start sm:w-auto">
                <button
                  onClick={handleEditClick}
                  className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label="Edit parking spot"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <StatusToggle
                  isAvailable={spot.isAvailable}
                  onChange={handleToggleAvailability}
                />
              </div>
            </div>
            {/* Rest of the content remains the same */}
            <p className="text-gray-600 text-sm mb-4 break-words">
              {spot.description}
            </p>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Icon name="Clock" size={16} className="text-gray-500 mr-1" />
                <span className="text-sm text-gray-700">
                  {formatTimeString(spot.timeAvailability.start)} -{" "}
                  {formatTimeString(spot.timeAvailability.end)}
                </span>
              </div>
              <div className="text-primary font-semibold text-lg">
                {formatPrice(spot.hourlyRate)}
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Content (common for both views) */}
        {isExpanded && (
          <div className="mt-0 sm:mt-4 border-t pt-4 px-4 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Availability Time
                </h4>
                <TimeSelector
                  startTime={spot.timeAvailability.start}
                  endTime={spot.timeAvailability.end}
                  onTimeChange={handleTimeWindowUpdate}
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Available Days
                </h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-800 break-words">
                    {formatDays(spot.availableDays)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Parking Type
                  </h4>
                  <div className="flex items-center">
                    <Icon
                      name={spot.isCovered === "covered" ? "Home" : "Car"}
                      size={16}
                      className="text-gray-500 mr-2"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {spot.isCovered} {spot.size}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Status
                  </h4>
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        spot.isAvailable ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    <span className="text-sm text-gray-700">
                      {spot.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Upcoming Bookings ({spot.upcomingBookings?.length || 0})
              </h4>
              {spot.upcomingBookings?.length > 0 ? (
                <div className="space-y-3">
                  {spot.upcomingBookings.map((booking) => (
                    <div key={booking._id} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex flex-row items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {booking.user?.name}
                          </p>
                          <p className="text-xs text-gray-800">
                             {moment(booking.date).format("MMM D, YYYY")}
                          </p>    
                          <p className="text-xs text-gray-600">
                            {formatTimeString(booking.startTime)} -{" "}
                            {formatTimeString(booking.endTime)}
                          </p>
                        </div>
                        <div className="text-sm font-semibold text-primary mt-1 sm:mt-0">
                          {formatPrice(booking.totalAmount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No upcoming bookings
                </p>
              )}
            </div>

            {showMap && (
              <div className="mt-4 h-64 rounded-md overflow-hidden">
                <Locationmap
                  latitude={spot.location.coordinates[1]}
                  longitude={spot.location.coordinates[0]}
                />
              </div>
            )}
          </div>
        )}

        {/* Show more/less button */}
        <div className="px-4 py-2 bg-gray-50 border-t flex justify-center">
          <button
            onClick={toggleExpanded}
            className="text-sm text-gray-600 flex items-center hover:text-gray-800"
          >
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

  const renderRenterView = () => {
    const isUpcoming = booking.status === "upcoming";
    
    // Format date and time information
    const bookingDate = moment(booking.date).format("MMM D, YYYY");
    const bookingDay = moment(booking.date).format("dddd");
    const startTime = moment(booking.startTime, "HH:mm").format("h:mm A");
    const endTime = moment(booking.endTime, "HH:mm").format("h:mm A");
    const duration = booking.duration; // "00:30" format
  
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200">
        {/* Mobile-first layout */}
        <div className="flex flex-col md:flex-row">
          {/* Image section - full width on mobile, 1/3 on desktop */}
          <div className="w-full md:w-1/3 h-48 relative">
            <Image
              images={booking.image}
              alt={booking.address}
              className="w-full h-full object-cover"
            />
            <button
              onClick={toggleMap}
              className="absolute bottom-2 right-2 bg-white bg-opacity-90 p-1 rounded-full shadow-sm"
              aria-label="Toggle map view"
            >
              <Icon
                name="Map"
                size={18}
                className="text-primary"
                title="Toggle map view"
              />
            </button>
          </div>
          
          {/* Content section - full width on mobile, 2/3 on desktop */}
          <div className="w-full md:w-2/3 p-4">
            {/* Header section */}
            <div className="flex items-center justify-between mb-2">
              {/* <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
                {booking.address}
              </h3> */}
              <h3 className="text-lg font-semibold text-gray-900 flex-1 break-words pr-2">
                {booking.address}
              </h3>
  
              {isUpcoming && (
                <button 
                  onClick={handleCancelClick}
                  className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
                  title="Cancel booking"
                >
                  <Icon name="XCircle" size={20} />
                </button>
              )}
              <span
                className={`text-xs px-2 py-1 rounded-full ml-2 ${
                  booking.status==="cancelled"?
                  "bg-red-500 text-white":"bg-primary bg-opacity-10 text-white"
                }`}
              >
                {booking.status}
              </span>
            </div>
            
            {/* Main content - stacked on mobile, side-by-side on desktop */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              {/* Left content - booking details */}
              <div className="md:flex-1">
                <div className="flex items-center mb-3">
                  <Icon name="User" size={16} className="text-gray-500 mr-1" />
                  <span className="text-sm text-gray-700">
                    Owner: {booking.ownerName}
                  </span>
                </div>
        
                {/* Date and Day */}
                <div className="flex items-center mb-1">
                  <Icon name="Calendar" size={16} className="text-gray-500 mr-1" />
                  <span className="text-sm text-gray-700">
                    {bookingDay}, {bookingDate}
                  </span>
                </div>
        
                {/* Time and Duration */}
                <div className="flex items-center mb-1">
                  <Icon name="Clock" size={16} className="text-gray-500 mr-1" />
                  <span className="text-sm text-gray-700">
                    {startTime} - {endTime} ({duration})
                  </span>
                </div>
        
                {/* Vehicle Information */}
                <div className="flex items-center mb-1">
                  <Icon name="Car" size={16} className="text-gray-500 mr-1" />
                  <span className="text-sm text-gray-700">
                    {booking.vehicle.brand} {booking.vehicle.model} ({booking.vehicle.vehicleNumber})
                  </span>
                </div>
        
                {/* Price */}
                <div className="flex items-center mt-3">
                  <div className="text-sm text-gray-500">Total Amount:</div>
                  <div className="text-primary font-semibold ml-2">
                    ₹{booking.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
              
              {/* Right content - QR code (centered on mobile, right on desktop) */}
              <div className="mt-4 md:mt-2 mb-4 flex flex-col items-center md:items-end md:ml-4">
                <div className="text-sm text-gray-500 mb-2">Check-in QR Code</div>
                <img 
                  src={booking.qrCode} 
                  alt="Booking QR Code" 
                  className="w-24 h-24 md:w-32 md:h-32 object-contain"
                />
                <p className="text-xs text-gray-500 mt-2 text-center md:text-right">
                  Show this QR code at the parking location
                </p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Map section */}
        <div className="px-4 pb-4 bg-gray-50">
          {showMap && (
            <div className="mt-4 h-48 md:h-64 rounded-md overflow-hidden">
              <Locationmap
                latitude={booking.location.coordinates[1]}
                longitude={booking.location.coordinates[0]}
              />
            </div>
          )}
        </div>
      </div>
    );
};
  // const renderRenterView = () => {
  //   const isUpcoming = booking.status === "upcoming";
    
  //   // Format date and time information
  //   const bookingDate = moment(booking.date).format("MMM D, YYYY");
  //   const bookingDay = moment(booking.date).format("dddd");
  //   const startTime = moment(booking.startTime, "HH:mm").format("h:mm A");
  //   const endTime = moment(booking.endTime, "HH:mm").format("h:mm A");
  //   const duration = booking.duration; // "00:30" format
  
  //   return (
  //     <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200">
  //       <div className="flex">
  //         <div className="w-1/3 h-48 relative">
  //         <Image
  //             images={booking.image}
  //             alt={booking.address}
  //             className="w-full h-full object-cover"
  //           />
  //            <button
  //             onClick={toggleMap}
  //             className="absolute bottom-2 right-2 bg-white bg-opacity-90 p-1 rounded-full shadow-sm"
  //             aria-label="Toggle map view"
  //           >
  //             <Icon
  //               name="Map"
  //               size={18}
  //               className="text-primary"
  //               title="Toggle map view"
  //             />
  //           </button>
  //         </div>
  //         <div className="w-2/3 p-4">
  //           <div className="flex items-center justify-between mb-2">
  //             <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
  //               {booking.address}
  //             </h3>
  
  //              {isUpcoming && (
  //                 <button 
  //                   onClick={handleCancelClick}
  //                   className="mr-2 text-gray-500 hover:text-red-500 transition-colors"
  //                   title="Cancel booking"
  //                 >
  //                   <Icon name="XCircle" size={20} />
  //                 </button>
  //               )}
  //             <span
  //               className={`text-xs px-2 py-1 rounded-full ${
  //                 // isUpcoming
  //                 //   ? 
  //                   "bg-primary bg-opacity-10 text-white"
  //                   // : "bg-gray-200 text-gray-700"
  //               }`}
  //             >
  //               {booking.status}
  //             </span>
               
                
  //           </div>
  //           <div className="flex items-center justify-between">
  //               <div>
  //           <div className="flex items-center mb-3">
  //             <Icon name="User" size={16} className="text-gray-500 mr-1" />
  //             <span className="text-sm text-gray-700">
  //               Owner: {booking.ownerName}
  //             </span>
  //           </div>
  
  //           {/* Date and Day */}
  //           <div className="flex items-center mb-1">
  //             <Icon name="Calendar" size={16} className="text-gray-500 mr-1" />
  //             <span className="text-sm text-gray-700">
  //               {bookingDay}, {bookingDate}
  //             </span>
  //           </div>
  
  //           {/* Time and Duration */}
  //           <div className="flex items-center mb-1">
  //             <Icon name="Clock" size={16} className="text-gray-500 mr-1" />
  //             <span className="text-sm text-gray-700">
  //               {startTime} - {endTime} ({duration})
  //             </span>
  //           </div>
  
  //           {/* Vehicle Information */}
  //           <div className="flex items-center mb-1">
  //             <Icon name="Car" size={16} className="text-gray-500 mr-1" />
  //             <span className="text-sm text-gray-700">
  //               {booking.vehicle.brand} {booking.vehicle.model} ({booking.vehicle.vehicleNumber})
  //             </span>
  //           </div>
  
  //           {/* Price */}
  //           <div className="flex  items-center mt-3">
  //             <div className="text-sm text-gray-500">Total Amount:</div>
  //             <div className="text-primary font-semibold">
  //               ₹{booking.totalAmount.toFixed(2)}
  //             </div>
  //           </div>
  //           </div>
  //         <div className="mt-2 mb-4 flex flex-col items-center">
  //             <div className="text-sm text-gray-500 mb-2">Check-in QR Code</div>
  //             <img 
  //               src={booking.qrCode} 
  //               alt="Booking QR Code" 
  //               className="w-32 h-32 object-contain"
  //             />
  //             <p className="text-xs text-gray-500 mt-2">
  //               Show this QR code at the parking location
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //       </div>
  
        
  
  //       {/* {isExpanded && ( */}
  //         <div className="px-4 pb-4 bg-gray-50">
  //            {showMap && (
  //             <div className="mt-4 h-64 rounded-md overflow-hidden">
  //               <Locationmap
  //                 latitude={booking.location.coordinates[1]}
  //                 longitude={booking.location.coordinates[0]}
  //               />
  //             </div>
  //           )}
  //         </div>
      
  //     </div>
  //   );
  // };
  return (
    <> {userType === "owner" ? renderOwnerView() : renderRenterView()}</>
    // <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200">
    //   <div className="flex">
    //     <div className="w-1/3 h-32 relative">
    //       <Image
    //         images={userType === "owner" ? spot.images : booking?.image}
    //         alt={userType === "owner" ? spot?.address : booking?.address}
    //         className="w-full h-full object-cover"
    //       />
    //       <button
    //         onClick={toggleMap}
    //         className="absolute bottom-2 right-2 bg-white bg-opacity-90 p-1 rounded-full shadow-sm"
    //         aria-label="Toggle map view"
    //       >
    //         <Icon
    //           name="Map"
    //           size={18}
    //           className="text-primary"
    //           title="Toggle map view"
    //         />
    //       </button>
    //     </div>
    //     <div className="w-2/3 p-4">
    //       {userType === "owner" ? renderOwnerView() : renderRenterView()}
    //     </div>
    //   </div>

    //   <div
    //     className="px-4 py-2 bg-gray-50 border-t flex justify-center"
    //     onClick={toggleExpanded}
    //   >
    //     <button className="text-sm text-gray-600 flex items-center">
    //       {isExpanded ? (
    //         <>
    //           <Icon name="ChevronUp" size={16} className="mr-1" />
    //           Show less
    //         </>
    //       ) : (
    //         <>
    //           <Icon name="ChevronDown" size={16} className="mr-1" />
    //           Show more
    //         </>
    //       )}
    //     </button>
    //   </div>
    // </div>
  );
};

export default ParkingSpotCard;
     {/* QR Code Section */}
            {/* <div className="mt-2 mb-4 flex flex-col items-center">
              <div className="text-sm text-gray-500 mb-2">Check-in QR Code</div>
              <img 
                src={booking.qrCode} 
                alt="Booking QR Code" 
                className="w-32 h-32 object-contain"
              />
              <p className="text-xs text-gray-500 mt-2">
                Show this QR code at the parking location
              </p>
            </div> */}
  
            {/* {showMap && booking.location && (
              <div className="mt-2 h-48 rounded-md overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  title={booking.address}
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${booking.location.coordinates[1]},${booking.location.coordinates[0]}&z=14&output=embed`}
                ></iframe>
              </div>
            )} */}