import yaml from "js-yaml";
import { Config } from "./Config";
import { GetPort } from "../../wailsjs/go/main/App";

let config: Config;

let isWailsApp = typeof window.runtime !== "undefined";

export async function loadConfigFront() {
  if (isWailsApp) {

    /*
     The Wails window runs on wails.localhost, so it is unable to use "/config" as it 
     will go to wails.localhost/config
     The backend is listening localhost:<port>/config
     Must wait for the backend to tell the frontend through a binding what port it is on
     since the port can be changed
    */
    let WAILS_PORT = 3124
    WAILS_PORT = await GetPort();

    console.log("I AM RUNNING IN WAILS");
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
    console.log("I AM RUNNING IN A BROWSER");
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
