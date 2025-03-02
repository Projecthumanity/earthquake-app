import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { 
  Typography, 
  AppBar, Toolbar, Box,
  Snackbar, Alert, Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import About from './pages/home/About';
import Contact from './pages/home/Contact';
import Settings from './pages/home/Settings';
import ErrorBoundary from './components/ErrorBoundary';
import styles from './styles/App.module.css';
import Navigation from './components/Navigation';
import useLocation from './hooks/useLocation';

// Styled components for better icon alignment

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [earthquakes, setEarthquakes] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const { location, error: locationError, permissionStatus, requestLocation } = useLocation();

  const audioRef = useRef(new Audio('/sounds/alert-sound.mp3'));

  // Initialize audio
  useEffect(() => {
    const audio = audioRef.current;
    audio.preload = 'auto';
    
    const initAudio = async () => {
      try {
        await audio.load();
      } catch (error) {
        console.error('Audio initialization failed:', error);
      }
    };

    const handleClick = () => {
      if (!audio.initialized) {
        initAudio();
        audio.initialized = true;
      }
    };

    document.addEventListener('click', handleClick, { once: true });
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Data fetching
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await axios.get(
        'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson'
      );

      if (response.data && response.data.features) {
        const newFeatures = response.data.features.filter(feature => 
          !earthquakes.some(eq => eq.id === feature.id)
        );

        if (newFeatures.length > 0) {
          setEarthquakes(prevEarthquakes => [...newFeatures, ...prevEarthquakes]);
          setLastUpdateTime(new Date().toLocaleString());
        }
      }
    } catch (error) {
      setError('Failed to fetch earthquake data: ' + error.message);
      console.error('Error fetching earthquake data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [earthquakes]);

  // Initial setup effects
  useEffect(() => {
    if (permissionStatus === 'granted') {
      setShowLocationPrompt(false);
    }
  }, [permissionStatus]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Chart data preparation
  const prepareChartData = useCallback(() => {
    return earthquakes
      .slice(0, 10)
      .reverse()
      .map(eq => ({
        time: new Date(eq.properties.time).toLocaleTimeString(),
        magnitude: parseFloat(eq.properties.mag.toFixed(1)),
      }));
  }, [earthquakes]);

  // Theme configuration
  const muiTheme = createTheme({
    palette: {
      mode: theme,
      primary: {
        main: theme === 'light' ? '#1976d2' : '#90caf9',
      },
      background: {
        default: theme === 'light' ? '#ffffff' : '#121212',
        paper: theme === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
  });

  const fetchDataForRegion = (region) => {
    setSelectedRegion(region);
    // Add specific data fetching logic based on the selected region
    fetchData();
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="fixed" elevation={1}>
          <Toolbar variant="dense" sx={{ minHeight: { xs: 56, sm: 64 } }}>
            <div className={styles.headerContent}>
              <div className={styles.logoContainer}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                  <img
                    src="/images/Earthquake.png"
                    alt="Earthquake Monitor Logo"
                    className={styles.logo}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      display: { xs: 'none', sm: 'block' },
                      fontSize: { sm: '1.25rem' },
                      color: 'inherit',
                      ml: 2
                    }}
                  >
                    Earthquake Monitor
                  </Typography>
                </Link>
              </div>

              {lastUpdateTime && (
                <Typography 
                  variant="caption"
                  sx={{ 
                    color: 'inherit',
                    opacity: 0.8
                  }}
                >
                  Last updated: {lastUpdateTime}
                </Typography>
              )}
            </div>
          </Toolbar>
        </AppBar>

        <main className={styles.content}>
          <Routes>
            <Route path="/" element={
              <ErrorBoundary>
                <Dashboard 
                  chartData={prepareChartData()}
                  userLocation={location}
                  selectedRegion={selectedRegion}
                  onRegionChange={fetchDataForRegion}
                  isLoading={isLoading}
                />
              </ErrorBoundary>
            } />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>

        <Navigation />

        {/* Location Permission Prompt */}
        <Snackbar
          open={showLocationPrompt && permissionStatus === 'prompt'}
          autoHideDuration={null}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{ mb: 4 }}
        >
          <Alert 
            severity="info"
            action={
              <Button 
                color="inherit"
                size="small"
                onClick={() => {
                  requestLocation();
                  setShowLocationPrompt(false);
                }}
              >
                Enable Location
              </Button>
            }
          >
            Allow location access for accurate earthquake monitoring in your area
          </Alert>
        </Snackbar>

        {/* Location Error Alert */}
        <Snackbar
          open={!!locationError}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="warning">
            {locationError}
          </Alert>
        </Snackbar>

        {/* API Error Alert */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;