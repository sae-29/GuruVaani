import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF7043', // Saffron Orange
      light: '#FFAB91',
      dark: '#E64A19',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#26A69A', // Teal
      light: '#4DB8AA',
      dark: '#1B7D73',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#5C6BC0', // Indigo
      light: '#7986CB',
      dark: '#3F51B5',
    },
    success: {
      main: '#66BB6A',
    },
    warning: {
      main: '#FFA726',
    },
    error: {
      main: '#E53935',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#BDBDBD',
    },
    divider: '#E0E0E0',
  },
  typography: {
    fontFamily: '"Noto Sans", "Roboto", sans-serif',
    h1: {
      fontSize: '28px',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '22px',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '18px',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '16px',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '14px',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '12px',
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 8,
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
          borderRadius: 12,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
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
