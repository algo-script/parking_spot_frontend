import React, { useState } from "react";
import Icon from "../../../components/AppIcon";

const FilterControls = ({ filters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    startTime: filters.startTime || "",
    endTime: filters.endTime || "",
    maxPrice: filters.maxPrice || 50,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    setIsExpanded(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      startTime: "",
      endTime: "",
      maxPrice: 50,
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const formatTimeForDisplay = (timeString) => {
    if (!timeString) return "";
    
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours, 10);
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${period}`;
    } catch (e) {
      return timeString;
    }
  };

  // Check if any filters are active
  const hasActiveFilters = filters.startTime || filters.endTime || filters.maxPrice !== 50;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div 
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Icon name="Filter" size={18} className={`mr-2 ${hasActiveFilters ? 'text-primary' : 'text-gray-500'}`} />
          <span className="font-medium">Filters</span>
          {hasActiveFilters && (
            <span className="ml-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </div>
        
        <div className="flex items-center">
          {hasActiveFilters && (
            <button
              type="button"
              className="text-sm text-gray-600 hover:text-gray-900 mr-3"
              onClick={(e) => {
                e.stopPropagation();
                handleResetFilters();
              }}
            >
              Reset
            </button>
          )}
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={18} 
            className="text-gray-500" 
          />
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={localFilters.startTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={localFilters.endTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Max Price: ${localFilters.maxPrice}/hr
              </label>
              <input
                type="range"
                id="maxPrice"
                name="maxPrice"
                min="1"
                max="100"
                step="1"
                value={localFilters.maxPrice}
                onChange={handleInputChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$1</span>
                <span>$50</span>
                <span>$100</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 mr-2"
              onClick={() => setIsExpanded(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      {!isExpanded && hasActiveFilters && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-2">
          {filters.startTime && filters.endTime && (
            <div className="inline-flex items-center bg-blue-50 text-blue-700 text-sm px-2 py-1 rounded-md">
              <Icon name="Clock" size={14} className="mr-1" />
              <span>{formatTimeForDisplay(filters.startTime)} - {formatTimeForDisplay(filters.endTime)}</span>
            </div>
          )}
          
          {filters.maxPrice !== 50 && (
            <div className="inline-flex items-center bg-green-50 text-green-700 text-sm px-2 py-1 rounded-md">
              <Icon name="DollarSign" size={14} className="mr-1" />
              <span>Max ${filters.maxPrice}/hr</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterControls;