import helmet from "helmet";
import {app, io, server} from "./server";

function configureIo(baseUrl: string) {
    io.on('connection', (socket) => {
        const origin = socket.handshake.headers.origin;
        if (origin !== baseUrl) {
            console.log('Invalid origin:', origin);
            socket.disconnect();
        } else {
            console.log('Client connected:', socket.id);
        }

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
}

function configureHelmet() {
    app.use(
        helmet(),
        helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"],
                imgSrc: ["'self'", "data", "blob:"],
                connectSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
            },
            reportOnly: false,
        })
    );
}

function listen(port: number, baseUrl: string) {
    server.listen(port, () => {
        console.log(`Socket.io server is running on ${baseUrl}`);
    });
}

export function configureMiddleware(baseUrl: string, port: number) {
    configureIo(baseUrl)
    configureHelmet()
    listen(port, baseUrl)
}