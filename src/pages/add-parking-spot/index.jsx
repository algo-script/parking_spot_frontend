import React, { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "./components/BackButton";
import FormInput from "./components/FormInput";
import MapSelector from "./components/MapSelector";
import SubmitButton from "./components/SubmitButton";
import Icon from "../../components/AppIcon";
import { Mycontext } from "context/context";
import { addParkingSpot, updateParkingSpot } from "utils/helperFunctions";
import { toast } from "react-toastify";
import TimeRangeSelector from "./components/TimeRangeSelector";

const AddParkingSpot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [spotId, setSpotId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    addressSuggestions: [],
    latitude: "", 
    longitude: "",
    timeAvailability: {
      morning: false,
      afternoon: false,
      evening: false,
      night: false,
    },
    isCovered: null,
    size: null,
    hourlyRate: "",
    description: "",
    images: [],
    availableDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
  });
  const [formErrors, setFormErrors] = useState({});
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { token } = useContext(Mycontext);
  const suggestionsRef = useRef(null);

  const OLA_MAPS_API_KEY = import.meta.env.VITE_APP_MAP_APIKEY; 

   // Close suggestions when clicking outside
   useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setIsInputFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  
  useEffect(() => {
    if(!location.state?.isEdit){
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));
        },
        (error) => {
          console.error("Geolocation error:", error.message);
          toast.error("Unable to fetch location. Using default coordinates.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );}
    if (location.state?.isEdit && location.state?.spotDetails) {
      setSpotId(location.state.spotDetails._id);
      loadSpotDetails(location.state.spotDetails);
    }
  }, []);

  const loadSpotDetails = (spotDetails) => {
    // Convert backend data to our form structure
      setFormData((prev) => ({
        ...prev,
        ...spotDetails,
        latitude: spotDetails.location?.coordinates[1] || 12.9716, 
        longitude: spotDetails.location?.coordinates[0] || 77.5946, 
        hourlyRate: spotDetails.hourlyRate?.toString() || "",
      
      }));
    // };
  };

  const handleAddressChange = async (e) => {
    const value = e.target.value;
    setFormData({ ...formData, address: value });
    setFormErrors((prev) => ({ ...prev, address: "" }));
    setSubmitError(null)
    const params = {
            input: encodeURIComponent(value),
            api_key: OLA_MAPS_API_KEY,
          };

                // Add location biasing only if userLocation is fully defined
      if (formData.latitude && formData.longitude ) {
        params.location = `${formData.latitude},${formData.longitude}`;
        console.log("userLocation in fetchSuggestions", formData.latitude,formData.longitude);
      } 
      else {
        console.log("Skipping location biasing: userLocation incomplete or null", formData.latitude);
      }

    if (value.length >= 3) {
      try {
        const response = await axios.get(
           "https://api.olamaps.io/places/v1/autocomplete",{ params }
        );
        const data = response.data;
        
        if (data.status === "ok" && data.predictions) {
          const suggestions = data.predictions.map((pred, index) => ({
            id: index,
            text: pred.description,
            place_id: pred.place_id,
            geometry: pred.geometry.location
          }));
          setFormData((prev) => ({ ...prev, addressSuggestions: suggestions }));
        } else {
          setFormData((prev) => ({ ...prev, addressSuggestions: [] }));
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
        setFormData((prev) => ({ ...prev, addressSuggestions: [] }));
      }
    } else {
      setFormData((prev) => ({ ...prev, addressSuggestions: [] }));
    }
  };

  const handleSelectSuggestion = async (suggestion) => {
    try {
        const { lat, lng } = suggestion.geometry
        setFormData({
          ...formData,
          address: suggestion.text,
          addressSuggestions: [],
          latitude: lat,
          longitude: lng,
        });
        setIsInputFocused(false);
     
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  const handleMapPositionChange = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleBlur = () => {
    // Use setTimeout to allow click event to register before hiding
    setTimeout(() => {
      setIsInputFocused(false);
    }, 200);
  };

  const handleTimeAvailabilityChange = (timeSlot) => {
    setSubmitError(null)
    setFormErrors((prev) => ({ ...prev, timeAvailability: "" }));
    setFormData({
      ...formData,
      timeAvailability: {
        morning: timeSlot === "morning",
        afternoon: timeSlot === "afternoon",
        evening: timeSlot === "evening",
        night: timeSlot === "night",
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitError(null)

    if (name === "hourlyRate") {
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

  const handleImageChange = (e) => {
    setFormErrors((prev) => ({ ...prev, images: "" }));
    setSubmitError(null);
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setFormErrors((prev) => ({
        ...prev,
        images: "You can upload a maximum of 3 images",
      }));
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );
    if (invalidFiles.length > 0) {
      setFormErrors((prev) => ({
        ...prev,
        images: "Only JPEG, JPG, and PNG images are allowed",
      }));
      return;
    }

    setFormErrors((prev) => ({ ...prev, images: "" }));
    setFormData({ ...formData, images: files });
  };

  const handleDayChange = (day) => {
    setFormErrors((prev) => ({ ...prev, availableDays: "" }));
    setSubmitError(null);
    setFormData({
      ...formData,
      availableDays: {
        ...formData.availableDays,
        [day]: !formData.availableDays[day],
      },
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Parking spot name is required";
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }
    const atLeastOneTimeSlotSelected = Object.values(
      formData.timeAvailability
    ).some((slot) => slot);
    if (!atLeastOneTimeSlotSelected) {
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
    // Check if at least one day is selected
    const atLeastOneDaySelected = Object.values(formData.availableDays).some(
      (day) => day
    );
    if (!atLeastOneDaySelected) {
      errors.availableDays = "Please select at least one available day";
    }

    if (formData.images.length === 0) {
      errors.images = "Please upload at least one image of your parking spot";
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
      const submissionData = new FormData();
      if(location.state?.isEdit){
        submissionData.append("spotId", spotId);
      }
      submissionData.append("name", formData.name);
      submissionData.append("address", formData.address);
      submissionData.append("location[type]", "Point");
      submissionData.append("location[coordinates][0]", formData.longitude); // longitude first
      submissionData.append("location[coordinates][1]", formData.latitude);
      submissionData.append("isCovered", formData.isCovered);
      submissionData.append("size", formData.size);
      submissionData.append("hourlyRate", formData.hourlyRate);
      submissionData.append("description", formData.description);
      formData.images.forEach((image, index) => {
        submissionData.append(`images[${index}]`, image);
      });
      if (!location.state?.isEdit) {
        Object.entries(formData.timeAvailability).forEach(
          ([slot, isAvailable]) => {
            submissionData.append(`timeAvailability[${slot}]`, isAvailable);
          }
        );
      }
      // Append available days
      Object.entries(formData.availableDays).forEach(([day, isAvailable]) => {
        submissionData.append(`availableDays[${day}]`, isAvailable);
      });
      // const response = await addParkingSpot(submissionData);
      let response;
      if (location.state?.isEdit) {
        response = await updateParkingSpot(submissionData);
      } else {
        response = await addParkingSpot(submissionData);
      }
      if (response.status) {
        toast.success(response.message);
        navigate("/my-parking-spots");
      } 
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
          error.message ||
          "Failed to add parking spot. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <BackButton onClick={() => navigate(-1)} />
            <h1 className="text-3xl font-bold text-gray-900 mt-4">
              {location.state?.isEdit ? "Edit Your Parking Spot" : "Add Your Parking Spot"}
            </h1>
            <p className="text-gray-600 mt-2">
              {location.state?.isEdit
                ? "Update your parking spot details"
                : "Rent out your unused parking space and earn money"}
            </p>
          </div>

          {submitError && (
            <div className="mb-6 p-4 bg-error bg-opacity-10 border border-error border-opacity-20 rounded-lg flex items-center">
              <Icon name="AlertCircle" size={20} className="text-error mr-3" />
              <div className="flex-1 text-error">{submitError}</div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="space-y-6">
              {/* Parking Spot Name */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  General
                </h2>
                <div className="mb-4">
                  <FormInput
                    label="Parking Spot Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Downtown Garage Spot"
                    error={formErrors.name}
                    icon="Tag"
                    required
                  />
                </div>
              </section>

              {/* Location Section */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Location
                </h2>
                <div className="mb-4 relative" ref={suggestionsRef}>
                  <FormInput
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleAddressChange}
                    placeholder="Start typing your address..."
                    onFocus={handleFocus}
                    // onBlur={handleBlur}
                    error={formErrors.address}
                    icon="MapPin"
                    required
                  />
                  {isInputFocused && formData.addressSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {formData.addressSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          onClick={() => handleSelectSuggestion(suggestion)}
                        >
                          <div className="flex items-center">
                            <Icon
                              name="MapPin"
                              size={16}
                              className="text-gray-500 mr-2"
                            />
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
                  Drag the map to adjust the exact location of your parking spot
                  (marker stays at center)
                </p>
              </section>

              {/* Availability Section */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Availability
                </h2>
                {!location.state?.isEdit && (
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Available Time Slots <span className="text-error">*</span>
                    </label>
                    <TimeRangeSelector
                      selected={formData.timeAvailability}
                      onChange={handleTimeAvailabilityChange}
                    />
                    {formErrors.timeAvailability && (
                      <p className="mt-1 text-sm text-error">
                        {formErrors.timeAvailability}
                      </p>
                    )}
                  </div>
                )}
                {/* Add this new Day Selection component */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Available Days <span className="text-error">*</span>
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {Object.keys(formData.availableDays).map((day) => (
                      <label key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.availableDays[day]}
                          onChange={() => handleDayChange(day)}
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="ml-2 text-gray-700 capitalize">
                          {day}
                        </span>
                      </label>
                    ))}
                  </div>
                  {formErrors.availableDays && (
                    <p className="mt-1 text-sm text-error">
                      {formErrors.availableDays}
                    </p>
                  )}
                </div>
              </section>

              {/* Spot Details Section */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Spot Details
                </h2>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Is the spot covered? <span className="text-error">*</span>
                  </label>
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
                    <p className="mt-1 text-sm text-error">
                      {formErrors.isCovered}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Size <span className="text-error">*</span>
                  </label>
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
                    required
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
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Upload Images <span className="text-error">*</span>
                    <span className="text-xs font-normal text-gray-500 ml-1">
                      (Max 3 images)
                    </span>
                  </label>

                  {/* File input with custom styling */}
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Icon
                          name="Upload"
                          size={24}
                          className="text-gray-400 mb-2"
                        />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          JPEG or PNG (Max 3MB each)
                        </p>
                      </div>
                      <input
                        type="file"
                        name="images"
                        accept="image/jpeg,image/png,image/jpg"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Error message */}
                  {formErrors.images && (
                    <p className="mt-2 text-sm text-error flex items-center">
                      {formErrors.images}
                    </p>
                  )}

                  {/* Image previews */}
                  {formData.images.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Selected Images ({formData.images.length}/3)
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                              {image instanceof File ? (
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Preview ${index + 1}`}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              ) : (
                              
                                <img
                                  src={`${import.meta.env.VITE_APP_BASE_URL}/${image}`} 
                                  alt={`Preview ${index + 1}`}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
              <div className="pt-4 border-t border-gray-200">
                <SubmitButton
                  isSubmitting={isSubmitting}
                  onClick={handleSubmit}
                  isEdit ={location.state?.isEdit}
                />
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddParkingSpot;
