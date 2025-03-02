import React from 'react';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';

function Contact() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Emergency Contact Information
        </Typography>
        <Typography paragraph color="text.secondary" sx={{ mb: 4 }}>
          For immediate earthquake assistance or to report seismic activity.
        </Typography>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Your Name"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Emergency Contact Number"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Location"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Message"
            multiline
            rows={4}
            margin="normal"
            required
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3 }}
          >
            Send Emergency Alert
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Contact;