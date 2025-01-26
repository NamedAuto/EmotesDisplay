import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useConfig } from "../Config/ConfigProvider";
import { useWebSocketContext } from "../WebSocket/WebSocketProvider";
import AspectRatioSettings from "./AspectRatioSettings";
import ButtonSettings from "./ButtonSetings";
import EmoteSettings from "./EmoteSettings";
import PortSettings from "./PortSettings";
import PreviewSettings from "./PreviewSettings";
import YouTubeSettings from "./YoutubeSettings";
import { createConfigCopyWithUpdate, formatSettings } from "./settingUtils";
import { setupHandlers } from "./settingsHandlers";
import { MySettings } from "./settingsInterface";
import MenuIcon from "@mui/icons-material/Menu";
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

  const [open, setOpen] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState<string>("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for toggling drawer mode
  const YoutubeComponent = () => (
    <YouTubeSettings
      apiKey={settings.apiKey}
      videoId={settings.videoId}
      messageDelay={settings.messageDelay}
      handleInputChange={handleInputChange}
      showApiKey={showApiKey}
      handleClickShowPassword={handleClickShowPassword}
    />
  );
  const AspectRatioComponent = () => (
    <AspectRatioSettings
      forceWidthHeight={settings.forceWidthHeight}
      width={settings.canvasWidth}
      height={settings.canvasHeight}
      handleInputChange={handleInputChange}
    />
  );
  const EmoteComponent = () => (
    <EmoteSettings settings={settings} handleInputChange={handleInputChange} />
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleItemClick = (component: string) => {
    setSelectedComponent(component);
  };

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case "YouTube":
        return (
          <YouTubeSettings
            apiKey={settings.apiKey}
            videoId={settings.videoId}
            messageDelay={settings.messageDelay}
            handleInputChange={handleInputChange}
            showApiKey={showApiKey}
            handleClickShowPassword={handleClickShowPassword}
          />
        );
      case "AspectRatio":
        return (
          <AspectRatioSettings
            forceWidthHeight={settings.forceWidthHeight}
            width={settings.canvasWidth}
            height={settings.canvasHeight}
            handleInputChange={handleInputChange}
          />
        );
      case "Button":
        return (
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
        );
      case "Port":
        return (
          <PortSettings
            port={settings.port}
            handleInputChange={handleInputChange}
          />
        );
      case "Preview":
        return (
          <PreviewSettings
            settings={settings}
            handleInputChange={handleInputChange}
          />
        );
      case "Emote":
        return (
          <EmoteSettings
            settings={settings}
            handleInputChange={handleInputChange}
          />
        );
      default:
        return <div>Select a settings option from the drawer.</div>;
    }
  };

  const dividerMargin = 1.5;
  const dividerWidth = 1;
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
        {/* Drawer Navigation */}
        <Drawer
          sx={{
            width: isDrawerOpen ? 240 : 60, // Toggle width based on state
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: isDrawerOpen ? 240 : 60, // Same here
              boxSizing: "border-box",
              overflow: "hidden",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <List>
            <ListItemButton onClick={() => handleItemClick("YouTube")}>
              <ListItemIcon>
                {/* Add an icon for the "mini" drawer */}
                <MenuIcon />
              </ListItemIcon>
              {isDrawerOpen && <ListItemText primary="YouTube Settings" />}
            </ListItemButton>
            <ListItemButton onClick={() => handleItemClick("AspectRatio")}>
              <ListItemIcon>
                <MenuIcon />
              </ListItemIcon>
              {isDrawerOpen && <ListItemText primary="Aspect Ratio Settings" />}
            </ListItemButton>
            <ListItemButton onClick={() => handleItemClick("Button")}>
              <ListItemIcon>
                <MenuIcon />
              </ListItemIcon>
              {isDrawerOpen && <ListItemText primary="Button Settings" />}
            </ListItemButton>
            <ListItemButton onClick={() => handleItemClick("Port")}>
              <ListItemIcon>
                <MenuIcon />
              </ListItemIcon>
              {isDrawerOpen && <ListItemText primary="Port Settings" />}
            </ListItemButton>
            <ListItemButton onClick={() => handleItemClick("Preview")}>
              <ListItemIcon>
                <MenuIcon />
              </ListItemIcon>
              {isDrawerOpen && <ListItemText primary="Preview Settings" />}
            </ListItemButton>
            <ListItem onClick={() => handleItemClick("Emote")}>
              <ListItemIcon>
                <MenuIcon />
              </ListItemIcon>
              {isDrawerOpen && <ListItemText primary="Emote Settings" />}
            </ListItem>
          </List>
        </Drawer>

        <IconButton
          onClick={() => setIsDrawerOpen((prev) => !prev)}
          sx={{
            position: "absolute",
            top: 20,
            left: isDrawerOpen ? "240px" : "60px", // Adjust based on the drawer size
            zIndex: 10,
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            padding: 2,
            marginLeft: isDrawerOpen ? "240px" : "60px", // Adjust for mini drawer
          }}
        >
          {renderSelectedComponent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SettingsPage;
