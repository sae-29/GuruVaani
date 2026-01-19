import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Description,
  Analytics,
  Settings,
  Notifications,
  AccountCircle,
  Logout,
  School,
  VideoLibrary,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 240;

interface NavigationItem {
  text: string;
  icon: React.ReactElement;
  path: string;
}

const navigationItems: NavigationItem[] = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Teachers', icon: <People />, path: '/teachers' },
  { text: 'Reflections', icon: <Description />, path: '/reflections' },
  { text: 'Modules', icon: <VideoLibrary />, path: '/modules' },
  { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const Layout: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Mock user data - in real app, this would come from Redux
  const user = {
    name: 'Admin User',
    email: 'admin@guruvaani.edu.in',
    role: 'System Administrator',
    avatar: null,
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    // Handle logout logic
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box>
      {/* Logo and Title */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: 2,
          backgroundColor: theme.palette.primary.main,
          color: 'white',
        }}
      >
        <School sx={{ mr: 1, fontSize: 32 }} />
        <Box>
          <Typography variant="h6" noWrap component="div" fontWeight="bold">
            Guru Vaani
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Admin Dashboard
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navigation Items */}
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: `${theme.palette.primary.main}20`,
                  borderRight: `3px solid ${theme.palette.primary.main}`,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                  '& .MuiListItemText-primary': {
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {navigationItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit" sx={{ mr: 1 }}>
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: { xs: 'none', md: 'block' }, mr: 2, textAlign: 'right' }}>
              <Typography variant="body2" fontWeight="medium">
                {user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.role}
              </Typography>
            </Box>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {user.avatar ? (
                <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
              ) : (
                <Avatar sx={{ width: 32, height: 32, backgroundColor: theme.palette.primary.main }}>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <AccountCircle sx={{ mr: 2 }} />
          Profile Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="navigation"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'grey.50',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;