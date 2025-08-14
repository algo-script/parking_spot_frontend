import React, { useState, useEffect } from "react";
import moment from "moment";
import Icon from "../../../components/AppIcon";
import { callconfirmBooking, getVehicle } from "utils/helperFunctions";
import { useNavigate } from "react-router-dom";

const BookingModal = ({ parkingSpot, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [error, setError] = useState(null);
  const [sucessmsg,setSucessmsg] = useState("")
  const [qrurl, setQrurl] = useState(null);
  const navigate = useNavigate();


  // Get available days with dates and time slots
  const getAvailableDaysWithDates = () => {
    const today = moment();
    const currentDay = today.day();
    const currentTime = today.format("HH:mm");

    const dayMap = [
      { id: "sunday", name: "Sunday", dayIndex: 0 },
      { id: "monday", name: "Monday", dayIndex: 1 },
      { id: "tuesday", name: "Tuesday", dayIndex: 2 },
      { id: "wednesday", name: "Wednesday", dayIndex: 3 },
      { id: "thursday", name: "Thursday", dayIndex: 4 },
      { id: "friday", name: "Friday", dayIndex: 5 },
      { id: "saturday", name: "Saturday", dayIndex: 6 },
    ];

    return dayMap
      .filter((day) => parkingSpot.availability.availableDays[day.id])
      .map((day) => {
        let daysToAdd = (day.dayIndex - currentDay + 7) % 7;
        const isToday = daysToAdd === 0;
        
        const date = today.clone().add(daysToAdd, 'days');
        
        let availableSlots = [];
        if (isToday) {
          const startTime = moment(parkingSpot.availability.startTime, "HH:mm");
          const endTime = moment(parkingSpot.availability.endTime, "HH:mm");
          
          if (moment(currentTime, "HH:mm").isSameOrAfter(startTime)) {
            // Start from current time rounded to next 30-minute interval
            let slotTime = moment(currentTime, "HH:mm");
            
            // Round up to next 30 minutes
            const minutes = slotTime.minutes();
            if (minutes > 0 && minutes < 30) {
              slotTime.add(30 - minutes, 'minutes');
            } else if (minutes > 30) {
              slotTime.add(60 - minutes, 'minutes');
            }
            
            while (slotTime.isSameOrBefore(endTime)) {
              availableSlots.push(slotTime.format("HH:mm"));
              slotTime.add(30, 'minutes');
            }
          }
        }
        
        return {
          ...day,
          date,
          dateString: date.format("ddd, MMM D"),
          isToday,
          availableSlots
        };
      })
      .sort((a, b) => a.date - b.date);
  };

  const generateTimeSlots = () => {
    if (!selectedDay) return [];
    
    if (selectedDay.isToday && selectedDay.availableSlots?.length > 0) {
      return selectedDay.availableSlots;
    }

    const startTime = moment(parkingSpot.availability.startTime, "HH:mm");
    const endTime = moment(parkingSpot.availability.endTime, "HH:mm");

    const slots = [];
    let currentTime = startTime.clone();

    while (currentTime.isSameOrBefore(endTime)) {
      slots.push(currentTime.format("HH:mm"));
      currentTime.add(30, 'minutes');
    }

    return slots;
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await getVehicle();
      if (response.success) {
        setAvailableVehicles(response.data);
        const defaultVehicle = response.data.find(v => v.defaultVehicle) || response.data[0];
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
    if (selectedDay) {
      const slots = generateTimeSlots();
      if (slots.length > 0) {
        setSelectedStartTime(slots[0]);
        const endIndex = Math.min(1, slots.length - 1); // Default 30 minutes
        setSelectedEndTime(slots[endIndex]);
      } else {
        setError("No available time slots for selected day");
      }
    }
  }, [selectedDay]);

  const handleDaySelection = (day) => {
    setError(null);
    setSelectedDay(day);
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
  
    const start = moment(selectedStartTime, "HH:mm");
    const end = moment(selectedEndTime, "HH:mm");
    
    const duration = moment.duration(end.diff(start));
    const hours = duration.hours().toString().padStart(2, '0');
    const minutes = duration.minutes().toString().padStart(2, '0');
  
    return `${hours}:${minutes}`;
  };

  const calculateTotal = () => {
    if (!selectedStartTime || !selectedEndTime) return parkingSpot.hourlyRate.toFixed(2);

    const start = moment(selectedStartTime, "HH:mm");
    const end = moment(selectedEndTime, "HH:mm");
    
    const duration = moment.duration(end.diff(start));
    const totalHours = duration.asHours();

    return (totalHours * parkingSpot.hourlyRate).toFixed(2);
  };

  const confirmBooking = async () => {
    setLoading(true);
    try {
      // Prepare the data to be sent to the backend
      const bookingData = {
        parkingSpotId: parkingSpot._id,
        vehicleId: selectedVehicle._id,
        date: selectedDay.date.format("YYYY-MM-DD"),
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        duration: calculateDuration(),
        totalAmount: calculateTotal()
      };
   
      const response = await callconfirmBooking(bookingData)
      if(response.success){
        setSucessmsg(response.message)
        setQrurl(response.qrCodeUrl)
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
          <div className={`w-8 h-8 rounded-full flex items-center justify-center 
            ${step === stepNum ? 'bg-primary text-white' : 
             step > stepNum ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
            {stepNum}
          </div>
          {stepNum < 3 && (
            <div className={`w-8 h-1 mx-1 ${step > stepNum ? 'bg-green-100' : 'bg-gray-200'}`}></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
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
                <div className="grid grid-cols-2 gap-3">
                  {getAvailableDaysWithDates().map((day) => (
                    <button
                      key={day.dateString}
                      onClick={() => handleDaySelection(day)}
                      className={`p-3 border rounded-md text-center transition-colors
                        ${selectedDay?.dateString === day.dateString
                          ? "border-primary bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <div className="font-medium">{day.name}</div>
                      <div className="text-sm text-gray-600">{day.dateString}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {parkingSpot.availability.startTime} - {parkingSpot.availability.endTime}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedDay && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Select Time</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">From</label>
                      <select
                        value={selectedStartTime}
                        onChange={(e) => handleTimeChange("start", e.target.value)}
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
                      <label className="block text-sm font-medium mb-1">To</label>
                      <select
                        value={selectedEndTime}
                        onChange={(e) => handleTimeChange("end", e.target.value)}
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
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Your Vehicle</h3>
                  <button className="text-primary text-sm flex items-center">
                    <Icon name="Plus" size={16} className="mr-1" />
                    Add Vehicle
                  </button>
                </div>
                <div className="space-y-3">
                  {availableVehicles.map((vehicle) => (
                    <div
                      key={vehicle._id}
                      onClick={() => setSelectedVehicle(vehicle)}
                      className={`p-3 border rounded-md cursor-pointer transition-colors
                        ${selectedVehicle?._id === vehicle._id
                          ? "border-primary bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"}`}
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
                        {vehicle.color} • {vehicle.type} {vehicle.isElectric && "• Electric"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedDay && ( <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {calculateDuration()} @ ₹{parkingSpot.hourlyRate}/hour
                </div>
              </div>)}

              <button
                onClick={() => setStep(2)}
                disabled={!selectedDay || !selectedVehicle}
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
                    <span className="font-medium">{selectedDay?.dateString}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">
                      {selectedStartTime} - {selectedEndTime}
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
                  <span>₹{calculateTotal()}</span>
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
              <p className="text-gray-600">Your parking spot has been successfully booked.</p>
              
              <div className="bg-gray-50 p-4 rounded-md text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-medium">PSB-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{selectedDay?.dateString}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">
                    {selectedStartTime} - {selectedEndTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium">
                    {selectedVehicle?.brand} {selectedVehicle?.model}
                  </span>
                </div>
              </div>

              <div className="border border-dashed border-gray-300 rounded-md p-4">
                <div className="text-center mb-3">
                  <div className="text-sm text-gray-500 mb-1">Check-in QR Code</div>
                  <div className="inline-block p-2 bg-white">
                    <div className="w-32 h-32 bg-gray-100 flex items-center justify-center">
                      <img src={qrurl} alt="Booking QR Code" />
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

