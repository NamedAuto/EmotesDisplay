import path from "path";

export let emotePath: string;
export let yamlPath: string;
export let backgroundPath: string;
export let frontendPath: string;

export function setupFilePaths() {
// Starts in /dist/backend/server.js
    if (process.env.NODE_ENV == "production") {
        console.log("In production");
            const execPath = process.execPath;
        emotePath = path.join(path.dirname(execPath), 'emotes');
        yamlPath = path.join(path.dirname(execPath), 'config');
        backgroundPath = path.join(path.dirname(execPath), 'background');
        frontendPath = path.resolve(__dirname, '..', 'frontend');

    } else {
        console.log("In development");
        emotePath = path.join(process.cwd(), 'public', 'emotes');
        yamlPath = path.join(process.cwd(), 'src', 'config');
        backgroundPath = path.join(process.cwd(), 'public', 'background');
        frontendPath = path.join(process.cwd(), 'dist', 'frontend');
    }
}