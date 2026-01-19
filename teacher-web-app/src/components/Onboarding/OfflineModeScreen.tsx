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
  PhoneAndroid,
  CloudSync,
  EditNote,
  Download,
} from '@mui/icons-material';

const OfflineModeScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/onboarding/permissions');
  };

  const features = [
    {
      icon: <EditNote sx={{ fontSize: 32, color: '#FF7043' }} />,
      title: 'Save entries offline',
      description: 'Write reflections even without internet',
    },
    {
      icon: <CloudSync sx={{ fontSize: 32, color: '#26A69A' }} />,
      title: 'Syncs when connected',
      description: 'Your data automatically syncs when online',
    },
    {
      icon: <Download sx={{ fontSize: 32, color: '#5C6BC0' }} />,
      title: 'Download trainings for later',
      description: 'Access learning modules anytime, anywhere',
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box
          sx={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            backgroundColor: '#FF704320',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 32px',
            position: 'relative',
          }}
        >
          <PhoneAndroid sx={{ fontSize: 80, color: '#FF7043' }} />
          <CloudSync
            sx={{
              fontSize: 40,
              color: '#26A69A',
              position: 'absolute',
              top: 20,
              right: 20,
            }}
          />
        </Box>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Use Guru Vaani Anywhere
        </Typography>
      </Box>

      <List sx={{ mb: 4 }}>
        {features.map((feature, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <ListItem>
              <ListItemIcon>{feature.icon}</ListItemIcon>
              <ListItemText
                primary={feature.title}
                secondary={feature.description}
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItem>
          </Card>
        ))}
      </List>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleContinue}
          sx={{
            minWidth: 200,
            py: 1.5,
            backgroundColor: '#FF7043',
            '&:hover': { backgroundColor: '#FF5722' },
          }}
        >
          I Understand
        </Button>
      </Box>
    </Container>
  );
};

export default OfflineModeScreen;
