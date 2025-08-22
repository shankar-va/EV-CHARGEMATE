import React from 'react';

const StationCard = ({ station, onSelect, isSelected }) => {
  const getStatusColor = (availableSlots) => {
    if (availableSlots === 0) return 'text-red-600 bg-red-100';
    if (availableSlots <= 2) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getStatusText = (availableSlots) => {
    if (availableSlots === 0) return 'Full';
    if (availableSlots <= 2) return 'Limited';
    return 'Available';
  };

  return (
    <div 
      className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary-500' : ''
      }`}
      onClick={() => onSelect(station)}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{station.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(station.availableSlots)}`}>
          {getStatusText(station.availableSlots)}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{station.address}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <span className="text-xs text-gray-500">Available Slots</span>
          <p className="text-sm font-medium">{station.availableSlots} / {station.totalSlots}</p>
        </div>
        <div>
          <span className="text-xs text-gray-500">Charging Speed</span>
          <p className="text-sm font-medium">{station.chargingSpeed}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-xs text-gray-500">Price per Hour</span>
          <p className="text-sm font-medium text-green-600">₹{station.pricePerHour}</p>
        </div>
        <div>
          <span className="text-xs text-gray-500">Operating Hours</span>
          <p className="text-sm font-medium">{station.operatingHours.open} - {station.operatingHours.close}</p>
        </div>
      </div>
      
      {station.connectorTypes && station.connectorTypes.length > 0 && (
        <div className="mb-3">
          <span className="text-xs text-gray-500">Connector Types</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {station.connectorTypes.map((type, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded">
                {type}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {station.amenities && station.amenities.length > 0 && (
        <div>
          <span className="text-xs text-gray-500">Amenities</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {station.amenities.slice(0, 3).map((amenity, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                {amenity}
              </span>
            ))}
            {station.amenities.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                +{station.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
      
      {station.availableSlots > 0 && (
        <div className="mt-4 pt-3 border-t">
          <button 
            className="btn-primary w-full text-sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(station, true); // true indicates booking action
            }}
          >
            Book Now
          </button>
        </div>
      )}
    </div>
  );
};

export default StationCard;