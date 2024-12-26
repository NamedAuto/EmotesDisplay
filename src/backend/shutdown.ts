// Mixed shutdown: graceful first, forced if too long
import {server} from "./server";

export function shutdownGracefully() {
    console.log('Attempting graceful shutdown...');
    server.close(() => {
        console.log('Graceful shutdown completed: ' + formatTime());
        process.exit(0);
    });

    // Force shutdown after timeout (e.g., 5 seconds)
    setTimeout(() => {
        console.error('Graceful shutdown timeout, forcing shutdown... ' + formatTime());
        process.exit(1);
    }, 5000);
}


// Event-driven forced shutdown
export function triggerEventShutdown() {
    // Your specific event logic here
    // For example, shutdown after receiving a certain message
    console.log('Event triggered, shutting down...');
    shutdownGracefully();
}

export function formatTime(): string {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const formattedTime =
        `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;

    // console.log('Current time in am/pm format:', formattedTime);

    return formattedTime;
}