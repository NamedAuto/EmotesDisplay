import {
  Box,
  Button,
  createTheme,
  Divider,
  ThemeProvider,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Config } from "../Config/ConfigInterface";
import { useConfig } from "../Config/ConfigProvider";
import AspectRatioSettings from "./AspectRatioSettings";
import EmoteSettings from "./EmoteSettings";
import HeaderSettings from "./HeaderSettings";
import PortSettings from "./PortSettings";
import TestingSettings from "./TestingSettings";
import YouTubeSettings from "./YoutubeSettings";
import { useWebSocketContext } from "../WebSocket/WebSocketProvider";

interface MySettings {
  apiKey: string;
  videoId: string;
  messageDelay: string;
  port: string;
  forceWidthHeight: boolean;
  canvasWidth: string;
  canvasHeight: string;
  scaleCanvas: string;
  scaleImage: string;
  emoteWidth: string;
  randomSizeIncrease: string;
  randomSizeDecrease: string;
  maxEmoteCount: string;
  groupEmotes: boolean;
  emoteRoundness: string;
  emoteBackgroundColor: string;
  test: boolean;
  speedOfEmotes: string;
}

const SettingsPage: React.FC = () => {
  const config = useConfig();
  const { sendMessage } = useWebSocketContext();

  const formatSettings = (config: Config) => ({
    apiKey: config.Youtube.ApiKey,
    videoId: config.Youtube.VideoId,
    messageDelay: (config.Youtube.MessageDelay / 1000).toString(),
    port: config.Port.toString(),
    forceWidthHeight: config.AspectRatio.ForceWidthHeight,
    canvasWidth: config.AspectRatio.Width.toString(),
    canvasHeight: config.AspectRatio.Height.toString(),
    scaleCanvas: config.AspectRatio.ScaleCanvas.toString(),
    scaleImage: config.AspectRatio.ScaleImage.toString(),
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

  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState<MySettings>(formatSettings(config));

  const handleReset = () => {
    setSettings(formatSettings(config));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setSettings((prevValues) => ({
      ...prevValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    console.log("Saving Settings");
    try {
      const tempConfig = createConfigCopyWithUpdate(config, settings);
      // Force to ignore wails.localhost
      const url = `http://localhost:${config.Port}/config`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tempConfig),
      });

      if (!response.ok) {
        throw new Error("Failed to save config");
      }

      Object.assign(config, tempConfig);
      console.log("Config Saved");
    } catch (error) {
      console.error("Error saving config: " + error);
    }
  };

  const createConfigCopyWithUpdate = (config: Config, settings: MySettings) => {
    return {
      ...config,
      Youtube: {
        ...config.Youtube,
        ApiKey: settings.apiKey,
        VideoId: settings.videoId,
        MessageDelay: Math.round(parseFloat(settings.messageDelay) * 1000),
      },
      Port: parseInt(settings.port, 10),
      AspectRatio: {
        ...config.AspectRatio,
        ForceWidthHeight: settings.forceWidthHeight,
        Width: parseInt(settings.canvasWidth, 10),
        Height: parseInt(settings.canvasHeight, 10),
        ScaleCanvas: parseFloat(settings.scaleCanvas),
        ScaleImage: parseFloat(settings.scaleImage),
      },
      Emote: {
        ...config.Emote,
        Width: parseInt(settings.emoteWidth, 10),
        RandomSizeIncrease: parseInt(settings.randomSizeIncrease, 10),
        RandomSizeDecrease: parseInt(settings.randomSizeDecrease, 10),
        MaxEmoteCount: parseInt(settings.maxEmoteCount, 10),
        GroupEmotes: settings.groupEmotes,
        Roundness: parseInt(settings.emoteRoundness, 10),
        BackgroundColor: settings.emoteBackgroundColor,
      },
      Testing: {
        ...config.Testing,
        Test: settings.test,
        SpeedOfEmotes: Math.round(parseFloat(settings.speedOfEmotes) * 1000),
      },
    };
  };

  const handleClickShowPassword = () => {
    setShowApiKey(!showApiKey);
  };

  const handleStartPreview = () => {
    // const eventData = { type: "customEvent", data: { key: "value" } };
    const eventData = { type: "startDefault", data: { key: "" } };
    sendMessage(eventData);
  };

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
        <HeaderSettings port={config.Port.toString()} />

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
          <Tooltip
            title="Saves changes. Has some quirks involving saving. Read README"
            arrow
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
          </Tooltip>

          <Tooltip title="Reset settings back to the last save" arrow>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleReset}
              style={{ fontSize: "18px", marginTop: "20px" }}
              sx={{ marginLeft: 2, marginRight: 2, width: "150px" }}
            >
              Reset
            </Button>
          </Tooltip>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleStartPreview}
            style={{ fontSize: "18px", marginTop: "20px" }}
            sx={{ marginLeft: 2, marginRight: 2, width: "150px" }}
          >
            Start Preview
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SettingsPage;
