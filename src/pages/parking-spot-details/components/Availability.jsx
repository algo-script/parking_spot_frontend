// import React from "react";
// import Icon from "../../../components/AppIcon";

// const Availability = ({ availability }) => {
//   console.log("availability in props",availability)
//   const daysOfWeek =  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
//   const formatDateTime = (isoString) => {
//     if (!isoString) return "";
//     const date = new Date(isoString);
//     return date.toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };
  
//   return (
//     <div>
//       <div className="flex items-center mb-4">
//         <Icon name="Clock" size={20} className="text-gray-500 mr-2" />
//         <span className="text-gray-900">
//           {formatDateTime(availability.startTime)} - {formatDateTime(availability.endTime)}
//         </span>
//       </div>
      
//       <div className="flex flex-wrap gap-2">
//         {daysOfWeek.map((day) => {
//           const isAvailable = availability.availableDays.includes(day);
//           return (
//             <div 
//               key={day}
//               className={`px-3 py-1 rounded-full text-sm ${
//                 isAvailable 
//                   ? 'bg-primary bg-opacity-10 text-white' :
//                   'bg-gray-100 text-gray-500'
//               }`}
//             >
//               {day.substring(0, 3)}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Availability;
import React from "react";
import Icon from "../../../components/AppIcon";
import { formatTimeString } from "utils/helperFunctions";

const Availability = ({ availability }) => {
  console.log("availability in props", availability);
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