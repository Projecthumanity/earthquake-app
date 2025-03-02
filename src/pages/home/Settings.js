import React from 'react';
import { Container, Typography, Paper, Switch, FormGroup, FormControlLabel } from '@mui/material';

function Settings() {
  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <FormGroup>
          <FormControlLabel 
            control={<Switch />} 
            label="Enable Notifications" 
          />
          <FormControlLabel 
            control={<Switch />} 
            label="Dark Mode" 
          />
        </FormGroup>
      </Paper>
    </Container>
  );
}

export default Settings;