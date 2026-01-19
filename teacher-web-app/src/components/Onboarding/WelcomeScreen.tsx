import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Fade } from '@mui/material';
import { MenuBook } from '@mui/icons-material';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = React.useState(false);

  useEffect(() => {
    setFadeIn(true);
    const timer = setTimeout(() => {
      navigate('/onboarding/language');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FF7043 0%, #FFFFFF 100%)',
        padding: 3,
      }}
    >
      <Fade in={fadeIn} timeout={800}>
        <Paper
          elevation={8}
          sx={{
            p: 6,
            borderRadius: 4,
            textAlign: 'center',
            maxWidth: 500,
            backgroundColor: 'white',
          }}
        >
          <Box
            sx={{
              width: 160,
              height: 160,
              borderRadius: '50%',
              backgroundColor: '#FF704320',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              position: 'relative',
            }}
          >
            <MenuBook sx={{ fontSize: 80, color: '#FF7043' }} />
            <Box
              sx={{
                position: 'absolute',
                width: 200,
                height: 200,
                borderRadius: '50%',
                border: '2px solid #26A69A',
                opacity: 0.3,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)', opacity: 0.3 },
                  '50%': { transform: 'scale(1.2)', opacity: 0.1 },
                },
              }}
            />
          </Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 600,
              color: '#212121',
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.5rem' },
            }}
          >
            Guru Vaani
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#757575',
              fontWeight: 400,
            }}
          >
            Empowering Teachers, One Reflection at a Time
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
};

export default WelcomeScreen;
