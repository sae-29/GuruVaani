import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  Container,
} from '@mui/material';
import { CheckCircle, Language as LanguageIcon } from '@mui/icons-material';
import { designTokens } from 'guru-vaani-shared';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
];

const LanguageSelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      navigate('/onboarding/offline');
    }
  };

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
          <LanguageIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h2" fontWeight="800" sx={{ mb: 1 }}>
          Choose your language
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          शिक्षा की बात, अपनी भाषा के साथ.
        </Typography>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 6 }}>
        {languages.map((language) => {
          const isSelected = selectedLanguage === language.code;
          return (
            <Grid item xs={6} sm={4} md={3} key={language.code}>
              <Card
                onClick={() => handleLanguageSelect(language.code)}
                elevation={0}
                sx={{
                  height: 140,
                  cursor: 'pointer',
                  borderRadius: '20px',
                  border: '2px solid',
                  borderColor: isSelected ? 'primary.main' : 'rgba(0,0,0,0.05)',
                  backgroundColor: isSelected ? `${designTokens.colors.primary.main}08` : 'white',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.05)',
                    borderColor: 'primary.main',
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {isSelected && (
                  <CheckCircle
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      color: 'primary.main',
                      fontSize: 24
                    }}
                  />
                )}
                <Typography sx={{ fontSize: 32, mb: 1, filter: isSelected ? 'grayscale(0)' : 'grayscale(1)', opacity: isSelected ? 1 : 0.6 }}>
                  {language.flag}
                </Typography>
                <Typography variant="h6" fontWeight="800" sx={{ color: isSelected ? 'primary.main' : 'text.primary' }}>
                  {language.nativeName}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  {language.name}
                </Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          disableElevation
          onClick={handleContinue}
          disabled={!selectedLanguage}
          sx={{
            minWidth: 260,
            py: 2,
            borderRadius: '16px',
            fontSize: '1.1rem',
            fontWeight: 800,
            textTransform: 'none',
            boxShadow: '0 8px 16px rgba(255, 112, 67, 0.2)',
          }}
        >
          Let's Begin 🚀
        </Button>
      </Box>
    </Container>
  );
};

export default LanguageSelectionScreen;
