import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
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
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import DrawerComponent from "./Drawer";

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

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const dividerMargin = 1.5;
  const dividerWidth = 1;
  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${240}px)`,
            ml: `${240}px`,
          }}
        >
          {/* <HeaderSettings port={config.Port.toString()} /> */}
          {/* <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Permanent drawer
            </Typography>
          </Toolbar> */}
        </AppBar>
        {/* <Drawer
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Divider />
          <List>
            {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {["All mail", "Trash", "Spam"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer> */}
        <DrawerComponent
          port={config.Port.toString()}
          open={open}
          handleDrawerOpen={handleDrawerOpen}
          handleDrawerClose={handleDrawerClose}
        />
        {/* <Box
          sx={{
            backgroundColor: "background.default",
            color: "text.primary",
            height: "100vh",
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        > */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            transition: (theme) => theme.transitions.create("margin-left"),
            // marginLeft: open ? `${240}px` : `${64}px`,
          }}
        >
          <HeaderSettings port={config.Port.toString()} />
          <Divider
            sx={{
              // borderColor: dividerColor,
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
              // borderColor: dividerColor,
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
              // borderColor: dividerColor,
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
              // borderColor: dividerColor,
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
              // borderColor: dividerColor,
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
      </Box>
    </ThemeProvider>
  );
};

export default SettingsPage;
