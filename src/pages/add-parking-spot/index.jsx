import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import BackButton from "./components/BackButton";
import FormInput from "./components/FormInput";
import MapSelector from "./components/MapSelector";
import TimeRangeSelector from "./components/TimeRangeSelector";
import SubmitButton from "./components/SubmitButton";
import Icon from "../../components/AppIcon";
import { Mycontext } from "context/context";

const AddParkingSpot = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formData, setFormData] = useState({
    address: "",
    addressSuggestions: [],
    latitude: 40.7128,
    longitude: -74.0060,
    timeAvailability: {
      morning: false,
      afternoon: false,
      evening: false,
    },
    isCovered: null,
    size: null,
    hourlyRate: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const { token } = useContext(Mycontext);

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, address: value });

    // Mock address suggestions - would be replaced with actual API call
    if (value.length >= 3) {
      const mockSuggestions = [
        { id: 1, text: `${value} Main St, New York, NY` },
        { id: 2, text: `${value} Broadway, New York, NY` },
        { id: 3, text: `${value} 5th Avenue, New York, NY` },
      ];
      setFormData(prev => ({ ...prev, addressSuggestions: mockSuggestions }));
    } else {
      setFormData(prev => ({ ...prev, addressSuggestions: [] }));
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setFormData({
      ...formData,
      address: suggestion.text,
      addressSuggestions: [],
      // In a real app, we would get actual coordinates from geocoding API
      latitude: 40.7128 + (Math.random() * 0.02 - 0.01),
      longitude: -74.0060 + (Math.random() * 0.02 - 0.01),
    });
  };

  const handleMapPositionChange = (lat, lng) => {
    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng,
    });
  };

  const handleTimeAvailabilityChange = (timeSlot) => {
    setFormData({
      ...formData,
      timeAvailability: {
        ...formData.timeAvailability,
        [timeSlot]: !formData.timeAvailability[timeSlot],
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name === "hourlyRate") {
      // Only allow numbers and decimal point
      const regex = /^(\d+)?(\.\d{0,2})?$/;
      if (value === "" || regex.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
      return;
    }
    
    setFormData({
      ...formData,
      [name]: type === "radio" ? e.target.id : value,
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }
    
    if (!Object.values(formData.timeAvailability).some(value => value)) {
      errors.timeAvailability = "Please select at least one time slot";
    }
    
    if (formData.isCovered === null) {
      errors.isCovered = "Please select if the spot is covered or not";
    }
    
    if (formData.size === null) {
      errors.size = "Please select a size for your parking spot";
    }
    
    if (!formData.hourlyRate) {
      errors.hourlyRate = "Hourly rate is required";
    } else {
      const rate = parseFloat(formData.hourlyRate);
      if (isNaN(rate) || rate < 1 || rate > 50) {
        errors.hourlyRate = "Hourly rate must be between $1 and $50";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Simulate successful submission
      navigate("/my-parking-spots");
    } catch (error) {
      setSubmitError("Failed to add parking spot. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header variant="default" userLoggedIn={token} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <BackButton onClick={() => navigate(-1)} />
            <h1 className="text-3xl font-bold text-gray-900 mt-4">Add Your Parking Spot</h1>
            <p className="text-gray-600 mt-2">
              Rent out your unused parking space and earn money
            </p>
          </div>
          
          {submitError && (
            <div className="mb-6 p-4 bg-error bg-opacity-10 border border-error border-opacity-20 rounded-lg flex items-center">
              <Icon name="AlertCircle" size={20} className="text-error mr-3" />
              <div className="flex-1 text-error">{submitError}</div>
              <button 
                onClick={() => setSubmitError(null)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-6">
              {/* Location Section */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
                
                <div className="mb-4 relative">
                  <FormInput
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleAddressChange}
                    placeholder="Start typing your address..."
                    error={formErrors.address}
                    icon="MapPin"
                  />
                  
                  {formData.addressSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {formData.addressSuggestions.map(suggestion => (
                        <button
                          key={suggestion.id}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          onClick={() => handleSelectSuggestion(suggestion)}
                        >
                          <div className="flex items-center">
                            <Icon name="MapPin" size={16} className="text-gray-500 mr-2" />
                            <span>{suggestion.text}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="h-64 mb-4">
                  <MapSelector
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                    onPositionChange={handleMapPositionChange}
                  />
                </div>
                
                <p className="text-sm text-gray-500 italic">
                  Drag the pin to adjust the exact location of your parking spot
                </p>
              </section>
              
              {/* Availability Section */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability</h2>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    When is your parking spot available?
                  </label>
                  
                  <TimeRangeSelector
                    selected={formData.timeAvailability}
                    onChange={handleTimeAvailabilityChange}
                  />
                  
                  {formErrors.timeAvailability && (
                    <p className="mt-1 text-sm text-error">{formErrors.timeAvailability}</p>
                  )}
                </div>
              </section>
              
              {/* Spot Details Section */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Spot Details</h2>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Is the spot covered?</label>
                  
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isCovered"
                        id="covered"
                        checked={formData.isCovered === "covered"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-gray-700">Covered</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isCovered"
                        id="uncovered"
                        checked={formData.isCovered === "uncovered"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-gray-700">Uncovered</span>
                    </label>
                  </div>
                  
                  {formErrors.isCovered && (
                    <p className="mt-1 text-sm text-error">{formErrors.isCovered}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Size</label>
                  
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="size"
                        id="compact"
                        checked={formData.size === "compact"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-gray-700">Compact</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="size"
                        id="standard"
                        checked={formData.size === "standard"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-gray-700">Standard</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="size"
                        id="large"
                        checked={formData.size === "large"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-gray-700">Large</span>
                    </label>
                  </div>
                  
                  {formErrors.size && (
                    <p className="mt-1 text-sm text-error">{formErrors.size}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <FormInput
                    label="Hourly Rate ($)"
                    name="hourlyRate"
                    type="text"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    placeholder="15.00"
                    error={formErrors.hourlyRate}
                    icon="DollarSign"
                    inputMode="decimal"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Set a competitive rate between $1 and $50 per hour
                  </p>
                </div>
                
                <div className="mb-4">
                  <FormInput
                    label="Description (Optional)"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Add any additional details about your parking spot..."
                    multiline
                    rows={3}
                  />
                </div>
              </section>
              
              <div className="pt-4 border-t border-gray-200">
                <SubmitButton
                  isSubmitting={isSubmitting}
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </form>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ParkEase. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AddParkingSpot;