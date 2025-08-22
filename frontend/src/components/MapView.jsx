import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon issue with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapView = ({ stations = [], onStationSelect, selectedStation }) => {
  const defaultCenter = [11.6643, 78.1460]; // Salem fallback

  return (
    <MapContainer center={defaultCenter} zoom={13} style={{ height: "400px", width: "100%" }}>
      {/* OpenStreetMap tiles */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />

      {/* Markers for all stations */}
      {stations.map((station) => (
        <Marker
          key={station._id}
          position={[station.location.lat, station.location.lng]}
          eventHandlers={{
            click: () => onStationSelect(station, true),
          }}
        >
          <Popup>
            <div className="space-y-1">
              <h3 className="font-bold">{station.name}</h3>
              <p className="text-sm">{station.address}</p>
              <p className="text-sm">
                Slots: {station.availableSlots}/{station.totalSlots}
              </p>
              <p className="text-green-600 font-medium">
                ₹{station.pricePerHour}/hour
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
