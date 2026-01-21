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
import { Mic, Notifications, CheckCircle, Shield } from '@mui/icons-material';
import { designTokens } from 'guru-vaani-shared';

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
      icon: <Mic sx={{ fontSize: 40, color: microphoneGranted ? designTokens.colors.secondary.main : designTokens.colors.primary.main }} />,
      title: 'Voice Diary',
      description: 'Your voice is your fastest tool. Allow us to listen and transcribe your classroom stories.',
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
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Box sx={{
          display: 'inline-flex',
          p: 2,
          bgcolor: 'primary.light',
          borderRadius: '16px',
          mb: 2,
          color: 'primary.main'
        }}>
          <Shield sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h2" fontWeight="800" sx={{ mb: 1 }}>
          Safety & Privacy
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          Your data is encrypted and used only to support your teaching journey. 🙏
        </Typography>
      </Box>

      {permissions.map((permission, index) => (
        <Card
          key={index}
          elevation={0}
          sx={{
            mb: 2.5,
            borderRadius: '20px',
            border: '2px solid',
            borderColor: permission.granted ? 'secondary.main' : 'rgba(0,0,0,0.05)',
            bgcolor: permission.granted ? `${designTokens.colors.secondary.main}08` : 'white',
          }}
        >
          <ListItem sx={{ py: 3 }}>
            <ListItemIcon sx={{ mr: 1 }}>{permission.icon}</ListItemIcon>
            <ListItemText
              primary={permission.title}
              secondary={permission.description}
              primaryTypographyProps={{ fontWeight: 800, fontSize: '1.2rem' }}
              secondaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }}
            />
            <ListItemSecondaryAction>
              {permission.granted ? (
                <CheckCircle sx={{ color: 'secondary.main', fontSize: 32 }} />
              ) : (
                <Button
                  variant="contained"
                  disableElevation
                  onClick={permission.onRequest}
                  sx={{ borderRadius: '12px', fontWeight: 700 }}
                >
                  Enable
                </Button>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        </Card>
      ))}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 6 }}>
        <Button
          variant="contained"
          size="large"
          disableElevation
          onClick={handleContinue}
          sx={{
            py: 2,
            borderRadius: '16px',
            fontWeight: 800,
            fontSize: '1.1rem',
            textTransform: 'none'
          }}
        >
          Continue
        </Button>
        <Button
          variant="text"
          onClick={handleSkip}
          sx={{
            color: 'text.secondary',
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          I'll choose later
        </Button>
      </Box>
    </Container>
  );
};

export default PermissionsScreen;
