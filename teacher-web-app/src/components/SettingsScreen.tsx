import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  AppBar,
  Toolbar,
  Avatar,
  Button,
  Alert,
} from '@mui/material';
import {
  Person,
  Notifications,
  Language,
  Security,
  Help,
  Logout,
  CloudSync,
  DataUsage,
  School,
} from '@mui/icons-material';

interface SettingsScreenProps {
  user: any;
  onLogout: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ user, onLogout }) => {
  const [settings, setSettings] = React.useState({
    pushNotifications: true,
    emailNotifications: true,
    trainingReminders: true,
    offlineMode: true,
    autoSync: true,
  });

  const handleSettingChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.checked,
    }));
  };

  return (
    <Box sx={{ maxWidth: '390px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#757575', maxWidth: '390px', margin: '0 auto' }}>
        <Toolbar sx={{ minHeight: 56, px: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontSize: '18px' }}>
            Settings
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2, pb: 2 }}>
        {/* Profile Section */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: '#FF7043',
                  mr: 2,
                  fontSize: '24px',
                }}
              >
                {user?.name?.split(' ').map((n: string) => n[0]).join('') || 'T'}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {user?.name || 'Teacher Name'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email || 'teacher@school.edu.in'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.school || 'School Name'}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Person />}
              fullWidth
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Sync Status */}
        <Alert severity="success" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CloudSync sx={{ mr: 1 }} />
            <Typography variant="body2">
              All data synced • Last sync: 2 minutes ago
            </Typography>
          </Box>
        </Alert>

        {/* Notifications */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText
                  primary="Push Notifications"
                  secondary="Get notified about new training recommendations"
                />
                <Switch
                  checked={settings.pushNotifications}
                  onChange={handleSettingChange('pushNotifications')}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <School />
                </ListItemIcon>
                <ListItemText
                  primary="Training Reminders"
                  secondary="Remind me to complete ongoing trainings"
                />
                <Switch
                  checked={settings.trainingReminders}
                  onChange={handleSettingChange('trainingReminders')}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              App Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CloudSync />
                </ListItemIcon>
                <ListItemText
                  primary="Auto Sync"
                  secondary="Automatically sync data when connected"
                />
                <Switch
                  checked={settings.autoSync}
                  onChange={handleSettingChange('autoSync')}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DataUsage />
                </ListItemIcon>
                <ListItemText
                  primary="Offline Mode"
                  secondary="Save data locally when offline"
                />
                <Switch
                  checked={settings.offlineMode}
                  onChange={handleSettingChange('offlineMode')}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Other Options */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Other Options
            </Typography>
            <List>
              <ListItem button>
                <ListItemIcon>
                  <Language />
                </ListItemIcon>
                <ListItemText
                  primary="Language"
                  secondary="English"
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <Security />
                </ListItemIcon>
                <ListItemText
                  primary="Privacy & Security"
                  secondary="Manage your privacy settings"
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <Help />
                </ListItemIcon>
                <ListItemText
                  primary="Help & Support"
                  secondary="Get help and contact support"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              My Statistics
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <Box>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  47
                </Typography>
                <Typography variant="caption">Total Reflections</Typography>
              </Box>
              <Box>
                <Typography variant="h5" color="secondary" fontWeight="bold">
                  12
                </Typography>
                <Typography variant="caption">Trainings Completed</Typography>
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: '#FFD700' }} fontWeight="bold">
                  15
                </Typography>
                <Typography variant="caption">Day Streak</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<Logout />}
              onClick={onLogout}
            >
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Box sx={{ textAlign: 'center', mt: 3, opacity: 0.7 }}>
          <Typography variant="caption">
            Guru Vaani Teacher App v1.0.0
          </Typography>
          <br />
          <Typography variant="caption">
            © 2024 Guru Vaani. Empowering Teachers.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsScreen;