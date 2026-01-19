import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF7043',
    },
    secondary: {
      main: '#26A69A',
    },
    background: {
      default: '#FAFAFA',
    },
  },
  typography: {
    fontFamily: '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
  },
  shape: {
    borderRadius: 12, // Default curved corners for all components
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Curved corners for all Cards
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Curved corners for all Buttons
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12, // Curved corners for TextFields
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Slightly curved for Chips
        },
      },
    },
  },
});
