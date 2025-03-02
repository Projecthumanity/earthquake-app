import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

function Navigation() {
  return (
    <Box sx={{ 
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 1000 
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          sx={{
            borderRadius: '50%',
            minWidth: '56px',
            width: '56px',
            height: '56px',
            padding: 0,
            '& .MuiButton-startIcon': {
              margin: 0
            }
          }}
        >
          <span className="visually-hidden">Home</span>
        </Button>
      </Link>
    </Box>
  );
}

export default Navigation;