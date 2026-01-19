import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  Button,
  Container,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Mic, Notifications, CheckCircle } from '@mui/icons-material';

const PermissionsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [microphoneGranted, setMicrophoneGranted] = useState(false);
  const [notificationsGranted, setNotificationsGranted] = useState(false);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophoneGranted(true);
      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.warn('Microphone permission denied:', err);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsGranted(permission === 'granted');
    }
  };

  const handleContinue = () => {
    navigate('/onboarding/profile');
  };

  const handleSkip = () => {
    navigate('/onboarding/profile');
  };

  const permissions = [
    {
      icon: <Mic sx={{ fontSize: 48, color: microphoneGranted ? '#26A69A' : '#FF7043' }} />,
      title: 'Voice Recording',
      description: 'For audio diary entries',
      granted: microphoneGranted,
      onRequest: requestMicrophonePermission,
    },
    {
      icon: (
        <Notifications
          sx={{ fontSize: 48, color: notificationsGranted ? '#26A69A' : '#FF7043' }}
        />
      ),
      title: 'Notifications',
      description: 'Get alerts for new trainings',
      granted: notificationsGranted,
      onRequest: requestNotificationPermission,
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          We Need Your Permission
        </Typography>
        <Typography variant="body1" color="text.secondary">
          These permissions help us provide the best experience
        </Typography>
      </Box>

      {permissions.map((permission, index) => (
        <Card
          key={index}
          sx={{
            mb: 2,
            backgroundColor: permission.granted ? '#26A69A20' : 'white',
          }}
        >
          <ListItem>
            <ListItemIcon>{permission.icon}</ListItemIcon>
            <ListItemText
              primary={permission.title}
              secondary={permission.description}
              primaryTypographyProps={{ fontWeight: 600 }}
            />
            <ListItemSecondaryAction>
              {permission.granted ? (
                <CheckCircle sx={{ color: '#26A69A', fontSize: 32 }} />
              ) : (
                <Button variant="outlined" onClick={permission.onRequest}>
                  Allow
                </Button>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        </Card>
      ))}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleContinue}
          sx={{
            backgroundColor: '#FF7043',
            '&:hover': { backgroundColor: '#FF5722' },
          }}
        >
          Continue
        </Button>
        <Button variant="text" onClick={handleSkip} sx={{ color: 'text.secondary' }}>
          Skip for Now
        </Button>
      </Box>
    </Container>
  );
};

export default PermissionsScreen;
