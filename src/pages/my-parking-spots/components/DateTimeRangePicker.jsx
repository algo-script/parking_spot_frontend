// import React, { useState, useEffect } from "react";
// import Icon from "../../../components/AppIcon";

// const DateTimeRangePicker = ({ selected, onChange }) => {
//   // Initialize state with formatted date-time strings
//   const [start, setStart] = useState(
//     selected?.start ? formatDateTimeForInput(selected.start) : ""
//   );
//   const [end, setEnd] = useState(
//     selected?.end ? formatDateTimeForInput(selected.end) : ""
//   );
//   const [error, setError] = useState("");

//   // Format Date object to datetime-local input format (YYYY-MM-DDTHH:mm)
//   function formatDateTimeForInput(dateTime) {
//     if (!dateTime) return "";
//     const date = new Date(dateTime);
//     const pad = (num) => String(num).padStart(2, "0");
//     const year = date.getFullYear();
//     const month = pad(date.getMonth() + 1);
//     const day = pad(date.getDate());
//     const hours = pad(date.getHours());
//     const minutes = pad(date.getMinutes());
//     return `${year}-${month}-${day}T${hours}:${minutes}`;
//   }

//   // Parse datetime-local input value to Date object
//   const parseDateTime = (value) => {
//     return value ? new Date(value) : null;
//   };

//   // Validate that start is before end and update parent
// //   useEffect(() => {
// //     const startDate = parseDateTime(start);
// //     const endDate = parseDateTime(end);

// //     if (startDate && endDate) {
// //       if (startDate >= endDate) {
// //         setError("End time must be after start time");
// //       } else {
// //         setError("");
// //         onChange({ start: startDate, end: endDate });
// //       }
// //     }
// //   }, [start, end, onChange]);
// useEffect(() => {
//     const startDate = parseDateTime(start);
//     const endDate = parseDateTime(end);
  
//     if (startDate && endDate) {
//       if (startDate >= endDate) {
//         setError("End time must be after start time");
//       } else {
//         setError("");
//         onChange({ start: startDate, end: endDate });
//       }
//     }
//   }, [start, end]);

//   // Handle start time change
//   const handleStartChange = (e) => {
//     const newStart = e.target.value;
//     setStart(newStart);

//     // If end time is before new start time, reset end time
//     if (newStart && end && new Date(newStart) >= new Date(end)) {
//       setEnd("");
//       setError("Please select an end time after the start time");
//     }
//   };

//   // Handle end time change
//   const handleEndChange = (e) => {
//     const newEnd = e.target.value;
//     setEnd(newEnd);
//   };

//   return (
//     <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-3 sm:space-y-0">
//       <div className="flex-1">
//         <label
//           htmlFor="start-datetime"
//           className="block text-xs text-gray-500 mb-1"
//         >
//           From
//         </label>
//         <div className="relative">
//           <input
//             type="datetime-local"
//             id="start-datetime"
//             value={start}
//             onChange={handleStartChange}
//             className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none text-sm"
//             required
//           />
//           <Icon
//             name="Calendar"
//             size={16}
//             className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
//           />
//         </div>
//       </div>

//       <div className="flex-1">
//         <label
//           htmlFor="end-datetime"
//           className="block text-xs text-gray-500 mb-1"
//         >
//           To
//         </label>
//         <div className="relative">
//           <input
//             type="datetime-local"
//             id="end-datetime"
//             value={end}
//             onChange={handleEndChange}
//             min={start} // Prevent selecting end time before start
//             className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none text-sm"
//             required
//           />
//           <Icon
//             name="Calendar"
//             size={16}
//             className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
//           />
//         </div>
//       </div>

//       {error && (
//         <p className="mt-1 text-sm text-error">{error}</p>
//       )}
//     </div>
//   );
// };

// export default DateTimeRangePicker;