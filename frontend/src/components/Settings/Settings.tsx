import {
  Box,
  Button,
  createTheme,
  Divider,
  Link,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useConfig } from "../Config/ConfigProvider";
import AspectRatioSettings from "./AspectRatioSettings";
import EmoteSettings from "./EmoteSettings";
import PortSettings from "./PortSettings";
import TestingSettings from "./TestingSettings";
import YouTubeSettings from "./YoutubeSettings";
import HeaderSettings from "./HeaderSettings";

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
    groupEmotes: config.Emote.GroupEmotes,
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
      groupEmotes: config.Emote.GroupEmotes,
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
            GroupEmotes: settings.groupEmotes,
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

  const dividerMargin = 2;
  const dividerColor = "2px solid #6c072c";

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
          // alignItems: "center",
          // justifyContent: "center",
        }}
      >
        <HeaderSettings port={settings.port} />

        <Divider sx={{ borderBottom: dividerColor, marginY: dividerMargin }} />

        <YouTubeSettings
          apiKey={settings.apiKey}
          videoId={settings.videoId}
          messageDelay={settings.messageDelay}
          handleInputChange={handleInputChange}
          showApiKey={showApiKey}
          handleClickShowPassword={handleClickShowPassword}
        />

        <Divider sx={{ borderBottom: dividerColor, marginY: dividerMargin }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: 3,
          }}
        >
          <PortSettings
            port={settings.port}
            handleInputChange={handleInputChange}
          />

          <TestingSettings
            settings={settings}
            handleInputChange={handleInputChange}
          />
        </Box>

        <Divider sx={{ borderBottom: dividerColor, marginY: dividerMargin }} />

        <AspectRatioSettings
          forceWidthHeight={settings.forceWidthHeight}
          width={settings.canvasWidth}
          height={settings.canvasHeight}
          handleInputChange={handleInputChange}
        />

        <Divider sx={{ borderBottom: dividerColor, marginY: dividerMargin }} />

        <EmoteSettings
          settings={settings}
          handleInputChange={handleInputChange}
        />

        <Divider sx={{ borderBottom: dividerColor, marginY: dividerMargin }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
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
