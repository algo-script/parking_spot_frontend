import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookingDetaiils, formatDate, formatPrice, formatTimeString } from 'utils/helperFunctions';
import TabSelector from './Tabselecror';


const BookingDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookingData, setBookingData] = useState([]);
  const [activeTab,setActiveTab] = useState(searchParams.get('tab') || 'upcoming');

  const fetchBookingData = async () => {
    try {
      const response = await bookingDetaiils({ activeTab });
      if (response.success) {
        setBookingData(response.data);
      }
    } catch (error) {
      console.error("Error fetching booking data:", error.message);
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, [activeTab]);

  // Update URL when tab changes
  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
    setActiveTab(tabId)
  };

  // Status colors
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const paymentStatusColors = {
    Paid: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Failed: 'bg-red-100 text-red-800'
  };

  // Action handlers
  // const handleCheckIn = (bookingId) => {
  //   alert(`Check in booking: ${bookingId}`);
  // };

  // const handleCheckOut = (bookingId) => {
  //   alert(`Check out booking: ${bookingId}`);
  // };

  // const handleViewDetails = (bookingId) => {
  //   alert(`View details for booking: ${bookingId}`);
  // };

  // const handleCancel = (bookingId) => {
  //   alert(`Cancel booking: ${bookingId}`);
  // };

  // const handleContact = (bookingId, user) => {
  //   alert(`Contact user ${user} about booking: ${bookingId}`);
  // };

  const isEmpty = bookingData.length === 0;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 container mx-auto px-4 py-4 md:py-6">
        {/* Use TabSelector component */}
        <div className="mb-6">
          <TabSelector activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        {/* Table Container */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {activeTab === 'upcoming' ? 'Upcoming Bookings' : 'Recent Bookings'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'upcoming' 
                ? 'Reservations scheduled for today and future dates' 
                : 'Completed reservations from the past 7 days'}
            </p>
          </div>

          {/* Table */}
          {!isEmpty ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User 
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {activeTab === 'upcoming' ? 'Time Slot' : 'Date & Time'}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Vehicle
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    {/* {activeTab === 'upcoming' &&
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>} */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookingData.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.bookingId}</div>
                        <div className="text-sm text-gray-500">{formatDate(booking.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.user.name}</div>
                        <div className="text-sm text-gray-500">{booking.user.mobile}</div>
                        <div className="text-sm text-gray-500">{booking.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {activeTab === 'upcoming' ? (
                          <>
                            <div className="text-sm text-gray-900">{formatTimeString(booking.startTime)}</div>
                            <div className="text-sm text-gray-500">to {formatTimeString(booking.endTime)}</div>
                          </>
                        ) : (
                          <>
                            <div className="text-sm text-gray-900">{formatDate(booking.date)}</div>
                            <div className="text-sm text-gray-500">{formatTimeString(booking.startTime)} - {formatTimeString(booking.endTime)}</div>
                          </>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status] || 'bg-gray-100 text-gray-800'}`}>
                          {booking.status}
                        </span>
                        {/* <div className="mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentStatusColors[booking.paymentStatus] || 'bg-gray-100 text-gray-800'}`}>
                            {booking.paymentStatus}
                          </span>
                        </div> */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.vehicle.vehicleNumber}</div>
                        <div className="text-sm text-gray-500">{booking.vehicle.model}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(booking.totalAmount)}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {activeTab === 'upcoming' ? (
                            <>
                              <button
                                onClick={() => handleViewDetails(booking._id)}
                                className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded text-xs"
                              >
                                Details
                              </button>
                              <button
                                onClick={() => handleCancel(booking._id)}
                                className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded text-xs"
                              >
                                Cancel
                              </button>
                            </>
                          )
                           : (
                            <>
                              <button
                                onClick={() => handleViewDetails(booking._id)}
                                className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded text-xs"
                              >
                                Details
                              </button>
                              <button
                                onClick={() => handleContact(booking._id, booking.user.name)}
                                className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded text-xs"
                              >
                                Contact
                              </button>
                            </>
                          )}
                        </div>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Empty state
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {activeTab === 'upcoming' ? 'No upcoming bookings' : 'No recent bookings'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'upcoming' 
                  ? 'Get started by checking in a new vehicle.' 
                  : 'There are no completed bookings in the past week.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;