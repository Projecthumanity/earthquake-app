import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

function Contact() {
  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Contact Us
        </Typography>
        <Typography paragraph>
          For support or inquiries, please reach out to us at:
          support@earthquakemonitor.com
        </Typography>
      </Paper>
    </Container>
  );
}

export default Contact;