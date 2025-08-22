import React from 'react';
import ReactDOM from 'react-dom';

const BookingForm = ({ station, onClose, onSuccess }) => {
  if (!station) return null;

  // Modal content
  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Book Charging Slot - {station.name}
        </h2>

        <p className="text-sm text-gray-600 mb-2">
          Address: {station.address}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Available Slots: {station.availableSlots}/{station.totalSlots}
        </p>
        <p className="text-lg font-semibold text-green-600 mb-6">
          ₹{station.pricePerHour}/hour
        </p>

        {/* Example Booking Action */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSuccess();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );

  // Render portal to body
  return ReactDOM.createPortal(modalContent, document.body);
};

export default BookingForm;