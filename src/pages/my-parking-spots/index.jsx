import React, { useState, useEffect, useContext, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import TabSelector from "./components/TabSelector";
import ParkingSpotCard from "./components/ParkingSpotCard";
import EmptyState from "./components/EmptyState";
import { Mycontext } from "context/context";
import {
  cancelBooking,
  getMyParkingSpot,
  getuserBooking,
  toggleAvailability,
  updateParkingSpotTimeAvailability,
} from "utils/helperFunctions";
import { toast } from "react-toastify";

const MyParkingSpots = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userType, setUserType] = useState(location.pathname === "/my-parking-spots" ? "owner" : "renter");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [ownerSpots, setOwnerSpots] = useState([]);
  const [renterBookings, setRenterBookings] = useState([]);
  const { token } = useContext(Mycontext);
  

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if(userType==="owner"){
        const spotsResponse = await getMyParkingSpot();    
        setOwnerSpots(spotsResponse.data);
      }else{
      const bookingResponse = await getuserBooking()
      setRenterBookings(bookingResponse.data); 
      }
    
     
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to load your parking spots. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(()=>{
    setUserType(location.pathname === "/my-parking-spots" ? "owner" : "renter")
},[location.pathname])
  useEffect(() => {
    fetchData();
  }, [userType]);
 

  const handleRefresh =  () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    setError(null);

    try {
      fetchData()
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to refresh data. Please try again."
      );
    } finally {
      setIsRefreshing(false);
    }
  }

  const handleTabChange = (newUserType) => {
    if (newUserType !== userType) {
      setUserType(newUserType);
      // Navigate to the appropriate route based on the new userType
      const newPath = newUserType === "owner" ? "/my-parking-spots" : "/my-booking";
      if (location.pathname !== newPath) {
        navigate(newPath);
      }
    }
  };

  const handleToggleAvailability = async (spotId, isAvailable) => {
    try {
      const response = await toggleAvailability({spotId, isAvailable})
      if(response.status){
        toast.success(response.message)
        setOwnerSpots((prevSpots) =>
          prevSpots.map((spot) =>
            spot._id === spotId ? { ...spot, isAvailable } : spot
          )
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to update parking spot availability."
      );
    }
  }


  const handleUpdateTimeWindow = async (spotId, start, end) => {
    try {
      const currentSpot = ownerSpots.find((spot) => spot._id === spotId);
      if (!currentSpot) {
        console.error("Spot not found");
        return;
      }
      const currentStart = currentSpot.timeAvailability.start
      const currentEnd = currentSpot.timeAvailability.end
      if (currentStart === start && currentEnd === end) {
        return;
      }

      const response = await updateParkingSpotTimeAvailability({
        spotId,
        start,
        end,
      });
      if (response.status) {
      // Update local state with new time availability
      setOwnerSpots(prevSpots =>
        prevSpots.map(spot =>
          spot._id === spotId
            ? {
                ...spot,
                timeAvailability: {
                  ...spot.timeAvailability,
                  start: start,
                  end: end
                }
              }
            : spot
        )
      );
      }
    } catch (err) {
      console.log(err)
      setError(
        err.response?.data?.error || "Failed to update time availability."
      );
    }
  };


  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await cancelBooking(bookingId)
      if (response.success) {
        toast.error(response.message);
        fetchData(); 
      }
    } catch (error) {
      console.error("Cancellation failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to cancel booking"
      );
    }
  };

  const handleAddParkingSpot = () => {
    navigate("/add-parking-spot");
  };

  const handleFindParking = () => {
    navigate("/");
  };

  const handleRetry = () => {
    if (isRefreshing) return;
    handleRefresh();
  };

  const renderContent = () => {
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

    if (userType === "owner") {
      return ownerSpots.length > 0 ? (
        <div className="space-y-4">
          {ownerSpots.map((spot) => (
            <ParkingSpotCard
              key={spot._id}
              spot={spot}
              userType="owner"
              onToggleAvailability={handleToggleAvailability}
              onUpdateTimeWindow={handleUpdateTimeWindow}
             
            />
          ))}
        </div>
      ) : (
        <EmptyState userType="owner" onAddParkingSpot={handleAddParkingSpot} />
      );
    }

    return renterBookings.length > 0 ? (
      <div className="space-y-4">
        {renterBookings.map((booking) => (
          <ParkingSpotCard
            key={booking._id}
            booking={booking}
            userType="renter"
            onCancelBooking={handleCancelBooking}
          />
        ))}
      </div>
    ) : (
      <EmptyState userType="renter" onFindParking={handleFindParking} />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Parking Spots</h1>
          <button
            onClick={handleRefresh}
            className="flex items-center text-primary hover:text-primary-dark"
            disabled={isRefreshing || isLoading}
          >
            <Icon
              name="RefreshCw"
              size={16}
              className={`mr-1 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <TabSelector activeTab={userType} onTabChange={handleTabChange} />

        {isRefreshing && !isLoading && (
          <div className="flex items-center justify-center py-2 text-primary text-sm">
            <Icon name="Loader" size={16} className="animate-spin mr-2" />
            Refreshing data...
          </div>
        )}

        <div className="mt-4">{renderContent()}</div>

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
