import React, { useState, useEffect } from "react";
import moment from "moment";
import Icon from "../../../components/AppIcon";
import {
  callconfirmBooking,
  formatPrice,
  formatTimeString,
  getAvailableTimes,
  getVehicle,
} from "utils/helperFunctions";
import { useNavigate } from "react-router-dom";

const BookingModal = ({ parkingSpot, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [error, setError] = useState(null);
  const [sucessmsg, setSucessmsg] = useState("");
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState();
  const [availabilityData, setAvailabilityData] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [bookingData, setBookingData] = useState(null);


  const generateTimeSlots = () => {
    if (!availabilityData) return [];
    const allSlots = [];
    availabilityData.forEach((range) => {
      const start = moment(range.start, "HH:mm");
      const end = moment(range.end, "HH:mm");

      let currentTime = start.clone();

      while (currentTime.isSameOrBefore(end)) {
        allSlots.push(currentTime.format("h:mm A")); // Changed to 12-hour format
        currentTime.add(30, "minutes");
      }
    });

    return [...new Set(allSlots)]; // Remove duplicates
  };

  const getAvailableRanges = () => {
    if (!availabilityData) return [];
    return availabilityData;
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setError("");
    setSelectedStartTime("");
    setSelectedEndTime("");
    setLoadingAvailability(true);

    try {
      const response = await getAvailableTimes({
        parkingSpotId: parkingSpot._id,
        date,
      });

      if (response.success) {
        setAvailabilityData(response.slots);
      } else {
        setAvailabilityData([]);
        setError(response.message);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      setError(error.message || "Failed to check availability");
      setAvailabilityData([]);
    } finally {
      setLoadingAvailability(false);
    }
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await getVehicle();
      if (response.success) {
        setAvailableVehicles(response.data);
        const defaultVehicle =
          response.data.find((v) => v.defaultVehicle) || response.data[0];
        setSelectedVehicle(defaultVehicle);
      }
    } catch (error) {
      setError("Failed to load vehicles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (availabilityData?.length > 0) {
      const slots = generateTimeSlots();
      if (slots.length > 0) {
        setSelectedStartTime(slots[0]);
        const endIndex = Math.min(1, slots.length - 1); // Default 30 minutes
        setSelectedEndTime(slots[endIndex]);
      }
    }
  }, [availabilityData]);

  const isTimeInAvailableRange = (startTime, endTime) => {
    if (!availabilityData) return false;

    const start = moment(startTime, "h:mm A");
    const end = moment(endTime, "h:mm A");

    return availabilityData.some((range) => {
      const rangeStart = moment(range.start, "HH:mm");
      const rangeEnd = moment(range.end, "HH:mm");

      return start.isSameOrAfter(rangeStart) && end.isSameOrBefore(rangeEnd);
    });
  };

  const handleTimeChange = (type, value) => {
    setError(null);
    if (type === "start") {
      setSelectedStartTime(value);
      const slots = generateTimeSlots();
      const newStartIndex = slots.indexOf(value);
      const newEndIndex = Math.min(newStartIndex + 1, slots.length - 1);
      setSelectedEndTime(slots[newEndIndex]);
    } else {
      setSelectedEndTime(value);
    }
  };

  const calculateDuration = () => {
    if (!selectedStartTime || !selectedEndTime) return "00:00";

    const start = moment(selectedStartTime, "h:mm A");
    const end = moment(selectedEndTime, "h:mm A");

    const duration = moment.duration(end.diff(start));
    const hours = duration.hours().toString().padStart(2, "0");
    const minutes = duration.minutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const calculateTotal = () => {
    if (!selectedStartTime || !selectedEndTime)
      return parkingSpot.hourlyRate.toFixed(2);
    const start = moment(selectedStartTime, "h:mm A");
    const end = moment(selectedEndTime, "h:mm A");
    const duration = moment.duration(end.diff(start));
    const totalHours = duration.asHours();
    return (totalHours * parkingSpot.hourlyRate).toFixed(2);
  };

  const confirmBooking = async () => {
    setLoading(true);
    try {
      const bookingData = {
        parkingSpotId: parkingSpot._id,
        vehicleId: selectedVehicle._id,
        date: selectedDate,
        startTime: moment(selectedStartTime, "hh:mm A").format("HH:mm"),
        endTime: moment(selectedEndTime, "hh:mm A").format("HH:mm"),
        duration: calculateDuration(),
        totalAmount: calculateTotal(),
      };

      const response = await callconfirmBooking(bookingData);
      if (response.success) {
        setSucessmsg(response.message);
        setBookingData(response.booking);
        setStep(3);
      }
    } catch (error) {
      setError(error.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-6">
      {[1, 2, 3].map((stepNum) => (
        <div key={stepNum} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center 
              ${
                step === stepNum
                  ? "bg-primary text-white"
                  : step > stepNum
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-500"
              }`}
          >
            {stepNum}
          </div>
          {stepNum < 3 && (
            <div
              className={`w-8 h-1 mx-1 ${
                step > stepNum ? "bg-green-100" : "bg-gray-200"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 min-h-screen  bg-black/30 backdrop-blur-sm transition-all duration-300 overflow-y-auto"
      style={{
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div className="absolute inset-0 opacity-75" onClick={onClose}></div>
      <div
        className="relative bg-white rounded-xl shadow-xl w-full  max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <Icon name="X" size={24} />
            </button>
            <h2 className="text-xl font-semibold">Book Parking Spot</h2>
            <div className="w-6"></div>
          </div>

          {renderStepIndicator()}

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Select Date</h3>
                <div>
                  <label
                    htmlFor="selectedDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="selectedDate"
                    name="selectedDate"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={moment().format("YYYY-MM-DD")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {loadingAvailability ? (
                <div className="flex justify-center py-4">
                  <Icon name="Loader" className="animate-spin" />
                </div>
              ) : availabilityData?.length > 0 ? (
                <div>
                  <h3 className="text-lg font-medium mb-2">Select Time</h3>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Available Time Ranges:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {getAvailableRanges().map((range, index) => {
                        const rangeStart = moment(range.start, "HH:mm");
                        const rangeEnd = moment(range.end, "HH:mm");
                        const selectedStart = moment(
                          selectedStartTime,
                          "h:mm A"
                        );
                        const selectedEnd = moment(selectedEndTime, "h:mm A");
                        const isActive =
                          selectedStart.isSameOrAfter(rangeStart) &&
                          selectedEnd.isSameOrBefore(rangeEnd);

                        return (
                          <div
                            key={index}
                            className={`px-3 py-1 rounded-full text-xs ${
                              isActive
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {moment(range.start, "HH:mm").format("h:mm A")} -{" "}
                            {moment(range.end, "HH:mm").format("h:mm A")}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        From
                      </label>
                      <select
                        value={selectedStartTime}
                        onChange={(e) =>
                          handleTimeChange("start", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-md"
                      >
                        {generateTimeSlots().map((time, index) => (
                          <option
                            key={`start-${index}`}
                            value={time}
                            disabled={time >= selectedEndTime}
                          >
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        To
                      </label>
                      <select
                        value={selectedEndTime}
                        onChange={(e) =>
                          handleTimeChange("end", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-md"
                      >
                        {generateTimeSlots().map((time, index) => (
                          <option
                            key={`end-${index}`}
                            value={time}
                            disabled={time <= selectedStartTime}
                          >
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Validation - ensure selected time is within an available range */}
                  {selectedStartTime &&
                    selectedEndTime &&
                    !isTimeInAvailableRange(
                      selectedStartTime,
                      selectedEndTime
                    ) && (
                      <div className="mt-2 text-sm text-red-600">
                        Selected time must be within one of the available ranges
                      </div>
                    )}
                </div>
              ) : !selectedDate ? (
                <div className="text-center py-4 text-gray-500">
                  Please select valid date for see availability
                </div>
              ) : (
                <></>
              )}

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Your Vehicle</h3>
                  {/* <button className="text-primary text-sm flex items-center">
                    <Icon name="Plus" size={16} className="mr-1" />
                    Add Vehicle
                  </button> */}
                </div>
                <div className="space-y-3">
                  {availableVehicles.map((vehicle) => (
                    <div
                      key={vehicle._id}
                      onClick={() => setSelectedVehicle(vehicle)}
                      className={`p-3 border rounded-md cursor-pointer transition-colors
                          ${
                            selectedVehicle?._id === vehicle._id
                              ? "border-primary bg-primary-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">
                            {vehicle.brand} {vehicle.model}
                          </div>
                          <div className="text-sm text-gray-600">
                            {vehicle.vehicleNumber}
                          </div>
                        </div>
                        {vehicle.defaultVehicle && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {vehicle.color} • {vehicle.type}{" "}
                        {vehicle.isElectric && "• Electric"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedDate && selectedStartTime && selectedEndTime && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {calculateDuration()} {" "}
                    {formatPrice(parkingSpot.hourlyRate)}/hour
                  </div>
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                disabled={
                  !selectedDate ||
                  !selectedVehicle ||
                  !selectedStartTime ||
                  !selectedEndTime ||
                  !isTimeInAvailableRange(selectedStartTime, selectedEndTime)
                }
                className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Confirm Your Booking</h2>

              <div className="bg-gray-50 p-4 rounded-md">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {moment(selectedDate).format("DD/MM/YYYY")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">
                      {formatTimeString(selectedStartTime)} -{" "}
                      {formatTimeString(selectedEndTime)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{calculateDuration()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="font-medium text-right">
                      {selectedVehicle?.brand} {selectedVehicle?.model}
                      <br />
                      <span className="text-sm text-gray-500">
                        {selectedVehicle?.vehicleNumber}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-200 my-3"></div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-md p-4">
                <h3 className="font-medium mb-2">Parking Instructions</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Park in the designated spot number</li>
                  <li>Lock your vehicle and take valuables with you</li>
                  <li>Check in using the QR code when you arrive</li>
                </ul>
              </div>

              <button
                onClick={confirmBooking}
                disabled={loading}
                className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Icon name="Loader" className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <Icon name="Check" size={32} className="text-green-600" />
              </div>

              <h2 className="text-2xl font-semibold">{sucessmsg}</h2>
              <p className="text-gray-600">
                Your parking spot has been successfully booked.
              </p>

              <div className="bg-gray-50 p-4 rounded-md text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-medium">{bookingData.bookingId} </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {moment(selectedDate).format("DD/MM/YYYY")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">
                    {formatTimeString(bookingData.startTime)} -{" "}
                    {formatTimeString(bookingData.endTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium">
                    {bookingData.vehicle?.brand} {bookingData.vehicle?.model}
                  </span>
                </div>
              </div>

              <div className="border border-dashed border-gray-300 rounded-md p-4">
                <div className="text-center mb-3">
                  <div className="text-sm text-gray-500 mb-1">
                    Check-in QR Code
                  </div>
                  <div className="inline-block p-2 bg-white">
                    <div className="w-32 h-32 bg-gray-100 flex items-center justify-center">
                      <img src={bookingData.qrCodeUrl} alt="Booking QR Code" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Show this QR code at the entrance for access.
                </p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  navigate("/my-booking");
                }}
                className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
