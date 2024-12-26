import path from "path";
import fs from "fs";
import express, {Express} from "express";
import yaml from "js-yaml";

const extensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

function configureEmotesEndpoint(app: Express, emotePath: string) {
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

function configureBackgroundImageEndpoint(app: Express, backgroundPath: string) {
    app.get('/background', (req, res) => {
        const folderPath = path.join(backgroundPath);
        fs.readdir(folderPath, (err, files) => {
            if (err) {
                return res.status(500).send('Error reading the folder');
            }

            const imageFiles = files.filter(file =>
                extensions.includes(path.extname(file).toLowerCase())
            );

            if (imageFiles.length === 0) {
                return res.status(404).send('No background found');
            }

            /*
             TODO: Add possibility to randomize from image in folder
                Currently gets the first image
             */
            const imageName = imageFiles[0];
            const imagePath = path.join(folderPath, imageName);

            res.sendFile(imagePath);
        });
    });
}

function configureConfigEndpoint(app: Express, yamlPath: string) {
    app.get('/config', (req, res) => {
        const configPath = path.join(yamlPath + '/config.yaml');
        try {
            if (fs.existsSync(configPath)) {
                const file = fs.readFileSync(configPath, 'utf8');
                const config = yaml.load(file);
                res.json(config);
            } else {
                res.status(404).send('Config file not found');
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(`Error reading config file: ${err.message}`);
                res.status(500).send(`Error reading config file: ${err.message}`);
            } else {
                console.error('Unknown error reading config file');
                res.status(500).send('Unknown error reading config file');
            }
        }
    });
}

function configureDefaultEndpoint(app: Express) {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
    });
}

export function configureEndpoints(app: Express,
                                   frontendPath: string,
                                   emotePath: string,
                                   yamlPath: string,
                                   backgroundPath: string) {
    app.use(express.static(frontendPath));
    configureEmotesEndpoint(app, emotePath);
    configureConfigEndpoint(app, yamlPath);
    configureBackgroundImageEndpoint(app, backgroundPath);
    configureDefaultEndpoint(app);
}