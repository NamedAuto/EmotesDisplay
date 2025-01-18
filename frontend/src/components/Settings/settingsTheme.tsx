import createTheme from "@mui/material/styles/createTheme";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      // #122f3a
      default: "#122f3a",
    },
    primary: {
      // #f167a7
      main: "#f167a7",
    },
    secondary: {
      // #62B0A6
      main: "#62B0A6",
    },
    text: {
      // #e40031
      primary: "#e40031",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input": {
            // #f4458f
            color: "#f4458f", // Text color inside the input
          },
          "& .MuiInputLabel-root": {
            // #f885c0
            color: "#f885c0", // Label color
          },
          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            // #62B0A6
            borderColor: "#62B0A6", // Outline color
          },
          "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            // #e40031
            borderColor: "#e40031", // Outline color on hover
          },
        },
      },
    },
  },
});

export default darkTheme;
