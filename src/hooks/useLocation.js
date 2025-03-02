import { useState } from 'react';

const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('prompt');

  const requestLocation = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      setPermissionStatus(permission.state);

      if (permission.state === 'granted') {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
            setError(null);
          },
          (err) => {
            setError(`Error getting location: ${err.message}`);
            setLocation(null);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      }
    } catch (err) {
      setError('Location permission not supported');
    }
  };

  return { location, error, permissionStatus, requestLocation };
};

export default useLocation;