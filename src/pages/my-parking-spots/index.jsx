import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Header from "../../components/ui/Header";
import TabSelector from "./components/TabSelector";
import ParkingSpotCard from "./components/ParkingSpotCard";
import EmptyState from "./components/EmptyState";
import { Mycontext } from "context/context";

const MyParkingSpots = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("owner"); // "owner" or "renter"
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [ownerSpots, setOwnerSpots] = useState([]);
  const [renterBookings, setRenterBookings] = useState([]);
  const { token } = useContext(Mycontext);

  // Mock data for parking spots owned by the user
  const mockOwnerSpots = [
    {
      id: "spot1",
      address: "123 Main Street, Downtown",
      description: "Covered parking spot in secure garage",
      price: 5.50,
      priceUnit: "hour",
      isAvailable: true,
      availableTimeStart: "08:00",
      availableTimeEnd: "18:00",
      image: "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHBhcmtpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      location: {
        lat: 40.7128,
        lng: -74.0060
      },
      upcomingBookings: [
        {
          id: "booking1",
          userName: "Alice Johnson",
          startTime: "2023-06-15T14:00:00",
          endTime: "2023-06-15T16:00:00",
          totalAmount: 11.00
        }
      ]
    },
    {
      id: "spot2",
      address: "456 Park Avenue, Midtown",
      description: "Outdoor parking spot with easy access",
      price: 4.00,
      priceUnit: "hour",
      isAvailable: false,
      availableTimeStart: "09:00",
      availableTimeEnd: "20:00",
      image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHBhcmtpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      location: {
        lat: 40.7484,
        lng: -73.9857
      },
      upcomingBookings: []
    },
    {
      id: "spot3",
      address: "789 Broadway, Theater District",
      description: "Premium spot near major attractions",
      price: 7.25,
      priceUnit: "hour",
      isAvailable: true,
      availableTimeStart: "07:00",
      availableTimeEnd: "23:00",
      image: "https://images.pexels.com/photos/1004665/pexels-photo-1004665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      location: {
        lat: 40.7589,
        lng: -73.9851
      },
      upcomingBookings: [
        {
          id: "booking2",
          userName: "Bob Smith",
          startTime: "2023-06-16T09:00:00",
          endTime: "2023-06-16T11:30:00",
          totalAmount: 18.13
        },
        {
          id: "booking3",
          userName: "Carol Davis",
          startTime: "2023-06-16T13:00:00",
          endTime: "2023-06-16T14:30:00",
          totalAmount: 10.88
        }
      ]
    }
  ];

  // Mock data for bookings made by the user
  const mockRenterBookings = [
    {
      id: "booking4",
      spotId: "spot4",
      address: "321 Fifth Avenue, Shopping District",
      ownerName: "David Wilson",
      startTime: "2023-06-17T10:00:00",
      endTime: "2023-06-17T12:00:00",
      totalAmount: 12.00,
      status: "upcoming",
      image: "https://images.pixabay.com/photo/2016/11/23/17/56/car-park-1854191_1280.jpg",
      location: {
        lat: 40.7484,
        lng: -73.9857
      }
    },
    {
      id: "booking5",
      spotId: "spot5",
      address: "987 Lexington Avenue, Upper East Side",
      ownerName: "Emma Brown",
      startTime: "2023-06-14T15:00:00",
      endTime: "2023-06-14T17:30:00",
      totalAmount: 15.75,
      status: "completed",
      image: "https://images.pexels.com/photos/1004665/pexels-photo-1004665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      location: {
        lat: 40.7731,
        lng: -73.9712
      }
    },
    {
      id: "booking6",
      spotId: "spot6",
      address: "654 Madison Avenue, Luxury District",
      ownerName: "Frank Miller",
      startTime: "2023-06-18T09:00:00",
      endTime: "2023-06-18T14:00:00",
      totalAmount: 25.00,
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHBhcmtpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      location: {
        lat: 40.7677,
        lng: -73.9718
      }
    }
  ];

  // Simulate API call to fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set mock data
        setOwnerSpots(mockOwnerSpots);
        setRenterBookings(mockRenterBookings);
      } catch (err) {
        setError("Failed to load your parking spots. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle pull-to-refresh functionality
  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    setError(null);
    
    try {
      // Simulate network delay (2 seconds as specified)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh data (in a real app, this would re-fetch from API)
      setOwnerSpots([...mockOwnerSpots]);
      setRenterBookings([...mockRenterBookings]);
    } catch (err) {
      setError("Failed to refresh data. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle toggling parking spot availability
  const handleToggleAvailability = (spotId, isAvailable) => {
    setOwnerSpots(prevSpots => 
      prevSpots.map(spot => 
        spot.id === spotId ? { ...spot, isAvailable } : spot
      )
    );
  };

  // Handle updating time window for a parking spot
  const handleUpdateTimeWindow = (spotId, startTime, endTime) => {
    setOwnerSpots(prevSpots => 
      prevSpots.map(spot => 
        spot.id === spotId ? { ...spot, availableTimeStart: startTime, availableTimeEnd: endTime } : spot
      )
    );
  };

  // Navigate to add parking spot page
  const handleAddParkingSpot = () => {
    navigate("/add-parking-spot");
  };

  // Navigate to find parking page
  const handleFindParking = () => {
    navigate("/home-search-screen");
  };

  // Handle retry when error occurs
  const handleRetry = () => {
    if (isRefreshing) return;
    handleRefresh();
  };

  // Render content based on user type and data state
  const renderContent = () => {
    // Show loading state
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin mb-4">
            <Icon name="Loader" size={48} color="var(--color-primary)" />
          </div>
          <p className="text-gray-500">Loading your parking spots...</p>
        </div>
      );
    }

    // Show error state
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-error mb-4">
            <Icon name="AlertCircle" size={48} />
          </div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={handleRetry}
            className="btn btn-primary flex items-center"
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <Icon name="Loader" size={16} className="mr-2 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Retry
              </>
            )}
          </button>
        </div>
      );
    }

    // Show owner content
    if (userType === "owner") {
      return ownerSpots.length > 0 ? (
        <div className="space-y-4">
          {ownerSpots.map(spot => (
            <ParkingSpotCard
              key={spot.id}
              spot={spot}
              userType="owner"
              onToggleAvailability={handleToggleAvailability}
              onUpdateTimeWindow={handleUpdateTimeWindow}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          userType="owner"
          onAddParkingSpot={handleAddParkingSpot}
        />
      );
    }

    // Show renter content
    return renterBookings.length > 0 ? (
      <div className="space-y-4">
        {renterBookings.map(booking => (
          <ParkingSpotCard
            key={booking.id}
            booking={booking}
            userType="renter"
          />
        ))}
      </div>
    ) : (
      <EmptyState
        userType="renter"
        onFindParking={handleFindParking}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        variant="default"
        userLoggedIn={token}
        userName="Alex Morgan"
      />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Parking Spots</h1>
          
          {/* Refresh button */}
          <button 
            onClick={handleRefresh}
            className="flex items-center text-primary hover:text-primary-dark"
            disabled={isRefreshing || isLoading}
          >
            <Icon 
              name="RefreshCw" 
              size={16} 
              className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} 
            />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        {/* Tab selector for switching between owner and renter views */}
        <TabSelector 
          activeTab={userType}
          onTabChange={setUserType}
        />
        
        {/* Pull-to-refresh indicator */}
        {isRefreshing && !isLoading && (
          <div className="flex items-center justify-center py-2 text-primary text-sm">
            <Icon name="Loader" size={16} className="animate-spin mr-2" />
            Refreshing data...
          </div>
        )}
        
        {/* Main content area */}
        <div className="mt-4">
          {renderContent()}
        </div>
        
        {/* Add parking spot button (only for owners) */}
        {userType === "owner" && ownerSpots.length > 0 && (
          <div className="fixed bottom-6 right-6">
            <button 
              onClick={handleAddParkingSpot}
              className="btn btn-primary rounded-full shadow-lg flex items-center justify-center w-14 h-14"
              aria-label="Add parking spot"
            >
              <Icon name="Plus" size={24} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyParkingSpots;