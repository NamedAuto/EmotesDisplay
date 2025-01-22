import { Box, Divider, ThemeProvider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useConfig } from "../Config/ConfigProvider";
import { useWebSocketContext } from "../WebSocket/WebSocketProvider";
import AspectRatioSettings from "./AspectRatioSettings";
import ButtonSettings from "./ButtonSetings";
import EmoteSettings from "./EmoteSettings";
import HeaderSettings from "./HeaderSettings";
import PortSettings from "./PortSettings";
import PreviewSettings from "./PreviewSettings";
import YouTubeSettings from "./YoutubeSettings";
import { createConfigCopyWithUpdate, formatSettings } from "./settingUtils";
import { setupHandlers } from "./settingsHandlers";
import { MySettings } from "./settingsInterface";
import darkTheme from "./settingsTheme";

const SettingsPage: React.FC = () => {
  const config = useConfig();

  const { updateHandlers, sendMessage } = useWebSocketContext();
  const [isPreviewConnected, setIsPreviewConnected] = useState(false);
  const [isYoutubeConnected, setIsYoutubeConnected] = useState(false);
  useEffect(() => {
    setupHandlers(updateHandlers, setIsPreviewConnected, setIsYoutubeConnected);
  }, [updateHandlers]);

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

  const handleClickShowPassword = () => {
    setShowApiKey(!showApiKey);
  };

  const handleYoutubeStart = () => {
    const eventData = { type: "connectYoutube", data: { key: "" } };
    sendMessage(eventData);
  };

  const handleYoutubeStop = () => {
    const eventData = { type: "disconnectYoutube", data: { key: "" } };
    sendMessage(eventData);
  };

  const handlePreviewStart = () => {
    const eventData = { type: "startPreview", data: { key: "" } };
    sendMessage(eventData);
  };

  const handlePreviewStop = () => {
    const eventData = { type: "stopPreview", data: { key: "" } };
    sendMessage(eventData);
  };

  const dividerMargin = 1.5;
  const dividerWidth = 1;
  const dividerColor = "#6c072c";
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
          overflow: "auto",
        }}
      >
        <HeaderSettings port={config.Port.toString()} />
        <Divider
          sx={{
            borderColor: dividerColor,
            borderWidth: dividerWidth,
            marginY: dividerMargin,
          }}
        />

        <YouTubeSettings
          apiKey={settings.apiKey}
          videoId={settings.videoId}
          messageDelay={settings.messageDelay}
          handleInputChange={handleInputChange}
          showApiKey={showApiKey}
          handleClickShowPassword={handleClickShowPassword}
        />
        <Divider
          sx={{
            borderColor: dividerColor,
            borderWidth: dividerWidth,
            marginY: dividerMargin,
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}
        >
          <PortSettings
            port={settings.port}
            handleInputChange={handleInputChange}
          />

          <PreviewSettings
            settings={settings}
            handleInputChange={handleInputChange}
          />
        </Box>
        <Divider
          sx={{
            borderColor: dividerColor,
            borderWidth: dividerWidth,
            marginY: dividerMargin,
          }}
        />

        <AspectRatioSettings
          forceWidthHeight={settings.forceWidthHeight}
          width={settings.canvasWidth}
          height={settings.canvasHeight}
          handleInputChange={handleInputChange}
        />
        <Divider
          sx={{
            borderColor: dividerColor,
            borderWidth: dividerWidth,
            marginY: dividerMargin,
          }}
        />

        <EmoteSettings
          settings={settings}
          handleInputChange={handleInputChange}
        />
        <Divider
          sx={{
            borderColor: dividerColor,
            borderWidth: dividerWidth,
            marginY: dividerMargin,
          }}
        />

        <ButtonSettings
          isPreviewConnected={isPreviewConnected}
          isYoutubeConnected={isYoutubeConnected}
          handlePreviewStart={handlePreviewStart}
          handlePreviewStop={handlePreviewStop}
          handleYoutubeStart={handleYoutubeStart}
          handleYoutubeStop={handleYoutubeStop}
          handleReset={handleReset}
          handleSave={handleSave}
        />
      </Box>
    </ThemeProvider>
  );
};

export default SettingsPage;
