import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from './App';

// Mock axios
jest.mock('axios');

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn()
};
global.navigator.geolocation = mockGeolocation;

// Mock notification API
global.Notification = {
  requestPermission: jest.fn(),
  permission: 'granted'
};

describe('App Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    localStorage.clear();
    
    // Mock successful API response
    axios.get.mockResolvedValue({
      data: {
        features: [
          {
            id: '1',
            properties: {
              mag: 4.5,
              place: 'Test Location',
              time: new Date().getTime()
            },
            geometry: {
              coordinates: [-122.24, 37.81]
            }
          }
        ]
      }
    });
  });

  test('renders earthquake dashboard title', () => {
    render(<App />);
    expect(screen.getByText('Earthquake Monitoring Dashboard')).toBeInTheDocument();
  });

  test('toggles theme when button is clicked', async () => {
    render(<App />);
    const themeButton = screen.getByRole('button');
    
    await userEvent.click(themeButton);
    expect(localStorage.getItem('theme')).toBe('dark');

    await userEvent.click(themeButton);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  test('fetches and displays earthquake data', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Location')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/4.5/)).toBeInTheDocument();
    });
  });

  test('shows loading state while fetching data', () => {
    render(<App />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('shows error message when API fails', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch earthquake data')).toBeInTheDocument();
    });
  });

  test('handles geolocation successfully', async () => {
    const mockPosition = {
      coords: {
        latitude: 37.7749,
        longitude: -122.4194
      }
    };

    mockGeolocation.getCurrentPosition.mockImplementation((success) => 
      success(mockPosition)
    );

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/37.7749/)).toBeInTheDocument();
    });
  });
});
