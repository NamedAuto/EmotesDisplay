interface EmoteConfig {
    width: number;
    height: number;
}

interface FrontendConfig {
    port: number;
}

interface BackendConfig {
    port: number;
}

interface YoutubeConfig {
    apiKey: string;
    videoId: string;
    messageDelay: number;
}

export interface Config {
    emote: EmoteConfig;
    frontend: FrontendConfig;
    backend: BackendConfig;
    youtube: YoutubeConfig;
}
