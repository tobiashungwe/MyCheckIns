import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#8DC6FF',        // pastel coral
      light: '#d6f4ff',
      dark: '#5490c6',
      contrastText: '#fff',
    },
    secondary: {
      main: '#8DC6FF',        // pastel sky-blue for secondary accents
    },
    background: {
      default: '#FFFDFD',     // very soft warm white
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
});

export default theme;