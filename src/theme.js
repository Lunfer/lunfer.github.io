import { createTheme, responsiveFontSizes } from "@mui/material";

export const Theme = createTheme({
  palette: {
    primary: {
      main: "#C4C4C4",
    },
    secondary: {
      main: "#6F7ADC",
    },
    text: {
      primary: "#000000",
      secondary: "#FFFFFF",
    },
  },
  status: {
    danger: "#ff0044",
  },
  shape: {
    borderRadius: 40,
  },
  typography: { fontFamily: ["Dosis"] },
});

export const theme = responsiveFontSizes(Theme);
