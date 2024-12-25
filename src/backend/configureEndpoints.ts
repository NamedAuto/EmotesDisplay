import path from "path";
import fs from "fs";
import {app, config} from "./server";
import {emotePath, backgroundPath, yamlPath} from "./getFilePath";
import express from "express";


// const execPath = process.execPath;
// const emotePath = path.join(process.cwd(), 'public', 'emotes');
// const emotePath = path.join(path.dirname(execPath), 'emotes');
//'../../public/emotes';
// const yamlPath = path.join(process.cwd(), 'public', 'config');
// const yamlPath = path.join(path.dirname(execPath), 'config');

//'../../src/config/config.yaml';

    const extensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

function configureEmotesEndpoint() {
    app.get('/emotes/:filename', (req, res) => {
        const filename = req.params.filename;

        let filePath;
        for (const ext of extensions) {
            filePath = path.join(emotePath, filename + ext);
            if (fs.existsSync(filePath)) {
                res.sendFile(filePath);
                return;
            }
        }

        res.status(404).send('File not found');
    });
}

function con() {
    // Serve the list of available background in the 'cats' folder
    app.get('/background', (req, res) => {
        const folderPath = path.join(backgroundPath);


        fs.readdir(folderPath, (err, files) => {
            if (err) {
                return res.status(500).send('Error reading the folder');
            }

            // Filter only image files (e.g., .jpg, .jpeg, .png)
            const imageFiles = files.filter(file =>
                extensions.includes(path.extname(file).toLowerCase())
            );

            if (imageFiles.length === 0) {
                return res.status(404).send('No background found');
            }

            // Return the list of image files
            // res.json(imageFiles);

            // Choose the first image in the list (you could also randomize this)
            const imageName = imageFiles[0];
            const imagePath = path.join(folderPath, imageName);

            // Serve the image
            res.sendFile(imagePath);
        });
    });
}

function configureConfigEndpoint() {
    app.get('/config/config.yaml', (req, res) => {
        // const configPath = path.join(yamlPath + '/config.yaml');//
        const configPath = path.join(yamlPath + '/config.yaml');
        console.log(configPath)
        fs.readFile(configPath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send("Error reading config file");
            }
            res.type('yaml').send(data);
        })
    });

    app.get('/config/ports', (req, res) => {
        res.json({backendPort: config.port.backend, frontendPort: config.port.backend});
    });
}

// Unfinished
function configureBackgroundImageEndpoint() {
    app.get('/background/:filename', (req, res) => {
        const filename = req.params.filename;

        let filePath;
        for (const ext of extensions) {
            filePath = path.join(backgroundPath, filename + ext);
            if (fs.existsSync(filePath)) {
                res.sendFile(filePath);
                return;
            }
        }

        res.status(404).send('File not found');
    });
}

function configureSimpleEndpoint() {
    // Simple route to check if the server is running
    app.get('/', (req, res) => {
        res.send('Hello from the backend!');
    });
}


function configureFrontend() {
    // Serve the frontend (static files) from the `frontend` folder
    // app.use(express.static(path.join(__dirname, 'frontend')));  // Serve static files
    const s = path.join(__dirname, '..', 'frontend');
    // console.log("1: " + s)
    app.use('/', express.static(path.join(__dirname, '..', 'frontend')));

// Serve the index.html for the root route
    app.get('/', (req, res) => {
        const s = path.join(__dirname, '..', 'frontend', 'index.html');
        // console.log("2: " + s)
        res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
    });

// Example API route
    app.get('/api/hello', (req, res) => {
        res.json({message: 'Hello from the backend!'});
    });
}

export function configureEndpoints() {
    configureFrontend();
    configureEmotesEndpoint();
    configureConfigEndpoint();
    // configureBackgroundImageEndpoint()
    con();
}