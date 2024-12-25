import {Server} from "socket.io";
import cors from "cors";
import helmet from "helmet";
import {app, config, server} from "./server";

const localURL = 'http://localhost:';
const emotesURL = '/emotes/'
export let io: Server

function configureIo() {
    io = new Server(server, {
        cors: {
            origin: localURL + config.port.backend,
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Access-Control-Allow-Origin'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        // console.log('Handshake headers:', socket.handshake.headers);
        const origin = socket.handshake.headers.origin;
        if (origin !== `http://localhost:${config.port.backend}`) {
            console.log('Invalid origin:', origin);
            socket.disconnect();
        } else {
            console.log('Client connected:', socket.id);
        }

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });

        const url = localURL + config.port.backend + emotesURL;
        // socket.emit('new-emote', {url: url + 'islapanik'})
        // socket.emit('new-emote', {url: url + 'TomoeLaugh'})
    });
}

function configureCORS() {
    app.use(cors({
        origin: localURL + config.port.backend,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Access-Control-Allow-Origin', 'Origin', 'Sec-WebSocket-Protocol'],
    }));
}

function configureHelmet() {
    app.use(
        helmet(),
        helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"],
                imgSrc: ["'self'", localURL + config.port.backend, 'blob:'],
                connectSrc: ["'self'", `ws://localhost:${config.port.backend}`, localURL + config.port.backend],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
            },
            reportOnly: false,
        })
    );
}

function configureCrossOriginHeaders() {
    app.use((req, res, next) => {
        // res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        next();
    });
}

export function listen() {
    server.listen(config.port.backend, () => {
        console.log(`Socket.io server is running on ${localURL + config.port.backend}`);
    });
}

export function configureMiddleware(){
    configureIo()
    configureCORS()
    configureHelmet()
    configureCrossOriginHeaders()
    listen()
}