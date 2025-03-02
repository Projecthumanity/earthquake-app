import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Home as HomeIcon,
  Info as InfoIcon,
  ContactPhone as ContactIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

function Layout({ children }) {
  const location = useLocation();
  const drawerWidth = 240;

  const menuItems = [
    { text: 'Home', path: '/', icon: <HomeIcon />, exact: true },
    { text: 'About', path: '/about', icon: <InfoIcon /> },
    { text: 'Contact', path: '/contact', icon: <ContactIcon /> },
    { text: 'Settings', path: '/settings', icon: <SettingsIcon /> }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box 
              component="img"
              src={process.env.PUBLIC_URL + '/images/Earthquake.png'}
              alt="Earthquake Monitor Logo"
              sx={{ 
                height: 40,
                width: 'auto',
                mr: 2,
                display: 'block'
              }}
              onError={(e) => {
                console.error('Logo loading error');
                e.target.style.display = 'none';
              }}
            />
            <Typography variant="h6" noWrap component="div">
              Earthquake Monitor
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '64px',
            height: 'calc(100% - 64px)'
          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          mt: 8,
          width: `calc(100% - ${drawerWidth}px)` 
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout;