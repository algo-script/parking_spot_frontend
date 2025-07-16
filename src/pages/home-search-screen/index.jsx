import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import MapView from "./components/MapView";
import SearchBar from "./components/SearchBar";
import FilterControls from "./components/FilterControls";
import ParkingSpotList from "./components/ParkingSpotList";
import Icon from "../../components/AppIcon";
import { Mycontext } from "context/context";

const HomeSearchScreen = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    startTime: "",
    endTime: "",
    maxPrice: 50,
  });
  const { token } = useContext(Mycontext);

  // Mock data for parking spots
  const mockParkingSpots = [
    {
      id: 1,
      name: "Downtown Secure Parking",
      address: "123 Main St, Downtown",
      lat: 37.7749,
      lng: -122.4194,
      hourlyRate: 8.50,
      availableFrom: "08:00",
      availableTo: "20:00",
      isAvailable: true,
      distance: 0.3,
      rating: 4.7,
      totalReviews: 124,
      amenities: ["Security Camera", "Covered", "EV Charging"],
      imageUrl: "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHBhcmtpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      name: "Central Park Garage",
      address: "456 Park Ave, Midtown",
      lat: 37.7833,
      lng: -122.4167,
      hourlyRate: 12.00,
      availableFrom: "06:00",
      availableTo: "22:00",
      isAvailable: true,
      distance: 0.7,
      rating: 4.2,
      totalReviews: 89,
      amenities: ["24/7 Access", "Security Guard", "Covered"],
      imageUrl: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGFya2luZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      name: "Riverside Parking Lot",
      address: "789 River Rd, Eastside",
      lat: 37.7691,
      lng: -122.4280,
      hourlyRate: 5.00,
      availableFrom: "09:00",
      availableTo: "18:00",
      isAvailable: false,
      distance: 1.2,
      rating: 3.8,
      totalReviews: 56,
      amenities: ["Open Air", "Wide Spaces"],
      imageUrl: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHBhcmtpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 4,
      name: "Tech Hub Parking",
      address: "101 Innovation Way, Tech District",
      lat: 37.7831,
      lng: -122.4100,
      hourlyRate: 10.00,
      availableFrom: "07:00",
      availableTo: "23:00",
      isAvailable: true,
      distance: 0.9,
      rating: 4.5,
      totalReviews: 112,
      amenities: ["EV Charging", "Security Camera", "Covered"],
      imageUrl: "https://images.unsplash.com/photo-1590674899484-13d6c7094a9f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHBhcmtpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 5,
      name: "Market Street Parking",
      address: "202 Market St, Financial District",
      lat: 37.7920,
      lng: -122.4060,
      hourlyRate: 15.00,
      availableFrom: "06:30",
      availableTo: "21:00",
      isAvailable: true,
      distance: 1.5,
      rating: 4.0,
      totalReviews: 78,
      amenities: ["Valet Service", "Car Wash", "Covered"],
      imageUrl: "https://images.unsplash.com/photo-1609587312208-cea54be969e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cGFya2luZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 6,
      name: "Neighborhood Spot",
      address: "303 Residential Lane, Suburbs",
      lat: 37.7680,
      lng: -122.4200,
      hourlyRate: 3.50,
      availableFrom: "10:00",
      availableTo: "19:00",
      isAvailable: true,
      distance: 2.1,
      rating: 4.3,
      totalReviews: 45,
      amenities: ["Residential", "Quiet Area"],
      imageUrl: "https://images.unsplash.com/photo-1604063155785-ee4488b8ad15?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cGFya2luZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
    }
  ];

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
            // Default location if geolocation fails
            setUserLocation({ lat: 37.7749, lng: -122.4194 });
          }
        );
      } else {
        setLocationError(true);
        // Default location if geolocation not supported
        setUserLocation({ lat: 37.7749, lng: -122.4194 });
      }
    };

    const fetchParkingSpots = () => {
      // Simulate API call with timeout
      setTimeout(() => {
        setParkingSpots(mockParkingSpots);
        setFilteredSpots(mockParkingSpots);
        setIsLoading(false);
      }, 1500);
    };

    fetchUserLocation();
    fetchParkingSpots();
  }, []);

  // Handle search query changes
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredSpots(parkingSpots);
      return;
    }

    const filtered = parkingSpots.filter(
      (spot) =>
        spot.name.toLowerCase().includes(query.toLowerCase()) ||
        spot.address.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSpots(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    
    let filtered = [...parkingSpots];
    
    // Filter by time if provided
    if (newFilters.startTime && newFilters.endTime) {
      filtered = filtered.filter(spot => {
        return spot.availableFrom <= newFilters.startTime && 
               spot.availableTo >= newFilters.endTime;
      });
    }
    
    // Filter by price
    if (newFilters.maxPrice) {
      filtered = filtered.filter(spot => spot.hourlyRate <= newFilters.maxPrice);
    }
    
    setFilteredSpots(filtered);
  };

  // Handle spot selection
  const handleSpotSelect = (spot) => {
    setSelectedSpot(spot);
  };

  // Handle spot click to navigate to details
  const handleSpotClick = (spotId) => {
    navigate(`/parking-spot-details?id=${spotId}`);
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
      <Header variant="default" userLoggedIn={token} />
      
      <main className="flex-1 container mx-auto px-4 py-4 md:py-6">
        <div className="mb-4">
          <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
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
                  parkingSpots={filteredSpots}
                  selectedSpot={selectedSpot}
                  onSpotSelect={handleSpotSelect}
                  onSpotClick={handleSpotClick}
                />
              )}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <ParkingSpotList 
              spots={filteredSpots}
              isLoading={isLoading}
              selectedSpot={selectedSpot}
              onSpotSelect={handleSpotSelect}
              onSpotClick={handleSpotClick}
            />
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">
                &copy; {new Date().getFullYear()} ParkEase. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-primary">
                <Icon name="HelpCircle" size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary">
                <Icon name="Settings" size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary">
                <Icon name="Info" size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeSearchScreen;