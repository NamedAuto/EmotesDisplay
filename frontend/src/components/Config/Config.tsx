import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { GetPort } from "../../../wailsjs/go/main/App";
import { Config } from "./ConfigInterface";

const ConfigContext = createContext<Config | null>(null);

let isWailsApp = typeof window.runtime !== "undefined";
export async function loadConfigFront(): Promise<Config | null> {
  let config: Config | null = null;

  if (isWailsApp) {
    let WAILS_PORT = 3124;
    WAILS_PORT = await GetPort();

    try {
      const response = await fetch(`http://localhost:${WAILS_PORT}/config`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      config = await response.json();
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  } else {
    try {
      const response = await fetch(`/config`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      config = await response.json();
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  }

  return config;
}

export function useConfig(): Config {
  const config = useContext(ConfigContext);
  if (!config) {
    throw new Error(
      "Config not available! Ensure ConfigProvider is used correctly."
    );
  }
  return config;
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchConfig = async () => {
      const configData = await loadConfigFront();
      setConfig(configData);
      setLoading(false);
    };

    fetchConfig();
  }, []);

  if (loading) {
    return <div>Loading configuration...</div>;
  }

  return (
    <ConfigContext.Provider value={config!}>{children}</ConfigContext.Provider>
  );
}