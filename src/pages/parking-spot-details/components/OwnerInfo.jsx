import React from "react";
import Icon from "../../../components/AppIcon";

const OwnerInfo = ({ owner }) => {
  return (
    <div className="flex items-start">
      <img
        src={owner.avatar}
        alt={owner.name}
        className="w-12 h-12 rounded-full mr-4"
        onError={(e) => {
          e.target.src = "/assets/images/no_image.png";
        }}
      />
      <div>
        <h3 className="font-medium text-gray-900">Hosted by {owner.name}</h3>
        <div className="flex items-center mt-1">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon 
                key={star}
                name={star <= Math.round(owner.rating) ? "Star" : "StarHalf"} 
                size={16} 
                className={star <= Math.round(owner.rating) ? "text-warning" : "text-gray-300"} 
              />
            ))}
          </div>
          <span className="text-gray-600 text-sm ml-2">{owner.rating} ({owner.reviewCount} reviews)</span>
        </div>
        <div className="flex items-center mt-1 text-sm text-gray-600">
          <Icon name="Clock" size={14} className="mr-1" />
          <span>Responds {owner.responseTime}</span>
        </div>
      </div>
    </div>
  );
};

export default OwnerInfo;