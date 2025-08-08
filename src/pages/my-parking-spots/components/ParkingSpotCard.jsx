import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import StatusToggle from "./StatusToggle";
// import DateTimeRangePicker from "./DateTimeRangePicker";
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
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  // console.log(spot);
  const navigate = useNavigate();

  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

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
    navigate('/add-parking-spot', {
      state: {
        spotDetails: spot, // Pass the entire spot object
        isEdit: true       // Flag to indicate edit mode
      }
    });
  };

  // const handleTimeWindowUpdate = ({ start, end }) => {
  //   if (onUpdateTimeWindow && spot) {
  //     onUpdateTimeWindow(spot._id, start, end);
  //   }
  // };
  const handleTimeWindowUpdate = (startTime, endTime) => {
    if (onUpdateTimeWindow && spot) {
      onUpdateTimeWindow(spot._id, startTime, endTime);
    }
  };

  const renderOwnerView = () => {
    return (
      <>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
            {spot.address}
          </h3>
          <div className="flex items-center space-x-2">
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

        <p className="text-gray-600 text-sm mb-3">{spot.description}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Icon name="Clock" size={16} className="text-gray-500 mr-1" />
            {/* <span className="text-sm text-gray-700">
              {formatDateTime(spot.timeAvailability.start)} -{" "}
              {formatDateTime(spot.timeAvailability.end)}
            </span> */}
            <span className="text-sm text-gray-700">
              {formatTimeString(spot.timeAvailability.start)} -{" "}
              {formatTimeString(spot.timeAvailability.end)}
            </span>
          </div>
          <div className="text-primary font-semibold">
            {formatPrice(spot.hourlyRate)}
          </div>
        </div>

        <div className="mb-4"></div>

        {isExpanded && (
          <div className="mt-4 border-t pt-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
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
                  <p className="text-sm text-gray-800">
                    {formatDays(spot.availableDays)}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
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
                      spot.isAvailable ? "bg-success" : "bg-gray-400"
                    }`}
                  />
                  <span className="text-sm text-gray-700">
                    {spot.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            </div>

            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Upcoming Bookings ({spot.upcomingBookings?.length || 0})
            </h4>

            {spot.upcomingBookings?.length > 0 ? (
              <div className="space-y-3">
                {spot.upcomingBookings.map((booking) => (
                  <div key={booking.id} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {booking.userName}
                        </p>
                        <p className="text-xs text-gray-600">
                          {formatDateTime(booking.startTime)} -{" "}
                          {formatDateTime(booking.endTime)}
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
              <p className="text-sm text-gray-500 italic">
                No upcoming bookings
              </p>
            )}

            {showMap && (
              <div className="mt-4 h-48 rounded-md overflow-hidden">
                <Locationmap
                  latitude={spot.location.coordinates[1]}
                  longitude={spot.location.coordinates[0]}
                />
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  const renderRenterView = () => {
    const isUpcoming = booking.status === "upcoming";

    return (
      <>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
            {booking.address}
          </h3>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              isUpcoming
                ? "bg-primary bg-opacity-10 text-primary"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {isUpcoming ? "Upcoming" : "Completed"}
          </span>
        </div>

        <div className="flex items-center mb-3">
          <Icon name="User" size={16} className="text-gray-500 mr-1" />
          <span className="text-sm text-gray-700">
            Owner: {booking.ownerName}
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Icon name="Calendar" size={16} className="text-gray-500 mr-1" />
            <span className="text-sm text-gray-700">
              {formatDateTime(booking.startTime)} -{" "}
              {formatDateTime(booking.endTime)}
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
                  src={`https://www.google.com/maps?q=${booking.location.lat},${booking.location.lng}&z=14&output=embed`}
                ></iframe>
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200">
      <div className="flex">
        <div className="w-1/3 h-32 relative">
          <Image
            images={userType === "owner" ? spot.images : booking?.image}
            alt={userType === "owner" ? spot?.address : booking?.address}
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
        <div className="w-2/3 p-4">
          {userType === "owner" ? renderOwnerView() : renderRenterView()}
        </div>
      </div>

      <div
        className="px-4 py-2 bg-gray-50 border-t flex justify-center"
        onClick={toggleExpanded}
      >
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
