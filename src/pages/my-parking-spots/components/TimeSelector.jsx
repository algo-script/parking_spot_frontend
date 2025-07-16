import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";

const TimeSelector = ({ startTime, endTime, onTimeChange }) => {
  const [start, setStart] = useState(startTime || "08:00");
  const [end, setEnd] = useState(endTime || "18:00");
  
  // Generate time options in 30-minute increments
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const value = `${formattedHour}:${formattedMinute}`;
        
        const date = new Date();
        date.setHours(hour);
        date.setMinutes(minute);
        const label = date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        
        options.push({ value, label });
      }
    }
    return options;
  };
  
  const timeOptions = generateTimeOptions();
  
  // Update parent component when times change
  useEffect(() => {
    if (start && end && start !== endTime && end !== startTime) {
      onTimeChange(start, end);
    }
  }, [start, end, startTime, endTime, onTimeChange]);
  
  // Handle start time change
  const handleStartChange = (e) => {
    const newStart = e.target.value;
    setStart(newStart);
    
    // Ensure end time is after start time
    if (newStart >= end) {
      // Find the next time slot
      const startIndex = timeOptions.findIndex(option => option.value === newStart);
      if (startIndex < timeOptions.length - 1) {
        setEnd(timeOptions[startIndex + 1].value);
      }
    }
  };
  
  // Handle end time change
  const handleEndChange = (e) => {
    const newEnd = e.target.value;
    setEnd(newEnd);
    
    // Ensure start time is before end time
    if (newEnd <= start) {
      // Find the previous time slot
      const endIndex = timeOptions.findIndex(option => option.value === newEnd);
      if (endIndex > 0) {
        setStart(timeOptions[endIndex - 1].value);
      }
    }
  };
  
  return (
    <div className="flex items-center space-x-3">
      <div className="flex-1">
        <label htmlFor="start-time" className="block text-xs text-gray-500 mb-1">
          From
        </label>
        <div className="relative">
          <select
            id="start-time"
            value={start}
            onChange={handleStartChange}
            className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none text-sm"
          >
            {timeOptions.map(option => (
              <option 
                key={`start-${option.value}`} 
                value={option.value}
                disabled={option.value >= end}
              >
                {option.label}
              </option>
            ))}
          </select>
          <Icon 
            name="Clock" 
            size={16} 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" 
          />
        </div>
      </div>
      
      <div className="flex-1">
        <label htmlFor="end-time" className="block text-xs text-gray-500 mb-1">
          To
        </label>
        <div className="relative">
          <select
            id="end-time"
            value={end}
            onChange={handleEndChange}
            className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none text-sm"
          >
            {timeOptions.map(option => (
              <option 
                key={`end-${option.value}`} 
                value={option.value}
                disabled={option.value <= start}
              >
                {option.label}
              </option>
            ))}
          </select>
          <Icon 
            name="Clock" 
            size={16} 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" 
          />
        </div>
      </div>
    </div>
  );
};

export default TimeSelector;