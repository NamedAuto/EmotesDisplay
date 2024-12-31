import yaml from "js-yaml";
import { Config } from "./Config";
// import { Event } from '@wailsapp/runtime';

let config: Config;

let isWailsApp = typeof window.runtime !== "undefined";

export let PORT = 3124;

export async function loadConfigFront() {
  if (isWailsApp) {
    console.log("I AM RUNNING IN WAILS");

    const backendPortPromise = new Promise((resolve) => {
      window.runtime.EventsOn("backend-port", (data: any) => {
        console.log("Received backend URL:", data); // Example: "http://localhost:8080"\
        resolve(data);
      });
    });
    try {
      // Wait for the backend URL event
      const backendPort: any = await backendPortPromise;
      console.log("BACKEND PORT -> " + backendPort)
      PORT = backendPort

      const response = await fetch(`http://localhost:${backendPort}/config`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      config = await response.json();
      console.log(config);
      console.log(config.Port.App);
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
      console.log(config.Port.App);
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

export async function loadImage() {
  try {
    const response = await fetch(`http://localhost:${PORT}/images`);
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
