import yaml from "js-yaml";
import { Config } from "./Config";

let config: Config;

const WAILS_PORT = 3124;

let isWailsApp = typeof window.runtime !== "undefined";

export async function loadConfigFront() {
  if (isWailsApp) {
    console.log("I AM RUNNING IN WAILS");
    try {
      const response = await fetch(`http://localhost:${WAILS_PORT}/config`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      config = await response.json();
      console.log(config);
      console.log(config.Port);
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  } else {
    console.log("I AM RUNNING IN A BROWSER");
    try {
      const response = await fetch(`/config`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      config = await response.json();
      console.log(config);
      console.log(config.Port);
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  }

  // try {
  //     const response = await fetch(`http://localhost:${PORT}/config`);
  //     if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     config = await response.json();
  //     console.log(config)
  //     console.log(config.Port.App)

  // } catch (error) {
  //     console.error('Error fetching config:', error);
  // }
}

export const getConfig = (): Config => {
  if (!config) {
    throw new Error("Config is not loaded. Call loadConfig first");
  }
  return config;
};

export async function loadBackground(): Promise<string | null> {
  try {
    const response = await fetch(
      `http://localhost:${getConfig().Port}/background`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const imageUrl = response.url;
    console.log("Image URL:", imageUrl);
    // console.log('Configuration loaded:', config);

    return imageUrl;
    // Now you can use the config object as needed in your application
  } catch (error) {
    console.error("Error fetching config:", error);
  }
  return null;
}

export async function loadImage() {
  try {
    const response = await fetch(`http://localhost:${getConfig().Port}/images`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const yamlText = await response.text();
    config = yaml.load(yamlText) as Config;
    // console.log('Configuration loaded:', config);

    // Now you can use the config object as needed in your application
  } catch (error) {
    console.error("Error fetching config:", error);
  }
}
