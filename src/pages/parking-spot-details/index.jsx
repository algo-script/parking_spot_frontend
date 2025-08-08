// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import Icon from "../../components/AppIcon";
// import BackButton from "./components/BackButton";
// import MapPreview from "./components/MapPreview";
// import ActionButton from "./components/ActionButton";
// import OwnerInfo from "./components/OwnerInfo";
// import ParkingDetails from "./components/ParkingDetails";
// import Availability from "./components/Availability";
// import LoadingSpinner from "./components/LoadingSpinner";
// import ErrorMessage from "./components/ErrorMessage";
// import { Mycontext } from "context/context";

// const ParkingSpotDetails = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [parkingSpot, setParkingSpot] = useState(null);
//   const [spotAvailable, setSpotAvailable] = useState(true);
//   const navigate = useNavigate();
//   const { token } = useContext(Mycontext);

//   useEffect(() => {
//     // Simulate API call with a 2-second timeout
//     const fetchParkingSpotDetails = async () => {
//       try {
//         setLoading(true);
//         // Simulate network request
//         await new Promise((resolve) => setTimeout(resolve, 2000));
        
//         // Mock data for the parking spot
//         const mockParkingSpotData = {
//           id: "ps-12345",
//           name: "Downtown Secure Parking",
//           address: "123 Main Street, Downtown, New York, NY 10001",
//           description: "Covered parking spot in a secure garage with 24/7 access. Perfect for daily commuters or visitors to the downtown area.",
//           hourlyRate: 5.50,
//           dailyRate: 25.00,
//           coordinates: {
//             lat: 40.7128,
//             lng: -74.0060
//           },
//           availability: {
//             startTime: "07:00",
//             endTime: "22:00",
//             availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
//           },
//           features: {
//             covered: true,
//             secured: true,
//             cctv: true,
//             ev_charging: false,
//             height_restriction: "6.5 ft",
//             size: "Standard"
//           },
//           owner: {
//             id: "usr-789",
//             name: "Michael Johnson",
//             rating: 4.8,
//             reviewCount: 124,
//             joinedDate: "2021-05-15",
//             responseTime: "Within an hour",
//             avatar: "https://randomuser.me/api/portraits/men/32.jpg"
//           },
//           images: [
//             "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHBhcmtpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
//             "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGFya2luZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
//             "https://images.unsplash.com/photo-1604063155785-ee4488b8ad15?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHBhcmtpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
//           ],
//           reviews: [
//             {
//               id: "rev-123",
//               user: "Sarah M.",
//               rating: 5,
//               date: "2023-04-15",
//               comment: "Great spot! Easy to find and very convenient location."
//             },
//             {
//               id: "rev-124",
//               user: "David L.",
//               rating: 4,
//               date: "2023-03-22",
//               comment: "Good value for the area. The owner was very responsive."
//             }
//           ]
//         };
        
//         setParkingSpot(mockParkingSpotData);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching parking spot details:", err);
//         setError("Failed to load parking spot details. Please try again.");
//         setLoading(false);
//       }
//     };

//     fetchParkingSpotDetails();
//   }, []);

//   const handleBookNow = () => {
//     // In a real app, this would navigate to the booking page
//     alert("Booking functionality would be implemented here");
//   };

//   const handleOpenDirections = () => {
//     if (parkingSpot && parkingSpot.coordinates) {
//       const { lat, lng } = parkingSpot.coordinates;
//       // Open in native maps app
//       window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
//     }
//   };

//   const handleRetry = () => {
//     setError(null);
//     setLoading(true);
//     // Simulate refetching data
//     setTimeout(() => {
//       // Mock data for the parking spot (same as above)
//       const mockParkingSpotData = {
//         id: "ps-12345",
//         name: "Downtown Secure Parking",
//         address: "123 Main Street, Downtown, New York, NY 10001",
//         description: "Covered parking spot in a secure garage with 24/7 access. Perfect for daily commuters or visitors to the downtown area.",
//         hourlyRate: 5.50,
//         dailyRate: 25.00,
//         coordinates: {
//           lat: 40.7128,
//           lng: -74.0060
//         },
//         availability: {
//           startTime: "07:00",
//           endTime: "22:00",
//           availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
//         },
//         features: {
//           covered: true,
//           secured: true,
//           cctv: true,
//           ev_charging: false,
//           height_restriction: "6.5 ft",
//           size: "Standard"
//         },
//         owner: {
//           id: "usr-789",
//           name: "Michael Johnson",
//           rating: 4.8,
//           reviewCount: 124,
//           joinedDate: "2021-05-15",
//           responseTime: "Within an hour",
//           avatar: "https://randomuser.me/api/portraits/men/32.jpg"
//         },
//         images: [
//           "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHBhcmtpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
//           "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGFya2luZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
//           "https://images.unsplash.com/photo-1604063155785-ee4488b8ad15?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHBhcmtpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
//         ],
//         reviews: [
//           {
//             id: "rev-123",
//             user: "Sarah M.",
//             rating: 5,
//             date: "2023-04-15",
//             comment: "Great spot! Easy to find and very convenient location."
//           },
//           {
//             id: "rev-124",
//             user: "David L.",
//             rating: 4,
//             date: "2023-03-22",
//             comment: "Good value for the area. The owner was very responsive."
//           }
//         ]
//       };
      
//       setParkingSpot(mockParkingSpotData);
//       setLoading(false);
//     }, 2000);
//   };

//   const handleUnavailableSpot = () => {
//     setSpotAvailable(false);
//   };

//   const handleReturnToSearch = () => {
//     navigate('/');
//   };

//   // Render loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="container mx-auto px-4 py-8">
//           <BackButton />
//           <LoadingSpinner />
//         </div>
//       </div>
//     );
//   }

//   // Render error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="container mx-auto px-4 py-8">
//           <BackButton />
//           <ErrorMessage message={error} onRetry={handleRetry} />
//         </div>
//       </div>
//     );
//   }

//   // Render unavailable spot notification
//   if (!spotAvailable) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="container mx-auto px-4 py-8">
//           <BackButton />
//           <div className="bg-white rounded-lg shadow-md p-6 mt-4 text-center">
//             <Icon name="AlertTriangle" size={48} className="mx-auto text-warning mb-4" />
//             <h2 className="text-xl font-semibold text-gray-900 mb-2">Spot No Longer Available</h2>
//             <p className="text-gray-600 mb-6">
//               Sorry, this parking spot has been booked by someone else. Please return to search to find another spot.
//             </p>
//             <button
//               onClick={handleReturnToSearch}
//               className="btn btn-primary"
//             >
//               Return to Search
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
      
//       <main className="container mx-auto px-4 py-8">
//         <BackButton />
        
//         {parkingSpot && (
//           <div className="mt-4">
//             {/* Image Gallery */}
//             <div className="relative rounded-lg overflow-hidden h-64 md:h-96 mb-6">
//               <img
//                 src={parkingSpot.images[0]}
//                 alt={parkingSpot.name}
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   e.target.src = "/assets/images/no_image.png";
//                 }}
//               />
              
//               {/* Image Navigation */}
//               <div className="absolute bottom-4 right-4 flex space-x-2">
//                 {parkingSpot.images.map((_, index) => (
//                   <div 
//                     key={index} 
//                     className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-white bg-opacity-50'}`}
//                   />
//                 ))}
//               </div>
//             </div>
            
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               {/* Left Column - Spot Details */}
//               <div className="lg:col-span-2">
//                 <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//                   <h1 className="text-2xl font-semibold text-gray-900 mb-2">{parkingSpot.name}</h1>
//                   <p className="text-gray-600 mb-4 flex items-start">
//                     <Icon name="MapPin" size={18} className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
//                     <span>{parkingSpot.address}</span>
//                   </p>
                  
//                   <div className="flex flex-wrap items-center mb-6">
//                     <div className="mr-6 mb-2">
//                       <span className="text-2xl font-bold text-gray-900">${parkingSpot.hourlyRate.toFixed(2)}</span>
//                       <span className="text-gray-600 ml-1">/ hour</span>
//                     </div>
//                     <div className="mb-2">
//                       <span className="text-2xl font-bold text-gray-900">${parkingSpot.dailyRate.toFixed(2)}</span>
//                       <span className="text-gray-600 ml-1">/ day</span>
//                     </div>
//                   </div>
                  
//                   <p className="text-gray-700 mb-6">{parkingSpot.description}</p>
                  
//                   <OwnerInfo owner={parkingSpot.owner} />
//                 </div>
                
//                 <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//                   <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability</h2>
//                   <Availability availability={parkingSpot.availability} />
//                 </div>
                
//                 <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//                   <h2 className="text-xl font-semibold text-gray-900 mb-4">Parking Details</h2>
//                   <ParkingDetails features={parkingSpot.features} />
//                 </div>
                
//                 <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//                   <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
//                   <div className="flex items-center mb-4">
//                     <div className="flex items-center mr-2">
//                       {[1, 2, 3, 4, 5].map((star) => (
//                         <Icon 
//                           key={star}
//                           name={star <= Math.round(parkingSpot.owner.rating) ? "Star" : "StarHalf"} 
//                           size={20} 
//                           className={star <= Math.round(parkingSpot.owner.rating) ? "text-warning" : "text-gray-300"} 
//                         />
//                       ))}
//                     </div>
//                     <span className="text-gray-700 font-medium">{parkingSpot.owner.rating}</span>
//                     <span className="text-gray-500 ml-2">({parkingSpot.owner.reviewCount} reviews)</span>
//                   </div>
                  
//                   {parkingSpot.reviews.map((review) => (
//                     <div key={review.id} className="border-t border-gray-200 py-4">
//                       <div className="flex justify-between mb-2">
//                         <span className="font-medium text-gray-900">{review.user}</span>
//                         <span className="text-gray-500 text-sm">{review.date}</span>
//                       </div>
//                       <div className="flex items-center mb-2">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                           <Icon 
//                             key={star}
//                             name={star <= review.rating ? "Star" : "StarHalf"} 
//                             size={16} 
//                             className={star <= review.rating ? "text-warning" : "text-gray-300"} 
//                           />
//                         ))}
//                       </div>
//                       <p className="text-gray-700">{review.comment}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
              
             
//               <div className="lg:col-span-1">
//                 <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-6">
//                   <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
//                   <MapPreview 
//                     lat={parkingSpot.coordinates.lat} 
//                     lng={parkingSpot.coordinates.lng} 
//                     name={parkingSpot.name}
//                   />
                  
//                   <button
//                     onClick={handleOpenDirections}
//                     className="flex items-center justify-center w-full py-3 mt-4 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
//                   >
//                     <Icon name="Navigation" size={18} className="mr-2" />
//                     Get Directions
//                   </button>
                  
//                   <div className="mt-6">
//                     <ActionButton 
//                       onClick={handleBookNow}
//                       onUnavailable={handleUnavailableSpot}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ParkingSpotDetails;

import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
import Icon from "../../components/AppIcon";
import BackButton from "./components/BackButton";
import MapPreview from "./components/MapPreview";
import ActionButton from "./components/ActionButton";
import OwnerInfo from "./components/OwnerInfo";
import ParkingDetails from "./components/ParkingDetails";
import Availability from "./components/Availability";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import { Mycontext } from "context/context";
import { findspotById } from "utils/helperFunctions";
import BookingModal from "./components/BookingModal";

const ParkingSpotDetails = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parkingSpot, setParkingSpot] = useState(null);
  const [spotAvailable, setSpotAvailable] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const { token } = useContext(Mycontext);
  const { id } = useParams(); // Get parking spot ID from URL
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDates, setBookingDates] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().setHours(new Date().getHours() + 1)),
  });
  const [bookingType, setBookingType] = useState("hourly"); 

  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  // console.log("parkingSpot",parkingSpot);
  // console.log("parkingSpot.availability.availableDays",parkingSpot?.availability.availableDays);
  const fetchParkingSpotDetails = async () => {
    try {
      setLoading(true);
      const response = await findspotById(id)
      console.log(response)
      setParkingSpot(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching parking spot details:", err);
      setError(err.response?.data?.message || "Failed to load parking spot details. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log("useefect call",id)
    fetchParkingSpotDetails();
  }, [id, token]);

  const handleBookNow = () => {
    // alert("Booking functionality would be implemented here");
    if (!token) {
      navigate('/login', { state: { from: `/parking-spots/${id}` } });
      return;
    }
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async () => {
    try {
      setBookingError(null);
      const bookingData = {
        parkingSpotId: parkingSpot._id,
        startTime: bookingDates.startDate,
        endTime: bookingDates.endDate,
        bookingType,
        totalPrice: calculateTotalPrice(),
      };

      const response = await createBooking(bookingData, token);
      
      setBookingSuccess(true);
      setTimeout(() => {
        setShowBookingModal(false);
        navigate('/my-bookings');
      }, 2000);
    } catch (err) {
      console.error("Booking failed:", err);
      setBookingError(err.response?.data?.message || "Booking failed. Please try again.");
    }
  };

  const calculateTotalPrice = () => {
    if (!parkingSpot) return 0;
    
    const timeDiff = bookingDates.endDate - bookingDates.startDate;
    const hours = timeDiff / (1000 * 60 * 60);
    
    if (bookingType === "hourly") {
      return hours * parkingSpot.hourlyRate;
    } else {
      const days = Math.ceil(hours / 24);
      return days * parkingSpot.dailyRate;
    }
  };

  const handleOpenDirections = () => {
    if (parkingSpot && parkingSpot.coordinates) {
      const { lat, lng } = parkingSpot.coordinates;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchParkingSpotDetails(); // Re-fetch data
  };

  const handleUnavailableSpot = () => {
    setSpotAvailable(false);
  };

  const handleReturnToSearch = () => {
    navigate('/');
  };

 

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <BackButton />
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <BackButton />
          <ErrorMessage message={error} onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  if (!spotAvailable) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <BackButton />
          <div className="bg-white rounded-lg shadow-md p-6 mt-4 text-center">
            <Icon name="AlertTriangle" size={48} className="mx-auto text-warning mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Spot No Longer Available</h2>
            <p className="text-gray-600 mb-6">
              Sorry, this parking spot has been booked by someone else. Please return to search to find another spot.
            </p>
            <button
              onClick={handleReturnToSearch}
              className="btn btn-primary"
            >
              Return to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <BackButton />
        
        {parkingSpot && (
          <div className="mt-4">
            <div className="relative rounded-lg overflow-hidden h-64 md:h-96 mb-6">
              <img
                src={`${import.meta.env.VITE_APP_BASE_URL}/${parkingSpot.images[currentImageIndex]}`}
                alt={parkingSpot.name}
                className="w-full h-full object-cover"
                // onError={(e) => {
                //   e.target.src = "/assets/images/no_image.png";
                // }}
              />
              <div className="absolute bottom-4 right-4 flex space-x-2">
                {parkingSpot.images.map((_, index) => (
                  <div 
                    key={index} 
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-black' : 'bg-black bg-opacity-50'}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h1 className="text-2xl font-semibold text-gray-900 mb-2">{parkingSpot.name}</h1>
                  <p className="text-gray-600 mb-4 flex items-start">
                    <Icon name="MapPin" size={18} className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                    <span>{parkingSpot.address}</span>
                  </p>
                  
                  <div className="flex flex-wrap items-center mb-6">
                    <div className="mr-6 mb-2">
                      <span className="text-2xl font-bold text-gray-900">${parkingSpot.hourlyRate.toFixed(2)}</span>
                      <span className="text-gray-600 ml-1">/ hour</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-2xl font-bold text-gray-900">${parkingSpot.dailyRate.toFixed(2)}</span>
                      <span className="text-gray-600 ml-1">/ day</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6">{parkingSpot.description}</p>
                  
                  <OwnerInfo owner={parkingSpot.owner} />
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability</h2>
                  <Availability availability={parkingSpot.availability} />
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Parking Details</h2>
                  <ParkingDetails features={parkingSpot.features} />
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Icon 
                          key={star}
                          name={star <= Math.round(parkingSpot.owner.rating) ? "Star" : "StarHalf"} 
                          size={20} 
                          className={star <= Math.round(parkingSpot.owner.rating) ? "text-warning" : "text-gray-300"} 
                        />
                      ))}
                    </div>
                    <span className="text-gray-700 font-medium">{parkingSpot.owner.rating}</span>
                    <span className="text-gray-500 ml-2">({parkingSpot.owner.reviewCount} reviews)</span>
                  </div>
                  
                  {parkingSpot.reviews.map((review) => (
                    <div key={review.id} className="border-t border-gray-200 py-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-900">{review.user}</span>
                        <span className="text-gray-500 text-sm">{review.date}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Icon 
                            key={star}
                            name={star <= review.rating ? "Star" : "StarHalf"} 
                            size={16} 
                            className={star <= review.rating ? "text-warning" : "text-gray-300"} 
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
                  <MapPreview 
                    latitude={parkingSpot.coordinates.lat} 
                    longitude={parkingSpot.coordinates.lng} 
                    name={parkingSpot.name}
                  />
                  
                  <button
                    onClick={handleOpenDirections}
                    className="flex items-center justify-center w-full py-3 mt-4 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Icon name="Navigation" size={18} className="mr-2" />
                    Get Directions
                  </button>
                  
                  <div className="mt-6">
                    <ActionButton 
                      onClick={handleBookNow}
                      onUnavailable={handleUnavailableSpot}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
         {/* Booking Modal */}
         {showBookingModal && parkingSpot && (
          <BookingModal
            parkingSpot={parkingSpot}
            bookingDates={bookingDates}
            setBookingDates={setBookingDates}
            bookingType={bookingType}
            setBookingType={setBookingType}
            totalPrice={calculateTotalPrice()}
            onClose={() => setShowBookingModal(false)}
            onConfirm={handleConfirmBooking}
            error={bookingError}
            success={bookingSuccess}
          />
        )}
      </main>
    </div>
  );
};

export default ParkingSpotDetails;