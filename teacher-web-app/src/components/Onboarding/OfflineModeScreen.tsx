import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  Button,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CloudSync,
  EditNote,
  Download,
  WifiOff,
} from '@mui/icons-material';
import { designTokens } from 'guru-vaani-shared';

const OfflineModeScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/onboarding/permissions');
  };

  const features = [
    {
      icon: <EditNote sx={{ fontSize: 32, color: designTokens.colors.primary.main }} />,
      title: 'Write from your heart',
      description: 'Your diary works even in the heart of the forest, without signal.',
    },
    {
      icon: <CloudSync sx={{ fontSize: 32, color: designTokens.colors.secondary.main }} />,
      title: 'Smart Sync',
      description: 'Once you step into the world of internet, we’ll whisk your stories to us safely.',
    },
    {
      icon: <Download sx={{ fontSize: 32, color: designTokens.colors.info.main }} />,
      title: 'Deep Learning',
      description: 'Download training modules and learn at your own pace, offline.',
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Box
          sx={{
            width: 140,
            height: 140,
            borderRadius: '16px', // Squircle for visual uniqueness
            backgroundColor: `${designTokens.colors.primary.main}12`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 32px',
            position: 'relative',
          }}
        >
          <WifiOff sx={{ fontSize: 60, color: designTokens.colors.primary.main }} />
          <CloudSync
            sx={{
              fontSize: 32,
              color: designTokens.colors.secondary.main,
              position: 'absolute',
              bottom: -10,
              right: -10,
              p: 1,
              bgcolor: 'white',
              borderRadius: '50%',
              boxShadow: 2
            }}
          />
        </Box>
        <Typography variant="h2" fontWeight="800" sx={{ mb: 1 }}>
          No signal? No worry.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          Guru Vaani is your companion, always and everywhere.
        </Typography>
      </Box>

      <List sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Card key={index} elevation={0} sx={{
            mb: 2.5,
            borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.05)',
            bgcolor: 'white'
          }}>
            <ListItem sx={{ py: 2 }}>
              <ListItemIcon sx={{ mr: 1 }}>{feature.icon}</ListItemIcon>
              <ListItemText
                primary={feature.title}
                secondary={feature.description}
                primaryTypographyProps={{ fontWeight: 800, fontSize: '1.1rem' }}
                secondaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>
          </Card>
        ))}
      </List>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          disableElevation
          onClick={handleContinue}
          sx={{
            minWidth: 260,
            py: 2,
            borderRadius: '16px',
            fontWeight: 800,
            fontSize: '1.1rem',
            textTransform: 'none'
          }}
        >
          Sounds good! ✨
        </Button>
      </Box>
    </Container>
  );
};

export default OfflineModeScreen;
