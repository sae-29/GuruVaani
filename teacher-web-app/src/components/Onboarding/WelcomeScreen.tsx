import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Fade } from '@mui/material';
import { MenuBook, Favorite } from '@mui/icons-material';
import { designTokens } from 'guru-vaani-shared';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
    const timer = setTimeout(() => {
      navigate('/onboarding/offline');
    }, 2500); // Slightly longer for "premium" feel
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${designTokens.colors.primary.main} 0%, #FFF5F2 100%)`,
        padding: 3,
      }}
    >
      <Fade in={fadeIn} timeout={800}>
        <Paper
          elevation={0} // Using custom shadow
          sx={{
            p: 6,
            borderRadius: '24px',
            textAlign: 'center',
            maxWidth: 500,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          <Box
            sx={{
              width: 140,
              height: 140,
              borderRadius: '40px', // Squircle for "intentional imperfection"
              backgroundColor: `${designTokens.colors.primary.main}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              position: 'relative',
              transform: 'rotate(-3deg)', // Visual uniqueness
            }}
          >
            <MenuBook sx={{ fontSize: 70, color: designTokens.colors.primary.main }} />
            <Box
              sx={{
                position: 'absolute',
                bottom: -10,
                right: -10,
                bgcolor: designTokens.colors.secondary.main,
                borderRadius: '50%',
                p: 1,
                display: 'flex',
                boxShadow: 2,
              }}
            >
              <Favorite sx={{ fontSize: 20, color: 'white' }} />
            </Box>
          </Box>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              color: 'text.primary',
              mb: 1,
              letterSpacing: '-0.5px',
            }}
          >
            Guru Vaani
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              lineHeight: 1.4,
              px: 2
            }}
          >
            Empowering India's educators.<br />
            Because your voice matters. 🙏
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
};

export default WelcomeScreen;
