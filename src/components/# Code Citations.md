# Code Citations

## License: GPL_2_0
https://github.com/specify/specify7/tree/ced3e2716b118ae4b1160e21aac9195e296bcc85/specifyweb/frontend/js_src/lib/leafletextend.ts

```
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist
```


## License: unknown
https://github.com/iliuta/strava-client/tree/c976c9c22a3c88920f7b0f9e523f6f9dfdc29a72/src/main/frontend/src/js/map.js

```
/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const
```


## License: MIT
https://github.com/boti7/PassivityMap/tree/a6bc76ec30e4f2a64efbb33786d54e17fa6c79e8/admin/src/components/Map.vue

```
.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/
```


## License: unknown
https://github.com/AlexeiCocu/react_pwa_1/tree/434ed42a85617536c90b803aa397bfeb74fb7a71/src/Components/MapView.js

```
L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.
```


## License: unknown
https://github.com/PaulLeCam/react-leaflet/tree/9be06c0c1bb1e355f468393ac31ecb19e9a1f20d/packages/website/docs/example-map-placeholder.md

```
<TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{
```

## License: MIT
https://github.com/your-repo/your-project

```markdown
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Alert,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import EarthquakeMap from './EarthquakeMap';

function Dashboard() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use USGS API for all earthquakes in the past day
      const response = await fetch(
        'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'EarthquakeMonitor/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched data:', data); // Debug log
      
      if (data.features && Array.isArray(data.features)) {
        setEarthquakes(data.features);
        setLastUpdate(new Date().toLocaleString());
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Failed to fetch earthquake data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Status Bar */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography>
                Last Updated: {lastUpdate || 'Never'}
              </Typography>
              <Tooltip title="Refresh Data">
                <span>
                  <IconButton onClick={fetchData} disabled={isLoading}>
                    <RefreshIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </CardContent>
          </Card>
        </Grid>

        {/* Error Display */}
        {error && (
          <Grid item xs={12}>
            <Alert severity="error" variant="filled">
              {error}
            </Alert>
          </Grid>
        )}

        {/* Map Display */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '500px' }}>
            <CardContent sx={{ height: '100%', p: 2 }}>
              {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <CircularProgress />
                </Box>
              ) : (
                <EarthquakeMap earthquakes={earthquakes} />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Earthquakes List */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Earthquakes
              </Typography>
              {earthquakes.slice(0, 5).map((eq) => (
                <Card 
                  key={eq.id} 
                  variant="outlined" 
                  sx={{ mb: 1, p: 1 }}
                >
                  <Typography variant="h5" color={eq.properties.mag >= 5 ? 'error' : 'primary'}>
                    {eq.properties.mag.toFixed(1)}
                  </Typography>
                  <Typography variant="body1">{eq.properties.place}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(eq.properties.time).toLocaleString()}
                  </Typography>
                </Card>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
```

## License: MIT
https://github.com/your-repo/your-project

```markdown
import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Typography, Box } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './EarthquakeMap.css';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const getMarkerColor = (magnitude) => {
  if (magnitude >= 6) return '#ff0000';
  if (magnitude >= 5) return '#ff6600';
  if (magnitude >= 4) return '#ffa500';
  return '#ffcc00';
};

function EarthquakeMap({ earthquakes = [] }) {
  if (!earthquakes || earthquakes.length === 0) {
    return (
      <Box 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: 1
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No earthquake data available
        </Typography>
      </Box>
    );
  }

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
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

