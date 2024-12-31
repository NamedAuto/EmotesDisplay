import yaml from "js-yaml";
import { Config } from "./Config";
import { PORT } from "../main";

let config: Config;

export async function loadConfigFront() {
    try {
        const response = await fetch(`http://localhost:${PORT}/config`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        config = await response.json();
        console.log(config)
        console.log(config.Port.App)

    } catch (error) {
        console.error('Error fetching config:', error);
    }
}

export const getConfig = (): Config => {
    if (!config) {
        throw new Error('Config is not loaded. Call loadConfig first');
    }
    return config;
}


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
        console.error('Error fetching config:', error);
    }
}