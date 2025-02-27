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
import {
  createConfigCopyWithUpdate,
  formatApiKeySettings,
  formatAspectRatioSettings,
  formatAuthenticationSettings,
  formatEmoteSettings,
  formatPortSettings,
  formatPreviewSettings,
  formatTwitchSettings,
  formatYoutubeSettings,
} from "./settingUtils";
import { setupHandlers } from "./settingsHandlers";
import {
  HasApiKeyResponse,
  SettingsApiKey,
  SettingsAspectRatio,
  SettingsAuthentication,
  SettingsEmote,
  SettingsPort,
  SettingsPreview,
  SettingsTwitch,
  SettingsYoutube,
} from "./settingsInterface";
import darkTheme from "./settingsTheme";
import AuthenticationSettings from "./AuthenticationSettings";
import TwitchSettings from "./TwitchSettings";

const SettingsPage: React.FC = () => {
  const config = useConfig();

  const { isConnected, updateHandlers, sendMessage } = useWebSocketContext();
  const [isPreviewConnected, setIsPreviewConnected] = useState(false);
  const [isYoutubeConnected, setIsYoutubeConnected] = useState(false);
  useEffect(() => {
    setupHandlers(
      updateHandlers,
      setIsPreviewConnected,
      setIsYoutubeConnected,
      setSettingsAuthentication
    );
  }, [updateHandlers]);

  /**
   * WS initial setup calls
   */
  useEffect(() => {
    if (isConnected) {
      checkForKeys();
    }
  }, [isConnected]);

  /**
   * Http initial setup calls
   */
  useEffect(() => {
    checkForYoutubeApiKey();
  }, []);

  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyExists, setApiKeyExists] = useState<boolean>(false);
  const [color, setColor] = useState("rgba(255,255,255,0)");

  const [settingsYoutube, setSettingsYoutube] = useState<SettingsYoutube>(
    formatYoutubeSettings(config.youtube)
  );

  const [settingsTwitch, setSettingsTwitch] = useState<SettingsTwitch>(
    formatTwitchSettings(config.twitch)
  );

  const [settingsPort, setSettingsPort] = useState<SettingsPort>(
    formatPortSettings(config.port)
  );

  const [settingsAspectRatio, setSettingsAspectRatio] =
    useState<SettingsAspectRatio>(
      formatAspectRatioSettings(config.aspectRatio)
    );

  const [settingsEmote, setSettingsEmote] = useState<SettingsEmote>(
    formatEmoteSettings(config.emote)
  );

  const [settingsPreview, setSettingsPreview] = useState<SettingsPreview>(
    formatPreviewSettings(config.preview)
  );

  const [settingsAuthentication, setSettingsAuthentication] =
    useState<SettingsAuthentication>(formatAuthenticationSettings());

  const [settingsApiKey, setSettingsApiKey] =
    useState<SettingsApiKey>(formatApiKeySettings);

  const checkForKeys = () => {
    const eventData = {
      eventType: "authentication-present",
    };
    sendMessage(eventData);
  };

  /*
  Get apiKeyExists from backend (DONE)
  Pass apiKeyExists to YoutubeSettings to use for Typography display
  Textfield to input apiKey
  Save button -> opens dialog of yes no to save apikey
  Sends to backend and clears the textfield
  Query apiKeyExists again? or use result from save(probably)
  EXTRA
  Have button to get the api key from the backend and display in
    a dialog menu that must be closed before proceeding
    When closed, api key reference values? are removed/set to ""

  */

  const checkForYoutubeApiKey = async () => {
    try {
      const url = `http://localhost:${config.port.port}/check-for-youtube-api-key`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: HasApiKeyResponse = await response.json();
      setApiKeyExists(result.exists);
    } catch (error) {
      console.error("Error checking API key:", error);
    }
  };

  const getYoutubeApiKey = async (callback: (key: string) => void) => {
    const response = await fetch(
      `http://localhost:${config.port.port}/youtube-api-key`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiKey = await response.json();
    callback(apiKey.apiKey);
  };

  const saveYoutubeApiKey = async () => {
    try {
      const jsonData = JSON.stringify(settingsApiKey);

      const url = `http://localhost:${config.port.port}/youtube-api-key`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      });

      if (!response.ok) {
        throw new Error("Failed to save config");
      }

      // Treat empty api key saves as removing the key
      if (settingsApiKey.apiKey == "") {
        setApiKeyExists(false);
      } else {
        setApiKeyExists(true);
      }

      setSettingsApiKey(formatApiKeySettings());
    } catch (error) {
      console.error("Error saving api key: " + error);
    }
  };

  const saveAuthentication = () => {
    settingsAuthentication.youtubeApiKeyssss =
      settingsAuthentication.youtubeApiKeyssss.trim();
    settingsAuthentication.twitch = settingsAuthentication.twitch.trim();

    if (
      settingsAuthentication.youtubeApiKeyssss === "" &&
      settingsAuthentication.twitch === ""
    ) {
      return;
    }

    const eventData = {
      eventType: "authentication",
      data: {
        youtubeApiKey: settingsAuthentication.youtubeApiKeyssss,
        twitch: settingsAuthentication.twitch,
      },
    };
    sendMessage(eventData);
    /*
    Send to the backend
    Wait for backend response on save
    Update flags
    Clear texfield

    TODO: If a youtube service or twitch connection fails, send this error
    to the frontend so the user can update their keys
     */
  };

  const handleReset = () => {
    setSettingsYoutube(formatYoutubeSettings(config.youtube));
    setSettingsTwitch(formatTwitchSettings(config.twitch));
    setSettingsPort(formatPortSettings(config.port));
    setSettingsAspectRatio(formatAspectRatioSettings(config.aspectRatio));
    setSettingsEmote(formatEmoteSettings(config.emote));
    setSettingsPreview(formatPreviewSettings(config.preview));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    // console.log(`Name: ${name}, Value: ${value}`);

    if (name in settingsYoutube) {
      setSettingsYoutube((prevValues) => ({
        ...prevValues,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else if (name in settingsTwitch) {
      setSettingsTwitch((prevValues) => ({
        ...prevValues,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else if (name in settingsPort) {
      setSettingsPort((prevValues) => ({
        ...prevValues,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else if (name in settingsAspectRatio) {
      setSettingsAspectRatio((prevValues) => ({
        ...prevValues,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else if (name in settingsEmote) {
      setSettingsEmote((prevValues) => ({
        ...prevValues,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else if (name in settingsPreview) {
      setSettingsPreview((prevValues) => ({
        ...prevValues,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else if (name in settingsAuthentication) {
      setSettingsAuthentication((prevValues) => ({
        ...prevValues,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else if (name in settingsApiKey) {
      setSettingsApiKey((prevValues) => ({
        ...prevValues,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSave = async () => {
    console.log("Saving Settings");

    try {
      const tempConfig = createConfigCopyWithUpdate(
        config,
        settingsYoutube,
        settingsTwitch,
        settingsPort,
        settingsAspectRatio,
        settingsEmote,
        settingsPreview
      );

      // Force to ignore wails.localhost
      const url = `http://localhost:${config.port.port}/config`;
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
    const eventData = { eventType: "connectYoutube", data: { key: "" } };
    sendMessage(eventData);
  };

  const handleYoutubeStop = () => {
    const eventData = { eventType: "disconnectYoutube", data: { key: "" } };
    sendMessage(eventData);
  };

  const handleTwitchStart = () => {
    const eventData = { eventType: "connectTwitch", data: { key: "" } };
    sendMessage(eventData);
  };

  const handleTwitchStop = () => {
    const eventData = { eventType: "disconnectTwitch", data: { key: "" } };
    sendMessage(eventData);
  };

  const handlePreviewStart = () => {
    const eventData = { eventType: "startPreview", data: { key: "" } };
    sendMessage(eventData);
  };

  const handlePreviewStop = () => {
    const eventData = { eventType: "stopPreview", data: { key: "" } };
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
            settings={settingsYoutube}
            apiKeySettings={settingsApiKey}
            apiKeyExists={apiKeyExists}
            saveYoutubeApiKey={saveYoutubeApiKey}
            getYoutubeApiKey={getYoutubeApiKey}
            handleInputChange={handleInputChange}
          />
        );

      case "Twitch":
        return (
          <TwitchSettings
            settings={settingsTwitch}
            handleInputChange={handleInputChange}
          />
        );

      case "Port":
        return (
          <PortSettings
            settings={settingsPort}
            handleInputChange={handleInputChange}
          />
        );

      case "AspectRatio":
        return (
          <AspectRatioSettings
            settings={settingsAspectRatio}
            handleInputChange={handleInputChange}
          />
        );

      case "Preview":
        return (
          <PreviewSettings
            settings={settingsPreview}
            handleInputChange={handleInputChange}
          />
        );

      // case "Authentication":
      //   return (
      //     <AuthenticationSettings
      //       settings={settingsAuthentication}
      //       handleInputChange={handleInputChange}
      //       saveAuthentication={saveAuthentication}
      //     />
      //   );

      default:
      case "Emote":
        return (
          <EmoteSettings
            settings={settingsEmote}
            color={color}
            setColor={setColor}
            handleInputChange={handleInputChange}
          />
        );
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

            <ListItemButton onClick={() => handleItemClick("Twitch")}>
              <ListItemIcon>
                <MenuIcon />
              </ListItemIcon>
              {isDrawerOpen && <ListItemText primary="Twitch" />}
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

            <ListItemButton onClick={() => handleItemClick("Emote")}>
              <ListItemIcon>
                <MenuIcon />
              </ListItemIcon>
              {isDrawerOpen && <ListItemText primary="Emote" />}
            </ListItemButton>

            {/* <ListItemButton onClick={() => handleItemClick("Authentication")}>
              <ListItemIcon>
                <MenuIcon />
              </ListItemIcon>
              {isDrawerOpen && <ListItemText primary="Authentication" />}
            </ListItemButton> */}
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
          <HeaderSettings port={config.port.port.toString()} />
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
