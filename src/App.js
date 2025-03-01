import { useState, useEffect } from 'react';
import axios from 'axios';
import EarthquakeMap from './EarthquakeMap'; // Fix case sensitivity
import './App.css';

function App() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1); // Get last month's data
    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    };
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const dates = getDateRange();
      const response = await axios.get(
        `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${dates.start}&endtime=${dates.end}&minmagnitude=4.1`
      );
      setEarthquakes(response.data.features);

      // Add notification permission check
      if (response.data.features.length > 0) {
        const latestEarthquake = response.data.features[0];
        if (latestEarthquake.properties.mag >= 4.1 && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification('Earthquake Alert!', {
              body: `Magnitude ${latestEarthquake.properties.mag} detected near ${latestEarthquake.properties.place}!`,
            });
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission();
          }
        }
      }
    } catch (error) {
      setError('Failed to fetch earthquake data');
      console.error('Error fetching earthquake data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data immediately and then every 60 seconds
    fetchData();
    const intervalId = setInterval(fetchData, 60000);
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="App">
      <h1>Earthquake Detection App</h1>
      {error && <div className="error-message">{error}</div>}
      {isLoading ? (
        <div>Loading earthquake data...</div>
      ) : (
        <>
          <EarthquakeMap earthquakes={earthquakes} />
          <h2>Recent Earthquakes</h2>
          {earthquakes.length === 0 ? (
            <p>No earthquakes found.</p>
          ) : (
            <ul style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
              {earthquakes.map((eq) => (
                <li key={eq.id || eq.properties.time}>
                  <strong>Magnitude:</strong> {eq.properties.mag.toFixed(1)} |{' '}
                  <strong>Location:</strong> {eq.properties.place} |{' '}
                  <strong>Time:</strong> {new Date(eq.properties.time).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default App;