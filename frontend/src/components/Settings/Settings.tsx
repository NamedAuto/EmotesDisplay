import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  CSSObject,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Theme,
  ThemeProvider,
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

  const drawerWidth = 150;
  const drawerWidthMini = 60;
  const [selectedComponent, setSelectedComponent] = useState<string>("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
          <Box flexDirection="column-reverse">
            <PortSettings
              port={settings.port}
              handleInputChange={handleInputChange}
            />
            <AspectRatioSettings
              forceWidthHeight={settings.forceWidthHeight}
              width={settings.canvasHeight}
              height={settings.canvasHeight}
              handleInputChange={handleInputChange}
            />
          </Box>
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
  const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen * 1,
    }),
    overflowX: "hidden",
  });

  const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    // width: `calc(${theme.spacing(7)} + 1px)`,
    width: drawerWidthMini,
    // [theme.breakpoints.up("sm")]: {
    //   width: `calc(${theme.spacing(8)} + 1px)`,
    // },
  });

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

  const dividerMargin = 1;
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
        <Drawer
          sx={(theme) => ({
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: isDrawerOpen ? drawerWidth : drawerWidthMini,
              boxSizing: "border-box",
              ...(isDrawerOpen ? openedMixin(theme) : closedMixin(theme)),
            },
          })}
          variant="permanent"
          anchor="left"
        >
          <DrawerHeader>
            <IconButton onClick={() => setIsDrawerOpen((prev) => !prev)}>
              {isDrawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
          </DrawerHeader>

          <List>
            <ListItemButton onClick={() => handleItemClick("YouTube")}>
              <ListItemIcon>
                <MenuIcon />
              </ListItemIcon>
              {isDrawerOpen && <ListItemText primary="YouTube" />}
            </ListItemButton>
            <ListItemButton onClick={() => handleItemClick("AspectRatio")}>
              <ListItemIcon>
                <MenuIcon />
              </ListItemIcon>
              {isDrawerOpen && <ListItemText primary="Aspect Ratio" />}
            </ListItemButton>
            <ListItemButton onClick={() => handleItemClick("Port")}>
              <ListItemIcon>
                <MenuIcon />
              </ListItemIcon>
              {isDrawerOpen && <ListItemText primary="Port" />}
            </ListItemButton>
            <ListItemButton onClick={() => handleItemClick("Preview")}>
              <ListItemIcon>
                <MenuIcon />
              </ListItemIcon>
              {isDrawerOpen && <ListItemText primary="Preview" />}
            </ListItemButton>
            <ListItem onClick={() => handleItemClick("Emote")}>
              <ListItemIcon>
                <MenuIcon />
              </ListItemIcon>
              {isDrawerOpen && <ListItemText primary="Emote" />}
            </ListItem>
          </List>
        </Drawer>
        <Box
          sx={{
            flexGrow: 0,
            padding: 1,
            marginLeft: isDrawerOpen
              ? `${drawerWidth}px`
              : `${drawerWidthMini}px`,
          }}
        >
          <HeaderSettings port={config.Port.toString()} />
          <Divider
            sx={{
              borderWidth: dividerWidth,
              marginY: dividerMargin,
            }}
          />
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            // padding: 1,
            marginLeft: isDrawerOpen
              ? `${drawerWidth}px`
              : `${drawerWidthMini}px`,
          }}
        >
          {/* <HeaderSettings port={config.Port.toString()} /> */}

          {renderSelectedComponent()}
        </Box>
        <Box
          sx={{
            flexGrow: 0,
            // padding: 1,
            marginLeft: isDrawerOpen
              ? `${drawerWidth}px`
              : `${drawerWidthMini}px`,
          }}
        >
          <Divider
            sx={{
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
