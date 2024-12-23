import path from "path";
import fs from "fs";
import {app, config} from "./server";

const emotePath = '../../public/emotes';
const yamlPath = '../../src/config/config.yaml';

function configureEmotesEndpoint() {
    console.log("ENDPOINT EMOTES")
    app.get('/emotes/:filename', (req, res) => {
        console.log("ENDPOINT EMOTES 2222222222")

        const filename = req.params.filename;
        const extensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp']; // Add any other extensions you want to support
        // TODO: Test different files, although I don't have large files of these
        // const extensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.tif', '.webp', '.svg', '.ico',

        let filePath;
        for (const ext of extensions) {
            filePath = path.join(__dirname, emotePath, filename + ext);
            if (fs.existsSync(filePath)) {
                res.sendFile(filePath);
                return;
            }
        }

        res.status(404).send('File not found');
    });
}

function configureConfigEndpoint() {
    app.get('/config/config.yaml', (req, res) => {
        const configPath = path.join(__dirname, yamlPath);
        fs.readFile(configPath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send("Error reading config file");
            }
            res.type('yaml').send(data);
        })
    });

    app.get('/config/ports', (req, res) => {
        res.json({backendPort: config.backend.port, frontendPort: config.frontend.port});
    });
}

function configureSimpleEndpoint() {
    // Simple route to check if the server is running
    app.get('/', (req, res) => {
        res.send('Hello from the backend!');
    });
}

export function configureEndpoints() {
    console.log("HELLO")
    configureEmotesEndpoint();
    configureConfigEndpoint();
}