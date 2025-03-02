import React, { useState } from 'react';
import { 
  Container, Typography, Paper, Switch, FormGroup, 
  FormControlLabel, Slider, Box, Divider 
} from '@mui/material';

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Safety Settings
        </Typography>
        <Box sx={{ mt: 4 }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch 
                  checked={notifications} 
                  onChange={(e) => setNotifications(e.target.checked)}
                />
              }
              label="Emergency Notifications"
            />
            <FormControlLabel
              control={
                <Switch 
                  checked={soundAlerts} 
                  onChange={(e) => setSoundAlerts(e.target.checked)}
                />
              }
              label="Alert Sounds"
            />
          </FormGroup>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Alert Thresholds
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>
              Minimum Magnitude for Alerts
            </Typography>
            <Slider
              defaultValue={4.0}
              step={0.1}
              min={2.0}
              max={7.0}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Settings;