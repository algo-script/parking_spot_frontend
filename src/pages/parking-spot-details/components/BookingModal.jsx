import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import { useNavigate } from "react-router-dom";

const BookingModal = ({ parkingSpot, onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [bookingDetails, setBookingDetails] = useState({
    dateRange: {
      start: new Date(),
      end: new Date(Date.now() + 60 * 60 * 1000) // Default 1 hour
    },
    vehicle: null,
    paymentMethod: "wallet",
    promoCode: "",
    confirmed: false
  });
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [realTimeAvailability, setRealTimeAvailability] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch user's vehicles from profile
  useEffect(() => {
    // Mock API call
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        const mockVehicles = [
          { id: "v1", plate: "ABC123", make: "Toyota", model: "Camry", color: "Blue", isDefault: true },
          { id: "v2", plate: "XYZ789", make: "Honda", model: "Civic", color: "Red", isDefault: false }
        ];
        setAvailableVehicles(mockVehicles);
        setBookingDetails(prev => ({
          ...prev,
          vehicle: mockVehicles.find(v => v.isDefault) || mockVehicles[0]
        }));
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleDateChange = (type, value) => {
    setBookingDetails(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [type]: new Date(value)
      }
    }));
  };

  const handleVehicleChange = (vehicle) => {
    setBookingDetails(prev => ({ ...prev, vehicle }));
  };

  const handlePaymentMethodChange = (method) => {
    setBookingDetails(prev => ({ ...prev, paymentMethod: method }));
  };

  const handlePromoCodeChange = (e) => {
    setBookingDetails(prev => ({ ...prev, promoCode: e.target.value }));
  };

  const checkAvailability = async () => {
    setLoading(true);
    try {
      // Mock availability check
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRealTimeAvailability(true);
      setStep(2);
    } catch (error) {
      console.error("Availability check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = async () => {
    setLoading(true);
    try {
      // Mock booking confirmation
      await new Promise(resolve => setTimeout(resolve, 1500));
      setBookingDetails(prev => ({ ...prev, confirmed: true }));
      setStep(3);
      
      // In real app, would navigate to booking confirmation page
      // navigate(`/bookings/confirmation/${bookingId}`);
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = () => {
    const diff = bookingDetails.dateRange.end - bookingDetails.dateRange.start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
  };

  const calculateTotal = () => {
    const hours = (bookingDetails.dateRange.end - bookingDetails.dateRange.start) / (1000 * 60 * 60);
    return (hours * parkingSpot.hourlyRate).toFixed(2);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header with step indicator */}
          <div className="flex justify-between items-center mb-6">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <Icon name="X" size={24} />
            </button>
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-8 h-8 rounded-full flex items-center justify-center 
                    ${step === stepNum ? 'bg-primary text-white' : 
                     step > stepNum ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}
                >
                  {stepNum}
                </div>
              ))}
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Select Date & Time</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <input
                    type="datetime-local"
                    value={bookingDetails.dateRange.start.toISOString().slice(0, 16)}
                    onChange={(e) => handleDateChange('start', e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input
                    type="datetime-local"
                    value={bookingDetails.dateRange.end.toISOString().slice(0, 16)}
                    onChange={(e) => handleDateChange('end', e.target.value)}
                    min={new Date(bookingDetails.dateRange.start.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your Vehicle</h3>
                <div className="space-y-3">
                  {availableVehicles.map(vehicle => (
                    <div 
                      key={vehicle.id}
                      onClick={() => handleVehicleChange(vehicle)}
                      className={`p-3 border rounded-md cursor-pointer transition-colors
                        ${bookingDetails.vehicle?.id === vehicle.id ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{vehicle.make} {vehicle.model}</span>
                        {vehicle.isDefault && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Default</span>}
                      </div>
                      <div className="text-sm text-gray-600">{vehicle.plate} • {vehicle.color}</div>
                    </div>
                  ))}
                  <button className="text-primary flex items-center text-sm mt-2">
                    <Icon name="Plus" size={16} className="mr-1" />
                    Add another vehicle
                  </button>
                </div>
              </div>

              <button
                onClick={checkAvailability}
                disabled={loading}
                className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center justify-center"
              >
                {loading ? 'Checking availability...' : 'Continue to Payment'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Payment</h2>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Selected time:</span>
                  <span className="font-medium">
                    {formatDate(bookingDetails.dateRange.start)} - {formatDate(bookingDetails.dateRange.end)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{calculateDuration()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium">
                    {bookingDetails.vehicle?.make} {bookingDetails.vehicle?.model} ({bookingDetails.vehicle?.plate})
                  </span>
                </div>
                <div className="border-t border-gray-200 my-3"></div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${calculateTotal()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Service Fee:</span>
                  <span className="font-medium">${(calculateTotal() * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>${(calculateTotal() * 1.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
                <div className="space-y-3">
                  <div 
                    onClick={() => handlePaymentMethodChange("wallet")}
                    className={`p-3 border rounded-md cursor-pointer transition-colors
                      ${bookingDetails.paymentMethod === "wallet" ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center">
                      <Icon name="Wallet" size={20} className="mr-3 text-primary" />
                      <div>
                        <div className="font-medium">Wallet</div>
                        <div className="text-sm text-gray-600">Balance: $125.00</div>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => handlePaymentMethodChange("card")}
                    className={`p-3 border rounded-md cursor-pointer transition-colors
                      ${bookingDetails.paymentMethod === "card" ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center">
                      <Icon name="CreditCard" size={20} className="mr-3 text-primary" />
                      <div>
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-gray-600">Visa •••• 4242</div>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => handlePaymentMethodChange("new_card")}
                    className={`p-3 border rounded-md cursor-pointer transition-colors
                      ${bookingDetails.paymentMethod === "new_card" ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center">
                      <Icon name="Plus" size={20} className="mr-3 text-primary" />
                      <div className="font-medium">Add new card</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Promo Code</h3>
                <div className="flex">
                  <input
                    type="text"
                    value={bookingDetails.promoCode}
                    onChange={handlePromoCodeChange}
                    placeholder="Enter promo code"
                    className="flex-1 p-3 border border-gray-300 rounded-l-md"
                  />
                  <button className="bg-gray-100 text-gray-700 px-4 rounded-r-md border border-l-0 border-gray-300 hover:bg-gray-200">
                    Apply
                  </button>
                </div>
              </div>

              <button
                onClick={confirmBooking}
                disabled={loading || !realTimeAvailability}
                className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center justify-center"
              >
                {loading ? 'Processing...' : 'Confirm & Pay'}
              </button>

              {!realTimeAvailability && (
                <div className="text-red-500 text-sm text-center">
                  This spot is no longer available for the selected time. Please choose a different time.
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <Icon name="Check" size={32} className="text-green-600" />
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900">Booking Confirmed!</h2>
              <p className="text-gray-600">Your parking spot has been successfully booked.</p>
              
              <div className="bg-gray-50 p-4 rounded-md text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-medium">PSB-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium text-right">{parkingSpot.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">
                    {formatDate(bookingDetails.dateRange.start)} - {formatDate(bookingDetails.dateRange.end)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium">
                    {bookingDetails.vehicle?.make} {bookingDetails.vehicle?.model}
                  </span>
                </div>
              </div>

              <div className="border border-dashed border-gray-300 rounded-md p-4">
                <div className="text-center mb-3">
                  <div className="text-sm text-gray-500 mb-1">Check-in QR Code</div>
                  <div className="inline-block p-2 bg-white">
                    {/* Placeholder for QR code */}
                    <div className="w-32 h-32 bg-gray-100 flex items-center justify-center">
                      <Icon name="QrCode" size={48} className="text-gray-400" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Show this QR code at the entrance for access. You'll also receive it via email.
                </p>
              </div>

              <div className="text-sm text-gray-500">
                <p className="mb-2">Cancellation policy: Full refund if canceled at least 2 hours before booking time.</p>
                <p>Need help? <a href="#" className="text-primary">Contact support</a></p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
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