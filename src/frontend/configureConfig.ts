import yaml from "js-yaml";
import {Config} from "../config/Config";

export let config: Config;

export async function loadConfig() {
    try {
        const response = await fetch('http://localhost:3000/config/config.yaml');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const yamlText = await response.text();
        config = yaml.load(yamlText) as Config;
        console.log('Configuration loaded:', config);

        // Now you can use the config object as needed in your application
    } catch (error) {
        console.error('Error fetching config:', error);
    }
}