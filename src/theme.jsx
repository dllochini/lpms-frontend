import { createTheme } from '@mui/material/styles';
import '@fontsource/lato';

const theme = createTheme({
  palette: {
    primary: {
      main: '#388e3c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8bc34a',
      contrastText: '#000000',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#fbc02d',
    },
    error: {
      main: '#d32f2f',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Lato, Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 3px 6px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          color: '#333333',
        },
      },
    },
  },
});

export default theme;
