// import React, { useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import BackButton from "./components/BackButton";
// import FormInput from "./components/FormInput";
// import MapSelector from "./components/MapSelector";
// import TimeRangeSelector from "./components/TimeRangeSelector";
// import SubmitButton from "./components/SubmitButton";
// import Icon from "../../components/AppIcon";
// import { Mycontext } from "context/context";
// import { addParkingSpot } from "utils/helperFunctions";
// import { toast } from "react-toastify";

// const AddParkingSpot = () => {
//   const navigate = useNavigate();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     address: "",
//     addressSuggestions: [],
//     latitude: 12.9716, // Default to Bangalore coordinates (fallback)
//     longitude: 77.5946,
//     timeAvailability: {
//       morning: false,
//       afternoon: false,
//       evening: false,
//     },
//     isCovered: null,
//     size: null,
//     hourlyRate: "",
//     description: "",
//     images: [],
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const { token } = useContext(Mycontext);
//     console.log(formData);

//   const OLA_MAPS_API_KEY = "Qb1tCYd0ghxhAyc3s1pB4AouMSrYYR8bf5X34TPE"; // Replace with your actual OlaMaps API key

//   // Fetch user's current location on component mount
//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setFormData((prev) => ({
//           ...prev,
//           latitude,
//           longitude,
//         }));
//         // Reverse geocode to set initial address
//         axios
//           .get("https://api.olamaps.io/places/v1/reverse-geocode", {
//             params: {
//               latlng: `${latitude},${longitude}`,
//               api_key: OLA_MAPS_API_KEY,
//             },
//           })
//           .then((res) => {
//             if (res.data.status === "ok" && res.data.results.length > 0) {
//               setFormData((prev) => ({
//                 ...prev,
//                 address: res.data.results[0].formatted_address,
//               }));
//             }
//           })
//           .catch((err) => {
//             console.error("Reverse geocoding failed:", err);
//           });
//       },
//       (error) => {
//         console.error("Geolocation error:", error.message);
//         // Keep fallback coordinates (Bangalore) if geolocation fails
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 0,
//       }
//     );
//   }, []);

//   const handleAddressChange = async (e) => {
//     const value = e.target.value;
//     setFormData({ ...formData, address: value });

//     if (value.length >= 3) {
//       try {
//         const response = await axios.get(
//           `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(
//             value
//           )}&api_key=${OLA_MAPS_API_KEY}`
//         );
//         const data = response.data;
//         if (data.status === "ok" && data.predictions) {
//           const suggestions = data.predictions.map((pred, index) => ({
//             id: index,
//             text: pred.description,
//             place_id: pred.place_id,
//           }));
//           setFormData((prev) => ({ ...prev, addressSuggestions: suggestions }));
//         } else {
//           setFormData((prev) => ({ ...prev, addressSuggestions: [] }));
//         }
//       } catch (error) {
//         console.error("Error fetching address suggestions:", error);
//         setFormData((prev) => ({ ...prev, addressSuggestions: [] }));
//       }
//     } else {
//       setFormData((prev) => ({ ...prev, addressSuggestions: [] }));
//     }
//   };

//   const handleSelectSuggestion = async (suggestion) => {
//     try {
//       const response = await axios.get(
//         `https://api.olamaps.io/places/v1/details?place_id=${suggestion.place_id}&api_key=${OLA_MAPS_API_KEY}`
//       );
//       const data = response.data;
//       if (data.status === "ok" && data.result.geometry) {
//         const { lat, lng } = data.result.geometry.location;
//         setFormData({
//           ...formData,
//           address: suggestion.text,
//           addressSuggestions: [],
//           latitude: lat,
//           longitude: lng,
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching place details:", error);
//     }
//   };

//   const handleMapPositionChange = (lat, lng) => {
//     setFormData({
//       ...formData,
//       latitude: lat,
//       longitude: lng,
//     });

//     // Reverse geocode to update address field
//     axios
//       .get("https://api.olamaps.io/places/v1/reverse-geocode", {
//         params: {
//           latlng: `${lat},${lng}`,
//           api_key: OLA_MAPS_API_KEY,
//         },
//       })
//       .then((res) => {
//         if (res.data.status === "ok" && res.data.results.length > 0) {
//           setFormData((prev) => ({
//             ...prev,
//             address: res.data.results[0].formatted_address,
//           }));
//         }
//       })
//       .catch((err) => {
//         console.error("Reverse geocoding failed:", err);
//       });
//   };

//   const handleTimeAvailabilityChange = (timeSlot) => {
//     setFormData({
//       ...formData,
//       timeAvailability: {
//         ...formData.timeAvailability,
//         [timeSlot]: !formData.timeAvailability[timeSlot],
//       },
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type } = e.target;

//     if (name === "hourlyRate") {
//       const regex = /^(\d+)?(\.\d{0,2})?$/;
//       if (value === "" || regex.test(value)) {
//         setFormData({ ...formData, [name]: value });
//       }
//       return;
//     }

//     setFormData({
//       ...formData,
//       [name]: type === "radio" ? e.target.id : value,
//     });
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 3) {
//       setFormErrors((prev) => ({
//         ...prev,
//         images: "You can upload a maximum of 3 images",
//       }));
//       return;
//     }

//     const validTypes = ["image/jpeg", "image/png", "image/jpg"];
//     const invalidFiles = files.filter((file) => !validTypes.includes(file.type));
//     if (invalidFiles.length > 0) {
//       setFormErrors((prev) => ({
//         ...prev,
//         images: "Only JPEG, JPG, and PNG images are allowed",
//       }));
//       return;
//     }

//     setFormErrors((prev) => ({ ...prev, images: null }));
//     setFormData({ ...formData, images: files });
//   };

//   const removeImage = (index) => {
//     setFormData({
//       ...formData,
//       images: formData.images.filter((_, i) => i !== index),
//     });
//   };

//   const validateForm = () => {
//     const errors = {};

//     if (!formData.name.trim()) {
//       errors.name = "Parking spot name is required";
//     }

//     if (!formData.address.trim()) {
//       errors.address = "Address is required";
//     }

//     if (!Object.values(formData.timeAvailability).some((value) => value)) {
//       errors.timeAvailability = "Please select at least one time slot";
//     }

//     if (formData.isCovered === null) {
//       errors.isCovered = "Please select if the spot is covered or not";
//     }

//     if (formData.size === null) {
//       errors.size = "Please select a size for your parking spot";
//     }

//     if (!formData.hourlyRate) {
//       errors.hourlyRate = "Hourly rate is required";
//     } else {
//       const rate = parseFloat(formData.hourlyRate);
//       if (isNaN(rate) || rate < 1 || rate > 50) {
//         errors.hourlyRate = "Hourly rate must be between $1 and $50";
//       }
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);
//     setSubmitError(null);

//     try {
//       const submissionData = new FormData();
//       submissionData.append("name", formData.name);
//       submissionData.append("address", formData.address);
//       submissionData.append("latitude", formData.latitude);
//       submissionData.append("longitude", formData.longitude);
//       submissionData.append("timeAvailability", JSON.stringify(formData.timeAvailability));
//       submissionData.append("isCovered", formData.isCovered);
//       submissionData.append("size", formData.size);
//       submissionData.append("hourlyRate", formData.hourlyRate);
//       submissionData.append("description", formData.description);
//       formData.images.forEach((image, index) => {
//         submissionData.append(`images[${index}]`, image);
//       });

//       const response = await addParkingSpot(submissionData);
//       if (response.status) {
//         toast.success(response.message);
//         navigate("/my-parking-spots");
//       } else {
//         throw new Error(response.message || "Failed to add parking spot");
//       }
//     } catch (error) {
//       setSubmitError(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to add parking spot. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <main className="flex-1 container mx-auto px-4 py-8">
//         <div className="max-w-3xl mx-auto">
//           <div className="mb-6">
//             <BackButton onClick={() => navigate(-1)} />
//             <h1 className="text-3xl font-bold text-gray-900 mt-4">Add Your Parking Spot</h1>
//             <p className="text-gray-600 mt-2">
//               Rent out your unused parking space and earn money
//             </p>
//           </div>

//           {submitError && (
//             <div className="mb-6 p-4 bg-error bg-opacity-10 border border-error border-opacity-20 rounded-lg flex items-center">
//               <Icon name="AlertCircle" size={20} className="text-error mr-3" />
//               <div className="flex-1 text-error">{submitError}</div>
//               <button
//                 onClick={() => setSubmitError(null)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <Icon name="X" size={20} />
//               </button>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
//             <div className="space-y-6">
//               {/* Parking Spot Name */}
//               <section>
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4">General</h2>
//                 <div className="mb-4">
//                   <FormInput
//                     label="Parking Spot Name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     placeholder="e.g., Downtown Garage Spot"
//                     error={formErrors.name}
//                     icon="Tag"
//                   />
//                 </div>
//               </section>

//               {/* Location Section */}
//               <section>
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
//                 <div className="mb-4 relative">
//                   <FormInput
//                     label="Address"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleAddressChange}
//                     placeholder="Start typing your address..."
//                     error={formErrors.address}
//                     icon="MapPin"
//                   />
//                   {formData.addressSuggestions.length > 0 && (
//                     <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                       {formData.addressSuggestions.map((suggestion) => (
//                         <button
//                           key={suggestion.id}
//                           type="button"
//                           className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
//                           onClick={() => handleSelectSuggestion(suggestion)}
//                         >
//                           <div className="flex items-center">
//                             <Icon name="MapPin" size={16} className="text-gray-500 mr-2" />
//                             <span>{suggestion.text}</span>
//                           </div>
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//                 <div className="h-64 mb-4">
//                   <MapSelector
//                     latitude={formData.latitude}
//                     longitude={formData.longitude}
//                     onPositionChange={handleMapPositionChange}
//                   />
//                 </div>
//                 <p className="text-sm text-gray-500 italic">
//                   Click on the map to adjust the exact location of your parking spot
//                 </p>
//               </section>

//               {/* Availability Section */}
//               <section>
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability</h2>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-2">
//                     When is your parking spot available?
//                   </label>
//                   <TimeRangeSelector
//                     selected={formData.timeAvailability}
//                     onChange={handleTimeAvailabilityChange}
//                   />
//                   {formErrors.timeAvailability && (
//                     <p className="mt-1 text-sm text-error">{formErrors.timeAvailability}</p>
//                   )}
//                 </div>
//               </section>

//               {/* Spot Details Section */}
//               <section>
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4">Spot Details</h2>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-2">Is the spot covered?</label>
//                   <div className="flex space-x-4">
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="isCovered"
//                         id="covered"
//                         checked={formData.isCovered === "covered"}
//                         onChange={handleInputChange}
//                         className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
//                       />
//                       <span className="ml-2 text-gray-700">Covered</span>
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="isCovered"
//                         id="uncovered"
//                         checked={formData.isCovered === "uncovered"}
//                         onChange={handleInputChange}
//                         className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
//                       />
//                       <span className="ml-2 text-gray-700">Uncovered</span>
//                     </label>
//                   </div>
//                   {formErrors.isCovered && (
//                     <p className="mt-1 text-sm text-error">{formErrors.isCovered}</p>
//                   )}
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-2">Size</label>
//                   <div className="flex flex-wrap gap-4">
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="size"
//                         id="compact"
//                         checked={formData.size === "compact"}
//                         onChange={handleInputChange}
//                         className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
//                       />
//                       <span className="ml-2 text-gray-700">Compact</span>
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="size"
//                         id="standard"
//                         checked={formData.size === "standard"}
//                         onChange={handleInputChange}
//                         className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
//                       />
//                       <span className="ml-2 text-gray-700">Standard</span>
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="size"
//                         id="large"
//                         checked={formData.size === "large"}
//                         onChange={handleInputChange}
//                         className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
//                       />
//                       <span className="ml-2 text-gray-700">Large</span>
//                     </label>
//                   </div>
//                   {formErrors.size && (
//                     <p className="mt-1 text-sm text-error">{formErrors.size}</p>
//                   )}
//                 </div>
//                 <div className="mb-4">
//                   <FormInput
//                     label="Hourly Rate ($)"
//                     name="hourlyRate"
//                     type="text"
//                     value={formData.hourlyRate}
//                     onChange={handleInputChange}
//                     placeholder="15.00"
//                     error={formErrors.hourlyRate}
//                     icon="DollarSign"
//                     inputMode="decimal"
//                   />
//                   <p className="mt-1 text-sm text-gray-500">
//                     Set a competitive rate between $1 and $50 per hour
//                   </p>
//                 </div>
//                 <div className="mb-4">
//                   <FormInput
//                     label="Description (Optional)"
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     placeholder="Add any additional details about your parking spot..."
//                     multiline
//                     rows={3}
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 mb-2">Upload Images (Up to 3)</label>
//                   <input
//                     type="file"
//                     name="images"
//                     accept="image/jpeg,image/png,image/jpg"
//                     multiple
//                     onChange={handleImageChange}
//                     className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
//                   />
//                   {formErrors.images && (
//                     <p className="mt-1 text-sm text-error">{formErrors.images}</p>
//                   )}
//                   {formData.images.length > 0 && (
//                     <div className="mt-2 flex flex-wrap gap-4">
//                       {formData.images.map((image, index) => (
//                         <div key={index} className="relative">
//                           <img
//                             src={URL.createObjectURL(image)}
//                             alt={`Preview ${index + 1}`}
//                             className="h-24 w-24 object-cover rounded-md"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => removeImage(index)}
//                             className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
//                           >
//                             <Icon name="X" size={16} />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                   <p className="mt-1 text-sm text-gray-500">
//                     Upload up to 3 images in JPEG or PNG format
//                   </p>
//                 </div>
//               </section>
//               <div className="pt-4 border-t border-gray-200">
//                 <SubmitButton isSubmitting={isSubmitting} onClick={handleSubmit} />
//               </div>
//             </div>
//           </form>
//         </div>
//       </main>
//       <footer className="bg-white border-t border-gray-200 py-6">
//         <div className="container mx-auto px-4">
//           <p className="text-center text-gray-500 text-sm">
//             © {new Date().getFullYear()} ParkEase. All rights reserved.
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default AddParkingSpot;

// const DateTimeRangePicker = ({ selected, onChange }) => {
//   const formatDateTimeForInput = (dateTime) => {
//     if (!dateTime) return "";
//     const date = new Date(dateTime);
//     const pad = (num) => String(num).padStart(2, "0");
//     const year = date.getFullYear();
//     const month = pad(date.getMonth() + 1);
//     const day = pad(date.getDate());
//     const hours = pad(date.getHours());
//     const minutes = pad(date.getMinutes());
//     return `${year}-${month}-${day}T${hours}:${minutes}`;
//   };

//   const handleChange = (e, type) => {
//     const value = e.target.value;
//     onChange(type, value);
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <div>
//         <label className="block text-gray-700 mb-1">
//           Start Date & Time <span className="text-error">*</span>
//         </label>
//         <input
//           type="datetime-local"
//           value={formatDateTimeForInput(selected.start)}
//           onChange={(e) => handleChange(e, "start")}
//           className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
//         />
//       </div>
//       <div>
//         <label className="block text-gray-700 mb-1">
//           End Date & Time <span className="text-error">*</span>
//         </label>
//         <input
//           type="datetime-local"
//           value={formatDateTimeForInput(selected.end)}
//           onChange={(e) => handleChange(e, "end")}
//           className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
//         />
//       </div>
//     </div>
//   );
// };

import React, { useContext, useState, useEffect } from "react";
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
  // const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  // const [isEdit, setIsEdit] = useState(false);
  const [spotId, setSpotId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    addressSuggestions: [],
    latitude: 12.9716, // Default to Bangalore coordinates (fallback)
    longitude: 77.5946,
    // timeAvailability: {
    //   start: "",
    //   end: "",
    // },
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
  const { token } = useContext(Mycontext);

  const OLA_MAPS_API_KEY = "Qb1tCYd0ghxhAyc3s1pB4AouMSrYYR8bf5X34TPE"; // Your OlaMaps API key
  console.log(formData);
  

  // Fetch user's current location on component mount
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
  }, []);
  // console.log("formData", formData);
  // console.log(location.state?.isEdit)
  // console.log(location.state?.spotDetails)
  // console.log(isEdit)
  useEffect(() => {
    if (location.state?.isEdit && location.state?.spotDetails) {
      // setIsEdit(true);
      setSpotId(location.state.spotDetails._id);
      loadSpotDetails(location.state.spotDetails);
    }
  }, []);

  const loadSpotDetails = (spotDetails) => {
    // Convert backend data to our form structure
    setFormData({
      name: spotDetails.name || "",
      address: spotDetails.address || "",
      addressSuggestions: [],
      latitude: spotDetails.location?.coordinates[1] || 12.9716, // latitude is second in coordinates array
      longitude: spotDetails.location?.coordinates[0] || 77.5946, // longitude is first
      timeAvailability: spotDetails.timeAvailability || {
        morning: false,
        afternoon: false,
        evening: false,
        night: false,
      },
      isCovered: spotDetails.isCovered || null,
      size: spotDetails.size || null,
      hourlyRate: spotDetails.hourlyRate?.toString() || "",
      description: spotDetails.description || "",
      images: spotDetails.images, // We'll handle existing images separately
      availableDays: spotDetails.availableDays || {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      },
    });
  };

  const handleAddressChange = async (e) => {
    const value = e.target.value;
    setFormData({ ...formData, address: value });

    if (value.length >= 3) {
      try {
        const response = await axios.get(
          `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(
            value
          )}&api_key=${OLA_MAPS_API_KEY}`
        );
        const data = response.data;
        if (data.status === "ok" && data.predictions) {
          const suggestions = data.predictions.map((pred, index) => ({
            id: index,
            text: pred.description,
            place_id: pred.place_id,
          }));
          setFormData((prev) => ({ ...prev, addressSuggestions: suggestions }));
        } else {
          setFormData((prev) => ({ ...prev, addressSuggestions: [] }));
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
        toast.error("Failed to fetch address suggestions.");
        setFormData((prev) => ({ ...prev, addressSuggestions: [] }));
      }
    } else {
      setFormData((prev) => ({ ...prev, addressSuggestions: [] }));
    }
  };

  const handleSelectSuggestion = async (suggestion) => {
    try {
      const response = await axios.get(
        `https://api.olamaps.io/places/v1/details?place_id=${suggestion.place_id}&api_key=${OLA_MAPS_API_KEY}`
      );
      const data = response.data;
      if (data.status === "ok" && data.result.geometry) {
        const { lat, lng } = data.result.geometry.location;
        setFormData({
          ...formData,
          address: suggestion.text,
          addressSuggestions: [],
          latitude: lat,
          longitude: lng,
        });
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
      toast.error("Failed to fetch place details.");
    }
  };

  const handleMapPositionChange = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
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
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setFormErrors((prev) => ({
        ...prev,
        images: "You can upload a maximum of 3 images",
      }));
      // toast.error("You can upload a maximum of 3 images.");
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
      toast.error("Only JPEG, JPG, and PNG images are allowed.");
      return;
    }

    setFormErrors((prev) => ({ ...prev, images: null }));
    setFormData({ ...formData, images: files });
  };

  const handleDayChange = (day) => {
    setFormData({
      ...formData,
      availableDays: {
        ...formData.availableDays,
        [day]: !formData.availableDays[day],
      },
    });
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
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

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the form errors before submitting.");
    }

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
      // submissionData.append(
      //   "timeAvailability[start]",
      //   formData.timeAvailability.start
      // );
      // submissionData.append(
      //   "timeAvailability[end]",
      //   formData.timeAvailability.end
      // );
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
        // Update existing spot
        response = await updateParkingSpot(submissionData);
      } else {
        // Create new spot
        response = await addParkingSpot(submissionData);
      }
      if (response.status) {
        toast.success(response.message);
        navigate("/my-parking-spots");
      } else {
        throw new Error(response.message || "Failed to add parking spot");
      }
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
          error.message ||
          "Failed to add parking spot. Please try again."
      );
      toast.error(
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
              <button
                onClick={() => setSubmitError(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Icon name="X" size={20} />
              </button>
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
                <div className="mb-4 relative">
                  <FormInput
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleAddressChange}
                    placeholder="Start typing your address..."
                    error={formErrors.address}
                    icon="MapPin"
                    required
                  />
                  {formData.addressSuggestions.length > 0 && (
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
                      <Icon name="AlertCircle" size={16} className="mr-1" />
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
                              {/* <img
                                src={URL.createObjectURL(image)}
                                alt={`Preview ${index + 1}`}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              /> */}
                              {image instanceof File ? (
                                // Newly uploaded image (File object)
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Preview ${index + 1}`}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              ) : (
                                // Existing image from database (URL/path string)
                                <img
                                  src={`http://localhost:5510/${image}`} // Adjust based on your data structure
                                  alt={`Preview ${index + 1}`}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              )}
                            </div>
                              {/* <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-error text-white rounded-full p-1 shadow-sm hover:bg-error-dark transition-colors duration-200"
                                aria-label="Remove image"
                              >
                                <Icon name="X" size={16} />
                              </button> */}
                            {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                              <p className="text-xs text-white truncate">
                                {image.name}
                              </p>
                              <p className="text-xs text-white/80">
                                {(image.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div> */}
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
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} ParkEase. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AddParkingSpot;
