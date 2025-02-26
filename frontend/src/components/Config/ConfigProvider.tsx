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

export let WAILS_PORT = 1234;

let isWailsApp = typeof window.runtime !== "undefined";
export async function loadConfigFront(): Promise<Config | null> {
  let config: Config | null = null;

  if (isWailsApp) {
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
  console.log(JSON.stringify(config, null, 2));
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
    // return <div>Loading configuration...</div>;
    return null;
  }

  return (
    <ConfigContext.Provider value={config!}>{children}</ConfigContext.Provider>
  );
}
