import React from "react";
import Icon from "../../../components/AppIcon";
import { formatTimeString } from "utils/helperFunctions";

const Availability = ({ availability }) => {
  // console.log("availability in props", availability);
  const daysOfWeek = [
    { key: "monday", label: "Mon" },
    { key: "tuesday", label: "Tue" },
    { key: "wednesday", label: "Wed" },
    { key: "thursday", label: "Thu" },
    { key: "friday", label: "Fri" },
    { key: "saturday", label: "Sat" },
    { key: "sunday", label: "Sun" },
  ];

  return (
    <div>
      <div className="flex items-center mb-4">
        <Icon name="Clock" size={20} className="text-gray-500 mr-2" />
        <span className="text-gray-900">
          {formatTimeString(availability.startTime)} - {formatTimeString(availability.endTime)}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {daysOfWeek.map((day) => {
          const isAvailable = availability.availableDays[day.key];
          return (
            <div 
              key={day.key}
              className={`px-3 py-1 rounded-full text-sm ${
                isAvailable 
                ? 'bg-primary bg-opacity-10 text-white' :
                  'bg-gray-100 text-gray-500'
              }`}
            >
              {day.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Availability;