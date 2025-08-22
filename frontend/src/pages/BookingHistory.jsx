import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { bookingService } from '../services/api';
import toast from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { X, MapPin, Clock, IndianRupee, Hash } from 'lucide-react';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewBooking, setViewBooking] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await bookingService.getUserBookings(params);
      if (response.data.success) setBookings(response.data.bookings);
      else toast.error('Failed to fetch bookings');
    } catch (error) {
      toast.error('Error fetching bookings');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const response = await bookingService.cancelBooking(bookingId);
      if (response.data.success) {
        toast.success('Booking cancelled successfully');
        fetchBookings();
      } else {
        toast.error(response.data.message || 'Failed to cancel booking');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-200 text-green-900';
      case 'pending': return 'bg-yellow-200 text-yellow-900';
      case 'completed': return 'bg-blue-200 text-blue-900';
      case 'cancelled': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-200 text-gray-900';
    }
  };

  return (
    <div className="space-y-8 px-4 md:px-8 lg:px-16 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight">My Bookings</h1>
          <p className="text-gray-500 mt-1">Manage and view your charging history</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 shadow focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="grid gap-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">No bookings found</div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center transition transform hover:scale-[1.02]"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-500" /> {booking.station?.name || "Unknown Station"}
                </h3>
                <p className="text-sm text-gray-500">{booking.station?.address || "No address available"}</p>
                <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
              <div className="text-sm text-gray-700 mt-4 md:mt-0 md:text-right">
                <p className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-500" /> {format(new Date(booking.startTime), 'PPpp')}
                </p>
                <p className="flex items-center gap-1 font-medium text-green-600 mt-1">
                  <IndianRupee className="w-4 h-4" />{booking.totalAmount?.toFixed(2) || "0.00"}
                </p>
              </div>
              <div className="flex space-x-3 mt-4 md:mt-0">
                {['confirmed', 'pending'].includes(booking.status) && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition shadow"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => setViewBooking(booking)}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition shadow"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Transition appear show={!!viewBooking} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setViewBooking(null)}>
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
            <Dialog.Panel className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-2xl font-bold">Booking Details</Dialog.Title>
                <button onClick={() => setViewBooking(null)} className="text-gray-500 hover:text-gray-800">
                  <X className="w-6 h-6" />
                </button>
              </div>
              {viewBooking && (
                <div className="space-y-3 text-gray-700">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span className="font-semibold">Station:</span> {viewBooking?.station?.name || "Unknown Station"}
                  </p>
                  <p className="ml-6 text-sm">{viewBooking?.station?.address || "No address available"}</p>
                  <p>
                    <span className="font-semibold">Date & Time:</span>{" "}
                    {format(new Date(viewBooking.startTime), 'PPpp')} - {format(new Date(viewBooking.endTime), 'hh:mm a')}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <span className="font-semibold">Duration:</span> {viewBooking?.duration} hour(s)
                  </p>
                  <p className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-indigo-500" />
                    <span className="font-semibold">Slot:</span> #{viewBooking?.slotNumber || "-"}
                  </p>
                  <p className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-green-600" />
                    <span className="font-semibold">Amount:</span> ₹{viewBooking?.totalAmount?.toFixed(2) || "0.00"}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span> {viewBooking?.status}
                  </p>
                </div>
              )}
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default BookingHistory;
