// import React from "react";
// import Icon from "../../../components/AppIcon";

// const TimeRangeSelector = ({ selected, onChange }) => {
//   const timeSlots = [
//     {
//       id: "morning",
//       label: "Morning",
//       time: "6:00 AM - 12:00 PM",
//       icon: "Sunrise",
//     },
//     {
//       id: "afternoon",
//       label: "Afternoon",
//       time: "12:00 PM - 6:00 PM",
//       icon: "Sun",
//     },
//     {
//       id: "evening",
//       label: "Evening",
//       time: "6:00 PM - 12:00 AM",
//       icon: "Sunset",
//     },
//     {
//       id: "night",
//       label: "Night",
//       time: "12:00 AM - 06:00 AM",
//       icon: "Sunset",
//     }
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//       {timeSlots.map((slot) => (
//         <button
//           key={slot.id}
//           type="button"
//           onClick={() => onChange(slot.id)}
//           className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 ${
//             selected[slot.id]
//               ? "border-primary bg-primary bg-opacity-5" :"border-gray-200 hover:border-gray-300"
//           }`}
//         >
//           <Icon
//             name={slot.icon}
//             size={24}
//             className={selected[slot.id] ? "text-primary" : "text-gray-500"}
//           />
//           <span className={`font-medium mt-2 ${selected[slot.id] ? "text-primary" : "text-gray-700"}`}>
//             {slot.label}
//           </span>
//           <span className="text-sm text-gray-500 mt-1">{slot.time}</span>
//         </button>
//       ))}
//     </div>
//   );
// };

// export default TimeRangeSelector;
import React from "react";
import Icon from "../../../components/AppIcon";

const TimeRangeSelector = ({ selected, onChange }) => {
  console.log("selected",selected);
  
  const timeSlots = [
    {
      id: "morning",
      label: "Morning",
      time: "6:00 AM - 12:00 PM",
      icon: "Sunrise",
    },
    {
      id: "afternoon",
      label: "Afternoon",
      time: "12:00 PM - 6:00 PM",
      icon: "Sun",
    },
    {
      id: "evening",
      label: "Evening",
      time: "6:00 PM - 12:00 AM",
      icon: "Sunset",
    },
    {
      id: "night",
      label: "Night",
      time: "12:00 AM - 06:00 AM",
      icon: "Moon",
    }
  ];


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {timeSlots.map((slot) => (
        <button
          key={slot.id}
          type="button"
          onClick={() => onChange(slot.id)}
          className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 ${
            selected[slot.id]
              ? "border-primary bg-primary bg-opacity-5"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <Icon
            name={slot.icon}
            size={24}
            className={selected[slot.id] ? "text-white" : "text-gray-500"}
          />
          <span className={`font-medium mt-2 ${
            selected[slot.id] ? "text-white" : "text-gray-700"
          }`}>
            {slot.label}
          </span>
          <span className ={`text-sm ${selected[slot.id] ? "text-white" : "text-gray-500"} mt-1`}>{slot.time}</span>
        </button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;