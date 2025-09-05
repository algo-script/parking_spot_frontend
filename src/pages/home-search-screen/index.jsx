import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "./components/MapView";
import SearchBar from "./components/SearchBar";
import FilterControls from "./components/FilterControls";
import ParkingSpotList from "./components/ParkingSpotList";
import Icon from "../../components/AppIcon";
import { Mycontext } from "context/context";
import { nearByParking } from "utils/helperFunctions";

const HomeSearchScreen = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState(null);
  const [filters, setFilters] = useState({
    startTime: "",
    endTime: "",
    maxPrice: 50,
    selectedDate:""
  });
  const { token,country } = useContext(Mycontext);

 
  // Simulate fetching user location and parking spots
  useEffect(() => {
    const fetchUserLocation = () => {  
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setLocationError(false);
          },
          () => {          
            setLocationError(true);
            setUserLocation({ lat: 37.7749, lng: -122.4194 });
          }
        );
      } else {
        setLocationError(true);
        setUserLocation({ lat: 37.7749, lng: -122.4194 });
      }
    };

    fetchUserLocation();
  }, [token]);

  useEffect(()=>{
    const fetchData = async () => {
      try {
        const locationToUse = searchLocation || userLocation;
        
        if (locationToUse) {
          const response = await nearByParking({
            latitude: locationToUse.lat,
            longitude: locationToUse.lng,
            startTime: filters.startTime,
            endTime: filters.endTime,
            maxPrice: filters.maxPrice,
            selectedDate: filters.selectedDate
          });
          if(response.success){
            setIsLoading(false);
            setParkingSpots(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching parking spots:", error);
      }
    };
    if(country){
      fetchData();
    }
    
  },[userLocation,searchLocation,filters,country])


  // Handle search query changes
  const handleSearch = (query) => {
    setSearchQuery(query.query);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle spot click to navigate to details
  const handleSpotClick = (spot) => {
    navigate(`/parking-spot-details/${spot}`);
  };

  // Handle retry when location services fail
  const handleRetryLocation = () => {
    setIsLoading(true);
    setLocationError(false);
    
    if (navigator.geolocation) {
      
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(false);
          setIsLoading(false);
        },
        () => {
          setLocationError(true);
          setUserLocation({ lat: 37.7749, lng: -122.4194 });
          setIsLoading(false);
        }
      );
    } else {
      setLocationError(true);
      setUserLocation({ lat: 37.7749, lng: -122.4194 });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      <div className="flex-1 container mx-auto px-4 py-4 md:py-6">
        <div className="mb-4">
          <SearchBar onSearch={handleSearch} initialValue={searchQuery} setUserLocation={setUserLocation} userLocation={userLocation}  setSearchLocation={setSearchLocation}  searchLocation={searchLocation}/>
        </div>
        
        <div className="mb-4">
          <FilterControls filters={filters} onFilterChange={handleFilterChange} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-[400px] md:h-[500px] relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <Icon name="Loader" size={32} className="animate-spin mx-auto text-primary mb-2" />
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                </div>
              ) : locationError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center p-6">
                    <Icon name="AlertTriangle" size={32} className="mx-auto text-warning mb-2" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Location services unavailable</h3>
                    <p className="text-gray-600 mb-4">We couldn't access your location. Please check your browser settings and try again.</p>
                    <button 
                      onClick={handleRetryLocation}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : (
                <MapView 
                  userLocation={userLocation} 
                  parkingSpots={parkingSpots}
                  setUserLocation={setUserLocation}
                  onSpotClick={handleSpotClick}
                  searchLocation={searchLocation}
                 
                />
              )}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <ParkingSpotList 
              spots={parkingSpots}
              isLoading={isLoading}
              onSpotClick={handleSpotClick}
            />
          </div>
        </div>
      </div>
      
    
    </div>
  );
};

export default HomeSearchScreen;
