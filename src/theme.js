import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2859b3",       
      contrastText: "#fefdf3",
    },
    secondary: {
      main: "#ffb722",      
      contrastText: "#0a1636",
    },
    background: {
      default: "#0a1636",    
      paper: "#102b6d",      
    },
    text: {
      primary: "#fefdf3",    
      secondary: "#ffd76a",  
    },
    warning: {
      main: "#ffd76a",       
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
          borderRadius: "9999px", 
          textTransform: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none", 
        },
      },
    },
  },
});

export default theme;
