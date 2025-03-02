import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Marker } from 'react-leaflet';
import { Typography, Box, Alert } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './EarthquakeMap.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

const getMarkerColor = (magnitude) => {
  if (magnitude >= 6) return '#ff0000';
  if (magnitude >= 5) return '#ff6600';
  if (magnitude >= 4) return '#ffa500';
  return '#ffcc00';
};

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function EarthquakeMap({ earthquakes = [], center = [28.3949, 84.1240], zoom = 7 }) {
  const [userPosition, setUserPosition] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([position.coords.latitude, position.coords.longitude]);
          setLocationError(null);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
    }
  }, []);

  if (!earthquakes || earthquakes.length === 0) {
    return (
      <Box sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        gap: 2,
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 1,
        p: 2
      }}>
        <Typography variant="h6" color="text.secondary">
          No earthquake data available
        </Typography>
        {locationError && (
          <Alert severity="error" sx={{ maxWidth: '80%' }}>
            {locationError}
          </Alert>
        )}
      </Box>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <ChangeView center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {userPosition && (
        <Marker 
          position={userPosition}
          icon={new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: markerShadow,
            shadowSize: [41, 41]
          })}
        >
          <Popup>
            <Typography>Your Location</Typography>
          </Popup>
        </Marker>
      )}
      {earthquakes.map((eq) => {
        if (!eq.geometry?.coordinates) return null;
        
        const [longitude, latitude, depth] = eq.geometry.coordinates;
        return (
          <CircleMarker
            key={eq.id || `${eq.properties.time}-${latitude}-${longitude}`}
            center={[latitude, longitude]}
            radius={Math.max(6, eq.properties.mag * 2)}
            fillColor={getMarkerColor(eq.properties.mag)}
            color="#ffffff"
            weight={1}
            opacity={1}
            fillOpacity={0.7}
          >
            <Popup>
              <div className="earthquake-popup">
                <Typography variant="h6" gutterBottom>
                  Magnitude {eq.properties.mag.toFixed(1)}
                </Typography>
                <Typography variant="body1">
                  {eq.properties.place}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Time: {new Date(eq.properties.time).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Depth: {depth.toFixed(1)} km
                </Typography>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}

export default EarthquakeMap;