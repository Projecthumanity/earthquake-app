import React from 'react';
import { 
  Container, Typography, Paper, Grid, Box, 
  Card, CardContent
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

function About() {
  return (
    <Container maxWidth="lg" sx={{ mt: 9, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* Header Section */}
          <Grid item xs={12} textAlign="center">
            <Box sx={{ mb: 4 }}>
              <WarningIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h3" gutterBottom>
                About Earthquake Monitor
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Keeping Communities Safe Through Real-time Earthquake Monitoring
              </Typography>
            </Box>
          </Grid>

          {/* Mission Section */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Our Mission
                </Typography>
                <Typography paragraph>
                  Earthquake Monitor is dedicated to providing real-time earthquake information 
                  and early warnings to help communities stay safe and prepared. Our platform 
                  combines advanced monitoring technology with user-friendly interfaces to deliver 
                  critical seismic data when it matters most.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Features Section */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Key Features
            </Typography>
            <Grid container spacing={3}>
              {[
                {
                  title: "Real-time Monitoring",
                  description: "Continuous tracking of seismic activities worldwide"
                },
                {
                  title: "Instant Alerts",
                  description: "Immediate notifications for earthquakes in your area"
                },
                {
                  title: "Interactive Maps",
                  description: "Visual representation of seismic events and their impact"
                }
              ].map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Data Source Section */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Data Sources
                </Typography>
                <Typography paragraph>
                  Our data is sourced from the United States Geological Survey (USGS), 
                  providing accurate and reliable seismic information from around the globe.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default About;