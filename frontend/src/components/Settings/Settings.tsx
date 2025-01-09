import {
  Box,
  Button,
  Checkbox,
  createTheme,
  FormControlLabel,
  Grid2,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { useConfig } from "../Config/ConfigProvider";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const SettingsPage: React.FC = () => {
  const config = useConfig();

  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState({
    apiKey: config.Youtube.ApiKey,
    videoId: config.Youtube.VideoId,
    messageDelay: (config.Youtube.MessageDelay / 10).toString(),
    port: config.Port.toString(),
    forceWidthHeight: config.AspectRatio.ForceWidthHeight,
    canvasWidth: config.AspectRatio.Width.toString(),
    canvasHeight: config.AspectRatio.Height.toString(),
    scaleCanvas: config.AspectRatio.ScaleCanvas.toString(),
    scaleImage: config.AspectRatio.ScaleImage.toString(),
    // emoteHeight: config.Emote.Height.toString(),
    emoteWidth: config.Emote.Width.toString(),
    randomSizeIncrease: config.Emote.RandomSizeIncrease.toString(),
    randomSizeDecrease: config.Emote.RandomSizeDecrease.toString(),
    maxEmoteCount: config.Emote.MaxEmoteCount.toString(),
    emoteRoundness: config.Emote.Roundness.toString(),
    emoteBackgroundColor: config.Emote.BackgroundColor,
    test: config.Testing.Test,
    speedOfEmotes: (config.Testing.SpeedOfEmotes / 1000).toString(),
  });

  const handleReset = () => {
    setSettings({
      apiKey: config.Youtube.ApiKey,
      videoId: config.Youtube.VideoId,
      messageDelay: config.Youtube.MessageDelay.toString(),
      port: config.Port.toString(),
      forceWidthHeight: config.AspectRatio.ForceWidthHeight,
      canvasWidth: config.AspectRatio.Width.toString(),
      canvasHeight: config.AspectRatio.Height.toString(),
      scaleCanvas: config.AspectRatio.ScaleCanvas.toString(),
      scaleImage: config.AspectRatio.ScaleImage.toString(),
      // emoteHeight: config.Emote.Height.toString(),
      emoteWidth: config.Emote.Width.toString(),
      randomSizeIncrease: config.Emote.RandomSizeIncrease.toString(),
      randomSizeDecrease: config.Emote.RandomSizeDecrease.toString(),
      maxEmoteCount: config.Emote.MaxEmoteCount.toString(),
      emoteRoundness: config.Emote.Roundness.toString(),
      emoteBackgroundColor: config.Emote.BackgroundColor,
      test: config.Testing.Test,
      speedOfEmotes: config.Testing.SpeedOfEmotes.toString(),
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setSettings((prevValues) => ({
      ...prevValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    console.log("Settings saved");
    try {
      const response = await fetch("/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Youtube: {
            ApiKey: settings.apiKey,
            VideoId: settings.videoId,
            MessageDelay: Math.round(parseFloat(settings.messageDelay) * 10),
          },
          Port: parseInt(settings.port, 10),
          AspectRatio: {
            ForceWidthHeight: settings.forceWidthHeight,
            Width: parseInt(settings.canvasWidth, 10),
            Height: parseInt(settings.canvasHeight, 10),
            ScaleCanvas: parseFloat(settings.scaleCanvas),
            ScaleImage: parseFloat(settings.scaleImage),
          },
          Emote: {
            // Height: parseInt(settings.emoteHeight, 10),
            Width: parseInt(settings.emoteWidth, 10),
            RandomSizeIncrease: parseInt(settings.randomSizeIncrease, 10),
            RandomSizeDecrease: parseInt(settings.randomSizeDecrease, 10),
            MaxEmoteCount: parseInt(settings.maxEmoteCount, 10),
            Roundness: parseInt(settings.emoteRoundness, 10),
            BackgroundColor: settings.emoteBackgroundColor,
          },
          Testing: {
            Test: settings.test,
            SpeedOfEmotes: Math.round(
              parseFloat(settings.speedOfEmotes) * 1000
            ),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save config");
      }
      console.log("Config Saved");
    } catch (error) {
      console.error("Error saving config: " + error);
    }
  };

  const handleClickShowPassword = () => {
    setShowApiKey(!showApiKey);
  };

  // const handleSdasdave = () => {
  //   console.log("Settings saved");
  //   // Update config and notify backend
  //   config.update(formValues);

  //   fetch("/api/config", {
  //     method: "POST", // or PUT depending on your API design
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(formValues),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Settings updated successfully:", data);
  //     })
  //     .catch((error) => console.error("Error updating settings:", error));
  // };

  // #62B0A6
  // #960018
  // #e9325e
  // #f885c0

  // #aa1241
  // #c0022d
  // #c7002e
  // #c2002b

  // #d39059
  // #f1f6fc
  //rgb(241, 246, 252)

  //rgb(22, 54, 50)
  //rgb(37, 94, 86)
  // #224a44

  //rgb(98, 176, 159)
  // #6c072c

  // Create a custom theme for the Settings component
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      background: {
        // #142830
        default: "#142830",
      },
      primary: {
        // #f885c0
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

  const url = `http://localhost:${config.Port}/show`;

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          backgroundColor: "background.default",
          color: "text.primary",
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box display="flex">
          <Typography variant="h5" gutterBottom style={{ marginRight: "20px" }}>
            Copy this link →
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            style={{ marginLeft: "20px", marginRight: "20px" }}
          >
            {url}
          </Typography>
          <Typography variant="h5" gutterBottom style={{ marginLeft: "20px" }}>
            <Link href={url} target="_blank" rel="noopener">
              or for a quick view
            </Link>
          </Typography>
        </Box>

        <Typography variant="h4" sx={{ marginTop: 4 }}>
          Youtube
        </Typography>
        <Box>
          <TextField
            type={showApiKey ? "text" : "password"}
            name="apiKey"
            label="Api Key"
            value={settings.apiKey}
            onChange={handleInputChange}
            margin="normal"
            sx={{
              width: "450px",
              marginLeft: 2,
              marginRight: 2,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showApiKey ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            name="videoId"
            label="Video Id"
            value={settings.videoId}
            onChange={handleInputChange}
            margin="normal"
            sx={{ marginLeft: 2, marginRight: 2 }}
          />
          <TextField
            name="messageDelay"
            label="Message Delay (seconds)"
            value={settings.messageDelay}
            onChange={handleInputChange}
            type="number"
            margin="normal"
            sx={{ marginLeft: 2, marginRight: 2 }}
          />
        </Box>

        <Typography variant="h4" sx={{ marginTop: 4 }}>
          Port
        </Typography>
        <Box>
          <TextField
            name="port"
            label="Port"
            value={settings.port}
            onChange={handleInputChange}
            type="number"
            margin="normal"
          />
        </Box>

        <Typography variant="h4" sx={{ marginTop: 4 }}>
          Aspect Ratio
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                name="forceWidthHeight"
                checked={settings.forceWidthHeight}
                onChange={handleInputChange}
                // sx={{
                //   "& .MuiSvgIcon-root": {
                //     border: settings.test ? "2px solid #f885c0" : "none",
                //     borderRadius: "4px",
                //   },
                // }}
              />
            }
            label="Force Width Height"
            sx={{ marginLeft: 2, marginRight: 2 }}
          />
          <TextField
            name="canvasWidth"
            label="Width"
            value={settings.canvasWidth}
            onChange={handleInputChange}
            type="number"
            margin="normal"
            sx={{ marginLeft: 2, marginRight: 2 }}
          />
          <TextField
            name="canvasHeight"
            label="Height"
            value={settings.canvasHeight}
            onChange={handleInputChange}
            type="number"
            margin="normal"
            sx={{ marginLeft: 2, marginRight: 2 }}
          />
          {/* <TextField
            name="scaleCanvas"
            label="Scale Canvas"
            value={settings.scaleCanvas}
            onChange={handleInputChange}
            type="number"
            margin="normal"
            sx={{ marginLeft: 2, marginRight: 2 }}
          />
          <TextField
            name="scaleImage"
            label="Scale Image"
            value={settings.scaleImage}
            onChange={handleInputChange}
            type="number"
            margin="normal"
            sx={{ marginLeft: 2, marginRight: 2 }}
          /> */}
        </Box>

        <Typography variant="h4" sx={{ marginTop: 4 }}>
          Emote
        </Typography>
        <Box>
          <TextField
            name="emoteWidth"
            label="Width and Height"
            value={settings.emoteWidth}
            onChange={handleInputChange}
            type="number"
            margin="normal"
            sx={{ marginLeft: 2, marginRight: 2 }}
          />
          {/* <TextField
            name="emoteHeight"
            label="Emote Height"
            value={settings.emoteHeight}
            onChange={handleInputChange}
            type="number"
            margin="normal"
            sx={{ marginLeft: 2, marginRight: 2 }}
          /> */}
          <TextField
            name="randomSizeIncrease"
            label="Random Increase Size By"
            value={settings.randomSizeIncrease}
            onChange={handleInputChange}
            type="number"
            margin="normal"
            sx={{ marginLeft: 2, marginRight: 2 }}
          />
          <TextField
            name="randomSizeDecrease"
            label="Random Decrease Size By"
            value={settings.randomSizeDecrease}
            onChange={handleInputChange}
            type="number"
            margin="normal"
            sx={{ marginLeft: 2, marginRight: 2 }}
          />
          <TextField
            name="maxEmoteCount"
            label="Max Emote Count"
            value={settings.maxEmoteCount}
            onChange={handleInputChange}
            type="number"
            margin="normal"
            sx={{ marginLeft: 2, marginRight: 2 }}
          />
          <TextField
            name="emoteRoundness"
            label="Roundness (0 - 50)"
            value={settings.emoteRoundness}
            onChange={handleInputChange}
            type="number"
            margin="normal"
            sx={{ marginLeft: 2, marginRight: 2 }}
          />
          <TextField
            name="emoteBackgroundColor"
            label="Background Color"
            value={settings.emoteBackgroundColor}
            onChange={handleInputChange}
            margin="normal"
            sx={{ marginLeft: 2, marginRight: 2 }}
          />
        </Box>

        <Typography variant="h4" sx={{ marginTop: 4 }}>
          Testing
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                name="test"
                checked={settings.test}
                onChange={handleInputChange}
                // sx={{
                //   "& .MuiSvgIcon-root": {
                //     border: settings.test ? "2px solid #f885c0" : "none",
                //     borderRadius: "4px",
                //   },
                // }}
              />
            }
            label="Test"
            sx={{ marginLeft: 2, marginRight: 2 }}
          />
          <TextField
            name="speedOfEmotes"
            label="Speed Of Emotes (seconds)"
            value={settings.speedOfEmotes}
            onChange={handleInputChange}
            type="number"
            margin="normal"
            sx={{ marginLeft: 2, marginRight: 2 }}
          />
        </Box>

        <Box sx={{ marginTop: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            style={{ fontSize: "18px", marginTop: "20px" }}
            sx={{ marginLeft: 2, marginRight: 2, width: "150px" }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleReset}
            style={{ fontSize: "18px", marginTop: "20px" }}
            sx={{ marginLeft: 2, marginRight: 2, width: "150px" }}
          >
            Reset
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SettingsPage;
