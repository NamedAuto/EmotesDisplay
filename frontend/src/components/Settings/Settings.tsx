import { Box, Button, Divider, ThemeProvider, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useConfig } from "../Config/ConfigProvider";
import { useWebSocketContext } from "../WebSocket/WebSocketProvider";
import AspectRatioSettings from "./AspectRatioSettings";
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

          <PreviewSettings
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
            title="Save changes. Has some quirks involving saving. Read README"
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

          <Tooltip
            title={
              isPreviewConnected
                ? "Stop displaying random emotes on the screen"
                : "Display random emotes on the screen"
            }
            arrow
          >
            <Button
              variant="contained"
              color={isPreviewConnected ? "secondary" : "primary"}
              onClick={
                isPreviewConnected ? handlePreviewStop : handlePreviewStart
              }
              style={{ fontSize: "18px", marginTop: "20px" }}
              sx={{ marginLeft: 2, marginRight: 2, width: "200px" }}
            >
              {isPreviewConnected ? "Stop Preview" : "Start Preview"}
            </Button>
          </Tooltip>

          <Tooltip
            title={
              isPreviewConnected
                ? "Disconnect from youtube"
                : "Connect to youtube and display emotes from chat"
            }
            arrow
          >
            <Button
              variant="contained"
              color={isYoutubeConnected ? "secondary" : "primary"}
              onClick={
                isYoutubeConnected ? handleYoutubeStop : handleYoutubeStart
              }
              style={{ fontSize: "18px", marginTop: "20px" }}
              sx={{ marginLeft: 2, marginRight: 2, width: "200px" }}
            >
              {isYoutubeConnected ? "Stop Youtube" : "Start Youtube"}
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SettingsPage;
