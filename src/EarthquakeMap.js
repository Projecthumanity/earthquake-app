import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const EarthquakeMap = ({ earthquakes }) => {
  return (
    <MapContainer
      center={[27.7172, 85.3240]} // Kathmandu, Nepal
      zoom={7}
      style={{ height: '600px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© OpenStreetMap contributors'
      />
      {earthquakes.map((eq, index) => (
        <Marker
          key={index}
          position={[
            eq.geometry.coordinates[1],
            eq.geometry.coordinates[0],
          ]}
        >
          <Popup>
            <div>
              <strong>Magnitude:</strong> {eq.properties.mag}<br />
              <strong>Location:</strong> {eq.properties.place}<br />
              <strong>Time:</strong> {new Date(eq.properties.time).toLocaleString()}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default EarthquakeMap;