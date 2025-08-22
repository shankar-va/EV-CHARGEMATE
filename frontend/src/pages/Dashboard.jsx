import React, { useState, useEffect } from 'react';
import MapView from '../components/MapView';
import StationCard from '../components/StationCard';
import BookingForm from '../components/BookingForm';
import { stationService } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [searchRadius, setSearchRadius] = useState(10);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    getUserLocation();
    fetchStations();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Use default Salem coordinates
          setUserLocation({ lat: 11.6643, lng: 78.1460 });
        }
      );
    } else {
      setUserLocation({ lat: 11.6643, lng: 78.1460 });
    }
  };

  const fetchStations = async (params = {}) => {
    try {
      setLoading(true);
      const response = await stationService.getStations(params);
      if (response.data.success) {
        setStations(response.data.stations);
      } else {
        toast.error('Failed to fetch charging stations');
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
      toast.error('Failed to fetch charging stations');
    } finally {
      setLoading(false);
    }
  };

  const handleStationSelect = (station, shouldShowBooking = false) => {
    setSelectedStation(station);
    if (shouldShowBooking && station.availableSlots > 0) {
      setShowBookingForm(true);
    }
  };

  const handleBookingSuccess = () => {
    // Refresh stations to update availability
    fetchStations(userLocation ? { ...userLocation, radius: searchRadius } : {});
    setSelectedStation(null);
  };

  const handleSearchNearby = () => {
    if (userLocation) {
      fetchStations({ ...userLocation, radius: searchRadius });
      toast.success(`Searching within ${searchRadius}km radius`);
    } else {
      toast.error('Location not available');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">EV Charging Stations</h1>
          <p className="text-gray-600">Find and book nearby charging stations</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Radius:</label>
            <select
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="form-input w-20 text-sm"
            >
              <option value={5}>5km</option>
              <option value={10}>10km</option>
              <option value={20}>20km</option>
              <option value={50}>50km</option>
            </select>
          </div>
          <button
            onClick={handleSearchNearby}
            className="btn-primary text-sm"
          >
            Search Nearby
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Station Locations</h2>
        <MapView
          stations={stations}
          onStationSelect={handleStationSelect}
          selectedStation={selectedStation}
        />
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>Full</span>
          </div>
        </div>
      </div>

      {/* Station List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Available Stations ({stations.length})</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : stations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No stations found</h3>
            <p className="text-gray-600">Try adjusting your search radius or location</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stations.map((station) => (
              <StationCard
                key={station._id}
                station={station}
                onSelect={handleStationSelect}
                isSelected={selectedStation?._id === station._id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && selectedStation && (
        <BookingForm
          station={selectedStation}
          onClose={() => setShowBookingForm(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;