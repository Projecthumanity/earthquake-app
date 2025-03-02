import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

function About() {
  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          About Earthquake Monitor
        </Typography>
        <Typography paragraph>
          A real-time earthquake monitoring system that provides accurate and timely information
          about seismic activities around the world.
        </Typography>
      </Paper>
    </Container>
  );
}

export default About;