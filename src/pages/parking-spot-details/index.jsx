import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const { token,openSignUpModal } = useContext(Mycontext);
  const { id } = useParams(); 
  const [showBookingModal, setShowBookingModal] = useState(false);
  

 
  const fetchParkingSpotDetails = async () => {
    try {
      setLoading(true);
      const response = await findspotById(id) 
      setParkingSpot(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching parking spot details:", err);
      setError(err.response?.data?.message || "Failed to load parking spot details. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParkingSpotDetails();
  }, [id, token]);

  const handleBookNow = () => {
    if (!token) {
      openSignUpModal()
      return;
    }
    setShowBookingModal(true);
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
    fetchParkingSpotDetails(); 
  };

  const handleUnavailableSpot = () => {
    setSpotAvailable(parkingSpot.isAvailable);
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
              Sorry, this parking spot has been not available due to some issue check after some time.
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
                  <h1 className="text-xl font-semibold text-gray-900 mb-2">{parkingSpot.name}</h1>
                  <p className="text-gray-600 mb-4 flex items-start">
                    <Icon name="MapPin" size={18} className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                    <span>{parkingSpot.address}</span>
                  </p>
                  
                  <div className="flex flex-wrap items-center mb-2">
                    <div className="mr-6 ">
                      <span className="text-2xl font-bold text-gray-900">${parkingSpot.hourlyRate.toFixed(2)}</span>
                      <span className="text-gray-600 ml-1">/ hour</span>
                    </div>
                    {/* <div className="mb-2">
                      <span className="text-2xl font-bold text-gray-900">${parkingSpot.dailyRate.toFixed(2)}</span>
                      <span className="text-gray-600 ml-1">/ day</span>
                    </div> */}
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
                
                {/* <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
                </div> */}
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
                    isAvailable={parkingSpot.isAvailable}
                      onClick={handleBookNow}
                      onUnavailable={handleUnavailableSpot}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
         
         {showBookingModal && parkingSpot && (
          <BookingModal
            parkingSpot={parkingSpot}
            onClose={() => setShowBookingModal(false)}
          />
        )}
      </main>
    </div>
  );
};

export default ParkingSpotDetails;