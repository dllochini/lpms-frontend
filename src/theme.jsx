import { createTheme } from '@mui/material/styles';
import '@fontsource/lato';  

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',   // Your primary color
    },
    secondary: {
      main: '#f50057',   // Your secondary color
    },
    background: {
      default: '#f4f6f8', // Default background
    },
  },
  typography: {
    fontFamily: 'Lato, Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    button: {
      textTransform: 'none', // Prevent uppercase on buttons
    },
    h5: {
        // color: 'black',
        // textDecorationThickness: 10,
    },
  },
  components: {
    // Example: override a component style
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 20px',
        },
      },
    },
  },
});

export default theme;
