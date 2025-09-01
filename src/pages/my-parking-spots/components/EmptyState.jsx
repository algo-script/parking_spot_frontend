import React from "react";
import Icon from "../../../components/AppIcon";

const EmptyState = ({ userType, onAddParkingSpot, onFindParking }) => {

  const content = {
    owner: {
      title: "No Parking Spots Yet",
      description: "You haven\'t added any parking spots to rent out. Add your first spot to start earning!",
      buttonText: "Add a Parking Spot",
      buttonIcon: "Plus",
      illustration: "ParkingCircle"
    },
    renter: {
      title: "No Bookings Yet",
      description: "You haven\'t booked any parking spots. Find and book a spot for your next trip!",
      buttonText: "Find Parking",
      buttonIcon: "Search",
      illustration: "Car"
    }
  };

  const { title, description, buttonText, buttonIcon, illustration } = content[userType];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-gray-100 rounded-full p-6 mb-6">
        <Icon name={illustration} size={64} color="var(--color-primary)" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md">{description}</p>
      <button
        onClick={userType === "owner" ? onAddParkingSpot : onFindParking}
        className="btn btn-primary flex items-center px-6 py-3"
      >
        <Icon name={buttonIcon} size={18} className="mr-2" />
        {buttonText}
      </button>
    </div>
  );
};

export default EmptyState;