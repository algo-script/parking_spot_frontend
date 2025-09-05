import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { checkOutvehicle, formatDate, formatDateTime, formatPrice, formatTimeString, guardDashboard } from "utils/helperFunctions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Mycontext } from "context/context";

const GuardDashboard = () => {
  const [spotDetails, setSpotDetails] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Status colors mapping
  const statusColors = {
    Available: "bg-green-100 text-green-800",
    Unvailable: "bg-gray-100 text-gray-400",
    Occupied: "bg-red-100 text-red-800",
    Reserved: "bg-blue-100 text-blue-800",
    Maintenance: "bg-yellow-100 text-yellow-800",
    Confirmed: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Cancelled: "bg-red-100 text-red-800",
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const handleCheckOut = async () => {
    if (!currentBooking) return;
    try {
      const response = await checkOutvehicle({ bookingId: currentBooking._id });
      if (response.success) {
        toast.success(response.message);
        await fetchDashboard();
      }
    } catch (error) {
      console.error("Checkout API error:", error);
      toast.error(error.response.message);
    }
  };

  const handleVerify = () => {
    navigate("/qr-scanner"); // Navigate to /qr-scanner
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await guardDashboard();

      if (response.spotdata && response.success) {
        setSpotDetails({
          ...response.spotdata,
          status: response.spotdata.isAvailable ? "Available" : "Not Available",
        });
        setCurrentBooking(response.bookingdata);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchDashboard}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 container mx-auto px-4 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Parking Spot Details Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Parking Spot Details
              </h2>

              {spotDetails ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Spot Name</p>
                    <p className="font-medium">{spotDetails.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">
                      {spotDetails.address || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="font-medium">{spotDetails.size || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Covered</p>
                    <p className="font-medium">
                      {spotDetails.isCovered === "covered" ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[spotDetails.status] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {spotDetails.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hourly Rate</p>
                    <p className="font-medium">
    
                      {formatPrice(spotDetails.hourlyRate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Availability Hours</p>
                    <p className="font-medium">
                      {formatTimeString(spotDetails.timeAvailability.start)} -{" "}
                      {formatTimeString(spotDetails.timeAvailability.end)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Available Days</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {[
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                        "sunday",
                      ].map((day) => (
                        <span
                          key={day}
                          className={`text-xs px-2 py-1 rounded-full ${
                            spotDetails.availableDays[day]
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {day.slice(0, 3)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="font-medium text-sm mt-1 text-gray-700">
                      {spotDetails.description || "No description"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No spot details available</p>
              )}

              {/* Quick Actions */}
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={handleVerify}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                  >
                    Verify QR Code
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Current Booking */}
          <div className="lg:col-span-2">
            {currentBooking ? (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-blue-900">
                      Current Booking
                    </h2>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[currentBooking.status] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {currentBooking.status}
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Booking ID: {currentBooking.bookingId}
                  </p>
                </div>

                <div className="px-6 py-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User & Vehicle Info */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-3">
                        User & Vehicle
                      </h3>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            User Name
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {currentBooking.user.name}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Vehicle Type
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {currentBooking.vehicle.type}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Brand & Model
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {currentBooking.vehicle.brand}{" "}
                            {currentBooking.vehicle.model}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            License Plate
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 font-mono">
                            {currentBooking.vehicle.vehicleNumber}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Color
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {currentBooking.vehicle.color}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Electric Vehicle
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {currentBooking.vehicle.isElectric ? "Yes" : "No"}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {/* Booking Info */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-3">
                        Booking Details
                      </h3>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Date
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {formatDate(currentBooking.date)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Start Time
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {formatTimeString(currentBooking.startTime)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            End Time
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {formatTimeString(currentBooking.endTime)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Duration
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {currentBooking.duration}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Total Amount
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {formatPrice(currentBooking.totalAmount)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Booked On
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {formatDateTime(currentBooking.createdAt)}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>


                  {/* Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap gap-3">
                      {currentBooking.status === "confirmed" && (
                        <button
                          onClick={handleCheckOut}
                          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                        >
                          Check Out
                        </button>
                      )}
                      {/* <button
                        onClick={handleExtend}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                      >
                        Extend Time
                      </button> */}
                      {/* <button
                        onClick={handleIssue}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                      >
                        Report Issue
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-12 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No active booking
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This parking spot is currently available.
                  </p>
                  {/* <div className="mt-6">
                    <button
                      onClick={handleCheckIn}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Check In a Vehicle
                    </button>
                  </div> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardDashboard;