import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { GetPort } from "../../../wailsjs/go/main/App";
import { Config } from "./ConfigInterface";

const defaultConfig: Config = {
  youtube: { videoId: "", messageDelay: 10, showGlobalEmotes: false },
  twitch: { channelName: "" },
  port: { port: 3124 },
  aspectRatio: {
    forceWidthHeight: true,
    width: 1920,
    height: 1080,
    scaleCanvas: 1,
    scaleImage: 1,
  },
  emote: {
    width: 64,
    height: 64,
    randomSizeIncrease: 0,
    randomSizeDecrease: 0,
    maxEmoteCount: 100,
    maxEmotesPerMsg: 4,
    groupEmotes: true,
    roundness: 0,
    backgroundColor: "",
  },
  preview: {
    maxRandomEmotes: 5,
    speedOfEmotes: 1,
    useChannelEmotes: true,
    useGlobalEmotes: false,
    useRandomEmotes: true,
  },
};

export const ConfigContext = createContext<{
  config: Config;
  reloadConfig: () => void;
} | null>(null);

export let WAILS_PORT = 1234;

let isWailsApp = typeof window.runtime !== "undefined";
export async function loadConfigFront(): Promise<Config> {
  let config: Config = defaultConfig;

  /*
  Wails window needs to explicitly have the entire url.
  Using just the endpoint, the wails window will add wails.localhost to the url
  which the backend server can not listen to
  */
  let fetchUrl = "/config";
  if (isWailsApp) {
    WAILS_PORT = await GetPort();
    fetchUrl = `http://localhost:${WAILS_PORT}/config`;
  }

  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    config = await response.json();
  } catch (error) {
    console.error("Error fetching config with port:", error);
  }

  // console.log(JSON.stringify(config, null, 2));
  return config;
}

export function useConfig() {
  const config = useContext(ConfigContext);
  console.log("HI");
  if (!config) {
    throw new Error(
      "Config not available! Ensure ConfigProvider is used correctly."
    );
  }
  return config;
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [loading, setLoading] = useState<boolean>(true);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      const configData = await loadConfigFront();
      setConfig(configData);
      setLoading(false);
    };

    console.log("FETCH");

    fetchConfig();
  }, [reload]);

  const reloadConfig = () => {
    setReload((prev) => !prev);
  };

  if (loading) {
    // return <div>Loading configuration...</div>;
    return null;
  }

  return (
    <ConfigContext.Provider value={{ config, reloadConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}
