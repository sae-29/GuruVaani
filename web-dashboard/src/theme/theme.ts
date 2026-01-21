import { createTheme } from '@mui/material/styles';
import { designTokens } from 'guru-vaani-shared';

export const theme = createTheme({
  palette: {
    primary: designTokens.colors.primary,
    secondary: designTokens.colors.secondary,
    info: designTokens.colors.info,
    success: designTokens.colors.success,
    warning: designTokens.colors.warning,
    error: designTokens.colors.error,
    background: designTokens.colors.background,
    text: designTokens.colors.text,
    divider: designTokens.colors.divider,
  },
  typography: {
    fontFamily: designTokens.typography.fontFamily,
    h1: {
      fontSize: designTokens.typography.h1,
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: designTokens.typography.h2,
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: designTokens.typography.h3,
      fontWeight: 700,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: designTokens.typography.body1,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: designTokens.typography.body2,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: designTokens.typography.caption,
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: designTokens.shape.borderRadius,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 24px',
        },
        sizeLarge: {
          padding: '12px 32px',
          fontSize: '16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.shape.borderRadius,
          boxShadow: designTokens.shadows.card,
          '&:hover': {
            boxShadow: designTokens.shadows.elevated,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            height: 48,
          },
        },
      },
    },
  },
});
