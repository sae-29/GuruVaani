import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Tabs,
  Tab,
  Avatar,
  Menu,
  MenuItem,
  Container,
  Badge,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);

  // Determine active tab based on current route
  const routeToTab: Record<string, number> = {
    '/dashboard': 0,
    '/entries': 1,
    '/clusters': 2,
    '/modules': 3,
    '/analytics': 4,
  };

  const currentTab = routeToTab[location.pathname] ?? 0;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    const routes = ['/dashboard', '/entries', '/clusters', '/modules', '/analytics'];
    navigate(routes[newValue]);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top App Bar */}
      <AppBar position="static" elevation={1} sx={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E0E0E0' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Typography
              variant="h3"
              sx={{ color: 'primary.main', fontWeight: 700, cursor: 'pointer' }}
              onClick={() => navigate('/dashboard')}
            >
              🙏 Guru Vaani
            </Typography>
          </Box>

          {/* Right Actions */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              size="small"
              startIcon={
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              }
              onClick={handleNotificationsOpen}
              sx={{ color: 'text.primary' }}
            >
              Notifications
            </Button>

            {/* Notifications Menu */}
            <Menu
              anchorEl={notificationsAnchor}
              open={Boolean(notificationsAnchor)}
              onClose={handleNotificationsClose}
              PaperProps={{ sx: { width: 300 } }}
            >
              <MenuItem>New cluster detected: Math Anxiety (15 teachers)</MenuItem>
              <MenuItem>Training dispatched to 42 teachers</MenuItem>
              <MenuItem>Module "Fractions" completed by 28 teachers</MenuItem>
            </Menu>

            <Avatar
              onClick={handleMenuOpen}
              sx={{ cursor: 'pointer', backgroundColor: 'primary.main', width: 40, height: 40 }}
            >
              AD
            </Avatar>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem>My Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>

        {/* Navigation Tabs */}
        <Toolbar
          variant="dense"
          sx={{
            borderTop: '1px solid #E0E0E0',
            justifyContent: 'flex-start',
            gap: 0,
            backgroundColor: '#FAFAFA',
          }}
        >
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: 14,
                fontWeight: 500,
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main',
                height: 4,
              },
            }}
          >
            <Tab label="Overview" />
            <Tab label="Entries" />
            <Tab label="Clusters" />
            <Tab label="Modules" />
            <Tab label="Analytics" />
          </Tabs>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1, py: 3, overflowY: 'auto' }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          backgroundColor: '#FAFAFA',
          borderTop: '1px solid #E0E0E0',
          py: 2,
          px: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Guru Vaani Admin Dashboard © 2026 | DIET/SCERT
        </Typography>
      </Box>
    </Box>
  );
};
