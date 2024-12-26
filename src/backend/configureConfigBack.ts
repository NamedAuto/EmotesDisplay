import {Config} from "../config/Config";
import path from "path";
import fs from "fs";
import yaml from "js-yaml";

let config: Config;

export async function loadConfigBack(yamlFile: string, yamlPath: string): Promise<Config> {
    return new Promise((resolve, reject) => {
        const configPath = path.join(yamlPath, yamlFile)
        fs.readFile(configPath, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }
            try {
                config = yaml.load(data) as Config;
                resolve(config);
            } catch (e) {
                reject(e);
            }
        });
    });
}

export const getConfig = (): Config => {
    if (!config) {
        throw new Error('Config is not loaded. Call loadConfig first');
    }
    return config;
}