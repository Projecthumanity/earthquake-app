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
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import EarthquakeMap from './EarthquakeMap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [nepalEarthquakes, setNepalEarthquakes] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('nepal');
  const [userLocation, setUserLocation] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const regions = React.useMemo(() => ({
    nepal: {
      name: 'Nepal Region',
      coordinates: [28.3949, 84.1240],
      radius: 500
    },
    global: {
      name: 'Global',
      coordinates: [0, 0],
      radius: 18000
    },
    user: {
      name: 'My Location',
      coordinates: userLocation,
      radius: 300
    }
  }), [userLocation]);

  const detectUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.latitude, position.coords.longitude];
          setUserLocation(coords);
          setSelectedRegion('user');
          fetchDataForRegion('user', coords);
        },
        (error) => {
          console.error('Location error:', error);
          setError('Could not detect location. Please select a region manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  const fetchDataForRegion = React.useCallback(async (regionKey, coordinates = null) => {
    try {
      setIsLoading(true);
      setError(null);

      const region = regions[regionKey];
      const coords = coordinates || region.coordinates;

      if (!coords) {
        throw new Error('Invalid coordinates for region');
      }

      const response = await fetch(
        `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&` +
        `starttime=${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}&` +
        `latitude=${coords[0]}&` +
        `longitude=${coords[1]}&` +
        `maxradiuskm=${region.radius}&` +
        `minmagnitude=2.5`
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      setNepalEarthquakes(data.features || []);
      setLastUpdate(new Date().toLocaleString());
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Failed to fetch earthquake data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [regions]);

  const prepareChartData = React.useCallback(() => {
    if (!nepalEarthquakes.length) return [];
    
    return nepalEarthquakes
      .slice(0, 10)
      .map(eq => ({
        time: new Date(eq.properties.time).toLocaleDateString(),
        magnitude: Number(eq.properties.mag.toFixed(1))
      }))
      .reverse();
  }, [nepalEarthquakes]);

  // Initial data fetch
  useEffect(() => {
    fetchDataForRegion(selectedRegion);
    const interval = setInterval(() => fetchDataForRegion(selectedRegion), 300000);
    return () => clearInterval(interval);
  }, [selectedRegion, fetchDataForRegion]);

  // Debug logging
  useEffect(() => {
    console.log('Nepal Earthquakes:', nepalEarthquakes);
    console.log('Chart Data:', prepareChartData());
  }, [nepalEarthquakes, prepareChartData]);

  const handleRegionChange = (event) => {
    const region = event.target.value;
    setSelectedRegion(region);
    setError(null); // Clear any previous errors
  };

  return (
    <Container maxWidth="lg" sx={{ mt: isMobile ? 1 : 2, mb: isMobile ? 2 : 4 }}>
      <Grid container spacing={isMobile ? 2 : 3}>
        {/* Region Selection - More mobile friendly */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              gap: 2, 
              alignItems: isMobile ? 'stretch' : 'center'
            }}>
              <FormControl fullWidth={isMobile}>
                <InputLabel>Select Region</InputLabel>
                <Select
                  value={selectedRegion}
                  onChange={handleRegionChange}
                  label="Select Region"
                >
                  <MenuItem value="nepal">Nepal Region</MenuItem>
                  <MenuItem value="global">Global</MenuItem>
                  {userLocation && (
                    <MenuItem value="user">My Location</MenuItem>
                  )}
                </Select>
              </FormControl>
              <Button
                fullWidth={isMobile}
                startIcon={<MyLocationIcon />}
                onClick={detectUserLocation}
                variant="outlined"
                sx={{ whiteSpace: 'nowrap' }}
              >
                {isMobile ? 'Detect Location' : 'Detect My Location'}
              </Button>
              <Tooltip title="Refresh Data">
                <span>
                  <IconButton 
                    onClick={() => fetchDataForRegion(selectedRegion)} 
                    disabled={isLoading}
                  >
                    <RefreshIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Bar */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography>
                Last Updated: {lastUpdate || 'Never'}
              </Typography>
              <Tooltip title="Refresh Data">
                <IconButton onClick={() => fetchDataForRegion(selectedRegion)} disabled={isLoading}>
                  <RefreshIcon />
                </IconButton>
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

        {/* Map and Statistics Layout */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: isMobile ? '400px' : '500px' }}>
            <CardContent sx={{ height: '100%', p: isMobile ? 1 : 2 }}>
              {isLoading ? (
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
                  <CircularProgress />
                  <Typography sx={{ mt: 2 }}>Loading earthquake data...</Typography>
                </Box>
              ) : (
                <EarthquakeMap 
                  earthquakes={nepalEarthquakes}
                  center={userLocation && selectedRegion === 'user' 
                    ? userLocation 
                    : regions[selectedRegion].coordinates}
                  zoom={selectedRegion === 'global' ? 2 : 7}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics with responsive chart */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {selectedRegion === 'nepal' ? 'Nepal Region' : regions[selectedRegion].name} Statistics
              </Typography>
              <Box sx={{ 
                height: isMobile ? 250 : 300, 
                mt: 2,
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}>
                {nepalEarthquakes.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={prepareChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="time"
                        angle={isMobile ? -65 : -45}
                        textAnchor="end"
                        height={60}
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                      />
                      <YAxis 
                        domain={[0, 'auto']}
                        label={{ 
                          value: 'Magnitude', 
                          angle: -90, 
                          position: 'insideLeft',
                          fontSize: isMobile ? 12 : 14
                        }}
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                      />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="magnitude" 
                        stroke="#8884d8" 
                        name="Magnitude"
                        dot={{ r: isMobile ? 3 : 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Typography color="text.secondary">No data available</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Earthquakes List - More compact on mobile */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Earthquakes in {regions[selectedRegion].name}
              </Typography>
              <Grid container spacing={isMobile ? 1 : 2}>
                {nepalEarthquakes.slice(0, 5).map((eq) => (
                  <Grid item xs={12} key={eq.id}>
                    <Card 
                      variant="outlined"
                      sx={{ 
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          transition: 'background-color 0.3s'
                        }
                      }}
                    >
                      <CardContent sx={{ py: isMobile ? 1 : 2 }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={3} sm={2}>
                            <Typography 
                              variant={isMobile ? "h5" : "h4"} 
                              color={eq.properties.mag >= 5 ? 'error' : 'primary'}
                              sx={{ textAlign: 'center' }}
                            >
                              {eq.properties.mag.toFixed(1)}
                            </Typography>
                          </Grid>
                          <Grid item xs={9} sm={10}>
                            <Typography 
                              variant={isMobile ? "body2" : "subtitle1"}
                              sx={{ wordBreak: 'break-word' }}
                            >
                              {eq.properties.place}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              {new Date(eq.properties.time).toLocaleString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">Debug Information</Typography>
                <Typography>Data Loading: {isLoading ? 'Yes' : 'No'}</Typography>
                <Typography>Nepal Earthquakes Count: {nepalEarthquakes.length}</Typography>
                <Typography>Last Update: {lastUpdate}</Typography>
                {error && <Typography color="error">Error: {error}</Typography>}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default Dashboard;