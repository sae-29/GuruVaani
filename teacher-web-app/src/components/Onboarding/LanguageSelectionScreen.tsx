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
import { CheckCircle } from '@mui/icons-material';

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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Choose Your Language
        </Typography>
        <Typography variant="body1" color="text.secondary">
          अपनी भाषा चुनें
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {languages.map((language) => {
          const isSelected = selectedLanguage === language.code;
          return (
            <Grid item xs={6} sm={4} md={3} key={language.code}>
              <Card
                onClick={() => handleLanguageSelect(language.code)}
                sx={{
                  height: 160,
                  cursor: 'pointer',
                  border: isSelected ? 3 : 1,
                  borderColor: isSelected ? '#FF7043' : '#E0E0E0',
                  backgroundColor: isSelected ? '#FF7043' : 'white',
                  color: isSelected ? 'white' : 'inherit',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
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
                      top: 8,
                      right: 8,
                      color: 'white',
                    }}
                  />
                )}
                <Typography sx={{ fontSize: 48, mb: 1 }}>{language.flag}</Typography>
                <Typography variant="h6" fontWeight="bold" textAlign="center">
                  {language.nativeName}
                </Typography>
                <Typography variant="caption" textAlign="center">
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
          onClick={handleContinue}
          disabled={!selectedLanguage}
          sx={{
            minWidth: 200,
            py: 1.5,
            backgroundColor: '#FF7043',
            '&:hover': { backgroundColor: '#FF5722' },
          }}
        >
          Continue
        </Button>
      </Box>
    </Container>
  );
};

export default LanguageSelectionScreen;
