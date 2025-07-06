// theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark", // Attiva modalità scura

    primary: {
      main: "#2859b3",       // Blue (intenso)
      contrastText: "#fefdf3",
    },
    secondary: {
      main: "#ffb722",       // Gold
      contrastText: "#0a1636",
    },
    background: {
      default: "#0a1636",    // Midnight Blue (sfondo principale)
      paper: "#102b6d",      // Navy Blue (per card, moduli, ecc.)
    },
    text: {
      primary: "#fefdf3",    // Off white
      secondary: "#ffd76a",  // Gold light
    },
    warning: {
      main: "#ffd76a",       // Usabile per accenti o attenzione
    },
  },
  typography: {
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "9999px", // pill shape
          textTransform: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none", // rimuove gradienti di default
        },
      },
    },
  },
});

export default theme;
