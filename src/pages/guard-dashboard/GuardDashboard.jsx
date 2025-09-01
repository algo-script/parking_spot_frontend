// import React, { useEffect, useState } from 'react';
// import { guardDashboard } from 'utils/helperFunctions';

// const GuardDashboard = () => {
//   // Sample data for one parking spot
//   const [spotDetails] = useState({
//     id: 'SP001',
//     location: 'Main Parking Lot - Section A',
//     type: 'Compact',
//     status: 'Available',
//     hourlyRate: 5.0,
//   });
//   const [currentBooking, setCurrentBooking] = useState({
//     id: 'BK20231015001',
//     user: 'John Doe',
//     phone: '+1 (555) 123-4567',
//     vehicle: 'Toyota Camry',
//     licensePlate: 'ABC123',
//     color: 'Blue',
//     checkInTime: '2023-10-15T10:15:00',
//     expectedCheckOut: '2023-10-15T14:00:00',
//     status: 'Active',
//     paymentStatus: 'Paid',
//     amount: 20.0,
//     qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BK20231015001'
//   });
//   // Sample time-wise booking data
//   const [bookings] = useState([
//     { id: 'BK001', time: '08:00 AM - 10:00 AM', user: 'John Doe', status: 'Confirmed' },
//     { id: 'BK002', time: '10:30 AM - 12:30 PM', user: 'Jane Smith', status: 'Confirmed' },
//     { id: 'BK003', time: '01:00 PM - 03:00 PM', user: 'Mike Johnson', status: 'Pending' },
//   ]);

//   // Status colors mapping
//   const statusColors = {
//     Available: 'bg-green-100 text-green-800',
//     Occupied: 'bg-red-100 text-red-800',
//     Reserved: 'bg-blue-100 text-blue-800',
//     Maintenance: 'bg-yellow-100 text-yellow-800',
//     Confirmed: 'bg-green-100 text-green-800',
//     Pending: 'bg-yellow-100 text-yellow-800',
//     Cancelled: 'bg-red-100 text-red-800',
//   };
//    // Format date and time
//    const formatDateTime = (dateTimeStr) => {
//     const options = { 
//       hour: '2-digit', 
//       minute: '2-digit',
//       hour12: true 
//     };
//     return new Date(dateTimeStr).toLocaleString('en-US', options);
//   };

//    // Action handlers
//    const handleCheckIn = () => {
//     alert('Check-in functionality would open here');
//   };

//   const handleCheckOut = () => {
//     setCurrentBooking(null);
//     alert('Check-out recorded successfully!');
//   };

//   const handleVerify = () => {
//     alert('QR verification would open here');
//   };

//   const handleIssue = () => {
//     alert('Issue reporting modal would open here');
//   };

//   const handleExtend = () => {
//     alert('Time extension modal would open here');
//   };

//   const fetchDashboard = async() =>{
//     try {
//       const response.data = await guardDashboard()
//       console.log(response.data)
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   useEffect(()=>{
//     fetchDashboard();
//   },[])

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//           <div className="flex-1 container mx-auto px-4 py-4 md:py-6">
//       {/* <div className="bg-white shadow-sm rounded-lg mb-6 p-4">
//         <h1 className="text-2xl font-bold text-gray-800">Parking Guard Dashboard</h1>
//         <p className="text-gray-600">Monitor and manage parking spot status</p>
//       </div> */}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Parking Spot Details Card */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Parking Spot Details</h2>
//             <div className="space-y-4">
//               <div>
//                 <p className="text-sm text-gray-500">Spot ID</p>
//                 <p className="font-medium">{spotDetails.id}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Location</p>
//                 <p className="font-medium">{spotDetails.location}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Type</p>
//                 <p className="font-medium">{spotDetails.type}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Status</p>
//                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[spotDetails.status]}`}>
//                   {spotDetails.status}
//                 </span>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Hourly Rate</p>
//                 <p className="font-medium">${spotDetails.hourlyRate.toFixed(2)}</p>
//               </div>
//             </div>

//               {/* Quick Actions */}
//               <div className="mt-8">
//                 <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
//                 <div className="space-y-2">
//                   {/* <button
//                     onClick={handleCheckIn}
//                     className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
//                   >
//                     New Check-In
//                   </button> */}
//                   <button
//                     onClick={handleVerify}
//                     className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
//                   >
//                     Verify QR Code
//                   </button>
//                 </div>
//               </div>
//           </div>
//         </div>

//         {/* Bookings List */}
//            <div className="lg:col-span-2">
//             {currentBooking ? (
//               <div className="bg-white shadow rounded-lg overflow-hidden">
//                 {/* Header */}
//                 <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
//                   <div className="flex items-center justify-between">
//                     <h2 className="text-lg font-medium text-blue-900">Current Booking</h2>
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[currentBooking.status]}`}>
//                       {currentBooking.status}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="px-6 py-5">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* User & Vehicle Info */}
//                     <div>
//                       <h3 className="text-md font-medium text-gray-900 mb-3">User & Vehicle</h3>
//                       <dl className="space-y-3">
//                         <div>
//                           <dt className="text-sm font-medium text-gray-500">User Name</dt>
//                           <dd className="mt-1 text-sm text-gray-900">{currentBooking.user}</dd>
//                         </div>
//                         <div>
//                           <dt className="text-sm font-medium text-gray-500">Phone</dt>
//                           <dd className="mt-1 text-sm text-gray-900">{currentBooking.phone}</dd>
//                         </div>
//                         <div>
//                           <dt className="text-sm font-medium text-gray-500">Vehicle</dt>
//                           <dd className="mt-1 text-sm text-gray-900">{currentBooking.vehicle}</dd>
//                         </div>
//                         <div>
//                           <dt className="text-sm font-medium text-gray-500">License Plate</dt>
//                           <dd className="mt-1 text-sm text-gray-900 font-mono">{currentBooking.licensePlate}</dd>
//                         </div>
//                         <div>
//                           <dt className="text-sm font-medium text-gray-500">Color</dt>
//                           <dd className="mt-1 text-sm text-gray-900">{currentBooking.color}</dd>
//                         </div>
//                       </dl>
//                     </div>

//                     {/* Booking Info */}
//                     <div>
//                       <h3 className="text-md font-medium text-gray-900 mb-3">Booking Details</h3>
//                       <dl className="space-y-3">
//                         <div>
//                           <dt className="text-sm font-medium text-gray-500">Booking ID</dt>
//                           <dd className="mt-1 text-sm text-gray-900 font-mono">{currentBooking.id}</dd>
//                         </div>
//                         <div>
//                           <dt className="text-sm font-medium text-gray-500">Check-In Time</dt>
//                           <dd className="mt-1 text-sm text-gray-900">{formatDateTime(currentBooking.checkInTime)}</dd>
//                         </div>
//                         <div>
//                           <dt className="text-sm font-medium text-gray-500">Expected Check-Out</dt>
//                           <dd className="mt-1 text-sm text-gray-900">{formatDateTime(currentBooking.expectedCheckOut)}</dd>
//                         </div>
//                         <div>
//                           <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
//                           <dd className="mt-1 text-sm text-gray-900">{currentBooking.paymentStatus}</dd>
//                         </div>
//                         <div>
//                           <dt className="text-sm font-medium text-gray-500">Amount</dt>
//                           <dd className="mt-1 text-sm text-gray-900">${currentBooking.amount.toFixed(2)}</dd>
//                         </div>
//                       </dl>
//                     </div>
//                   </div>

//                   {/* QR Code */}
//                   {/* <div className="mt-6 pt-6 border-t border-gray-200">
//                     <h3 className="text-md font-medium text-gray-900 mb-3">Verification QR Code</h3>
//                     <div className="flex items-center">
//                       <div className="bg-gray-100 p-3 rounded-lg">
//                         <img 
//                           src={currentBooking.qrCode} 
//                           alt="QR Code" 
//                           className="w-24 h-24"
//                         />
//                       </div>
//                       <p className="ml-4 text-sm text-gray-500">Scan this code to verify the booking</p>
//                     </div>
//                   </div> */}

//                   {/* Actions */}
//                   <div className="mt-6 pt-6 border-t border-gray-200">
//                     <div className="flex flex-wrap gap-3">
//                       <button
//                         onClick={handleCheckOut}
//                         className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
//                       > 
//                         Check Out
//                       </button>
//                       <button
//                         onClick={handleExtend}
//                         className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
//                       >
//                         Extend Time
//                       </button>
//                       <button
//                         onClick={handleIssue}
//                         className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
//                       >
//                         Report Issue
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-white shadow rounded-lg overflow-hidden">
//                 <div className="px-6 py-12 text-center">
//                   <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <h3 className="mt-2 text-sm font-medium text-gray-900">No active booking</h3>
//                   <p className="mt-1 text-sm text-gray-500">This parking spot is currently available.</p>
//                   <div className="mt-6">
//                     <button
//                       onClick={handleCheckIn}
//                       className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
//                     >
//                       Check In a Vehicle
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//       </div>
//       </div>
//     </div>
//   );
// };

// export default GuardDashboard;
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { checkOutvehicle, guardDashboard } from 'utils/helperFunctions';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const GuardDashboard = () => {
  const [spotDetails, setSpotDetails] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // console.log("spotDetails",spotDetails)
  console.log("currentBooking",currentBooking);
  

  // Status colors mapping
  const statusColors = {
    Available: 'bg-green-100 text-green-800',
    Occupied: 'bg-red-100 text-red-800',
    Reserved: 'bg-blue-100 text-blue-800',
    Maintenance: 'bg-yellow-100 text-yellow-800',
    Confirmed: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Cancelled: 'bg-red-100 text-red-800',
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  };

 // Format date and time using Moment.js
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return 'N/A';
  return moment(dateTimeStr).format('DD/MM/YYYY hh:mm A');
};


  // Format date only using Moment.js
  const formatDateOnly = (dateStr) => {
    if (!dateStr) return 'N/A';
    return moment(dateStr).format('DD/MM/YYYY');
  };

  // Format time string (e.g., "12:00" to "12:00 PM")
  const formatTimeString = (timeStr) => {
    if (!timeStr) return 'N/A';
    return moment(timeStr, 'HH:mm').format('h:mm A');
  };

  // Calculate duration in hours from "HH:MM" format
  const calculateDurationHours = (durationStr) => {
    if (!durationStr) return 0;
    
    try {
      const [hours, minutes] = durationStr.split(':').map(Number);
      return hours + (minutes / 60);
    } catch (error) {
      return 0;
    }
  };

  // Action handlers
  const handleCheckIn = () => {
    alert('Check-in functionality would open here');
  };
  // checkOutvehicle
  // const handleCheckOut = () => {
  //   setCurrentBooking(null);
  //   alert('Check-out recorded successfully!');
  // };

  const handleCheckOut = async () => {
    if (!currentBooking) return;
  
    try {
      // Replace with your API endpoint
      const response = await checkOutvehicle({bookingId:currentBooking._id});
      console.log(response)
  
      if (response.success) {
        toast.success(response.message)
        await fetchDashboard()
      } 
    } catch (error) {
      console.error("Checkout API error:", error);
      toast.error(error.response.message)
    }
  };

  const handleVerify = () => {
    // Any logic you want before navigating
    navigate("/qr-scanner"); // Navigate to /qr-scanner
  };

  const handleIssue = () => {
    alert('Issue reporting modal would open here');
  };

  // const handleExtend = () => {
  //   alert('Time extension modal would open here');
  // };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await guardDashboard();
      console.log('API response.data:', response);
      
      if (response.spotdata && response.success) {
        // Set parking spot details
        setSpotDetails({...response.spotdata,status: response.spotdata.isAvailable ? 'Available' : 'Not Available'})
        setCurrentBooking(response.bookingdata);
      }
    }
     catch (error) {
      console.error('Error fetching dashboard:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchDashboard}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 container mx-auto px-4 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Parking Spot Details Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Parking Spot Details</h2>
              
              {spotDetails ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Spot Name</p>
                    <p className="font-medium">{spotDetails.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    {/* <p className="font-medium">{spotDetails.location || 'N/A'}</p> */}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="font-medium">{spotDetails.size || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Covered</p>
                    <p className="font-medium">{spotDetails.isCovered || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[spotDetails.status] || 'bg-gray-100 text-gray-800'}`}>
                      {spotDetails.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hourly Rate</p>
                    <p className="font-medium">${spotDetails.hourlyRate ? spotDetails.hourlyRate.toFixed(2) : '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="font-medium text-sm">{spotDetails.description || 'No description'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No spot details available</p>
              )}

              {/* Quick Actions */}
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleVerify}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                  >
                    Verify QR Code
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Current Booking */}
          <div className="lg:col-span-2">
            {currentBooking ? (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-blue-900">Current Booking</h2>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[currentBooking.status] || 'bg-gray-100 text-gray-800'}`}>
                      {currentBooking.status}
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">Booking ID: {currentBooking.bookingId}</p>
                </div>

                <div className="px-6 py-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User & Vehicle Info */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-3">User & Vehicle</h3>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">User Name</dt>
                          <dd className="mt-1 text-sm text-gray-900">{currentBooking.user.name}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Vehicle Type</dt>
                          <dd className="mt-1 text-sm text-gray-900">{currentBooking.vehicle.type}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Brand & Model</dt>
                          <dd className="mt-1 text-sm text-gray-900">{currentBooking.vehicle.brand} {currentBooking.vehicle.model}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">License Plate</dt>
                          <dd className="mt-1 text-sm text-gray-900 font-mono">{currentBooking.vehicle.vehicleNumber}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Color</dt>
                          <dd className="mt-1 text-sm text-gray-900">{currentBooking.vehicle.color}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Electric Vehicle</dt>
                          <dd className="mt-1 text-sm text-gray-900">{currentBooking.vehicle.isElectric ? 'Yes' : 'No'}</dd>
                        </div>
                      </dl>
                    </div>

                    {/* Booking Info */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-3">Booking Details</h3>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Date</dt>
                          <dd className="mt-1 text-sm text-gray-900">{formatDateOnly(currentBooking.date)}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Start Time</dt>
                          <dd className="mt-1 text-sm text-gray-900">{formatTimeString(currentBooking.startTime)}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">End Time</dt>
                          <dd className="mt-1 text-sm text-gray-900">{formatTimeString(currentBooking.endTime)}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Duration</dt>
                          <dd className="mt-1 text-sm text-gray-900">{currentBooking.duration}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                          <dd className="mt-1 text-sm text-gray-900">${currentBooking.totalAmount ? currentBooking.totalAmount.toFixed(2) : '0.00'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Booked On</dt>
                          <dd className="mt-1 text-sm text-gray-900">{formatDateTime(currentBooking.createdAt)}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {/* QR Code */}
                  {currentBooking.qrCode && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-md font-medium text-gray-900 mb-3">Verification QR Code</h3>
                      <div className="flex items-center">
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <img 
                            src={currentBooking.qrCode} 
                            alt="QR Code" 
                            className="w-24 h-24"
                          />
                        </div>
                        <p className="ml-4 text-sm text-gray-500">Scan this code to verify the booking</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap gap-3">
                      {currentBooking.status==="confirmed" &&
                      (<button
                        onClick={handleCheckOut}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                      > 
                        Check Out
                      </button>)}
                      {/* <button
                        onClick={handleExtend}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                      >
                        Extend Time
                      </button> */}
                      <button
                        onClick={handleIssue}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                      >
                        Report Issue
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No active booking</h3>
                  <p className="mt-1 text-sm text-gray-500">This parking spot is currently available.</p>
                  {/* <div className="mt-6">
                    <button
                      onClick={handleCheckIn}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Check In a Vehicle
                    </button>
                  </div> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardDashboard;

