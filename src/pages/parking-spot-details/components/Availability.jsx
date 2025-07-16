import React from "react";
import Icon from "../../../components/AppIcon";

const Availability = ({ availability }) => {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  return (
    <div>
      <div className="flex items-center mb-4">
        <Icon name="Clock" size={20} className="text-gray-500 mr-2" />
        <span className="text-gray-900">
          {availability.startTime} - {availability.endTime}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {daysOfWeek.map((day) => {
          const isAvailable = availability.availableDays.includes(day);
          return (
            <div 
              key={day}
              className={`px-3 py-1 rounded-full text-sm ${
                isAvailable 
                  ? 'bg-primary bg-opacity-10 text-primary' :'bg-gray-100 text-gray-500'
              }`}
            >
              {day.substring(0, 3)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Availability;