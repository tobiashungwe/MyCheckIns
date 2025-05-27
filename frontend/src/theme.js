import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#F98F88',        // pastel coral
      light: '#FFC8C3',
      dark: '#D47069',
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