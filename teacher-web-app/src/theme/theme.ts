import { createTheme } from '@mui/material/styles';
import { designTokens } from 'guru-vaani-shared';

export const theme = createTheme({
  palette: {
    primary: designTokens.colors.primary,
    secondary: designTokens.colors.secondary,
    background: designTokens.colors.background,
    text: designTokens.colors.text,
    error: designTokens.colors.error,
    warning: designTokens.colors.warning,
    success: designTokens.colors.success,
  },
  typography: {
    fontFamily: designTokens.typography.fontFamily,
    h1: { fontSize: designTokens.typography.h1, fontWeight: 700 },
    h2: { fontSize: designTokens.typography.h2, fontWeight: 700 },
    h3: { fontSize: designTokens.typography.h3, fontWeight: 700 },
    body1: { fontSize: designTokens.typography.body1 },
    body2: { fontSize: designTokens.typography.body2 },
  },
  shape: {
    borderRadius: designTokens.shape.borderRadius,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.shape.borderRadius,
          boxShadow: designTokens.shadows.card,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.shape.borderRadius,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: designTokens.shape.borderRadius,
            height: 48,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});
