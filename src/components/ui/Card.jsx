import React from 'react';
import Image from '../AppImage';
import Icon from '../AppIcon';


const Card = ({
  variant = 'default',
  title,
  subtitle,
  description,
  image,
  price,
  location,
  availability,
  rating,
  actions,
  onClick,
  className = '',
  ...props
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg';
  
  const renderParkingSpotCard = () => (
    <div className={`${baseClasses} ${className}`} onClick={onClick} {...props}>
      <div className="relative">
        <Image 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        {availability && (
          <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${
            availability === 'Available' ? 'bg-success text-white' : 
            availability === 'Limited'? 'bg-warning text-white' : 'bg-error text-white'
          }`}>
            {availability}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {price && <span className="text-lg font-bold text-primary">${price}/hr</span>}
        </div>
        {location && (
          <div className="flex items-center mt-2 text-gray-500">
            <Icon name="MapPin" size={16} className="mr-1" />
            <span className="text-sm">{location}</span>
          </div>
        )}
        {description && <p className="mt-2 text-sm text-gray-700">{description}</p>}
        {rating && (
          <div className="flex items-center mt-2">
            <Icon name="Star" size={16} className="text-warning" />
            <span className="ml-1 text-sm font-medium">{rating}</span>
          </div>
        )}
        {actions && (
          <div className="mt-4 flex justify-end space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );

  const renderBookingCard = () => (
    <div className={`${baseClasses} ${className}`} {...props}>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          {price && <span className="text-lg font-bold text-primary">${price}</span>}
        </div>
        {location && (
          <div className="flex items-center mt-2 text-gray-500">
            <Icon name="MapPin" size={16} className="mr-1" />
            <span className="text-sm">{location}</span>
          </div>
        )}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status:</span>
            <span className={`font-medium ${
              availability === 'Confirmed' ? 'text-success' : 
              availability === 'Pending' ? 'text-warning' : 
              availability === 'Completed'? 'text-gray-500' : 'text-error'
            }`}>
              {availability}
            </span>
          </div>
        </div>
        {actions && (
          <div className="mt-4 flex justify-end space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );

  const renderUserProfileCard = () => (
    <div className={`${baseClasses} ${className}`} {...props}>
      <div className="p-4 flex items-center">
        <Image 
          src={image} 
          alt={title} 
          className="w-16 h-16 rounded-full object-cover mr-4"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {rating && (
            <div className="flex items-center mt-1">
              <Icon name="Star" size={16} className="text-warning" />
              <span className="ml-1 text-sm font-medium">{rating}</span>
            </div>
          )}
        </div>
      </div>
      {description && (
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-700">{description}</p>
        </div>
      )}
      {actions && (
        <div className="px-4 pb-4 flex justify-end space-x-2">
          {actions}
        </div>
      )}
    </div>
  );

  const renderSummaryCard = () => (
    <div className={`${baseClasses} ${className}`} {...props}>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mb-3">{subtitle}</p>}
        <div className="space-y-2">
          {description && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Description:</span>
              <span className="text-gray-700 font-medium">{description}</span>
            </div>
          )}
          {price && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Price:</span>
              <span className="text-gray-700 font-medium">${price}</span>
            </div>
          )}
          {location && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Location:</span>
              <span className="text-gray-700 font-medium">{location}</span>
            </div>
          )}
          {availability && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status:</span>
              <span className={`font-medium ${
                availability === 'Available' ? 'text-success' : 
                availability === 'Pending'? 'text-warning' : 'text-error'
              }`}>
                {availability}
              </span>
            </div>
          )}
        </div>
        {actions && (
          <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );

  switch (variant) {
    case 'parkingSpot':
      return renderParkingSpotCard();
    case 'booking':
      return renderBookingCard();
    case 'userProfile':
      return renderUserProfileCard();
    case 'summary':
      return renderSummaryCard();
    default:
      return renderParkingSpotCard();
  }
};

export default Card;