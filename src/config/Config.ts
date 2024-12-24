interface EmoteConfig {
    width: number;
    height: number;
}

interface YoutubeConfig {
    apiKey: string;
    videoId: string;
    messageDelay: number;
}

interface PortConfig {
    backend: number;
    frontend: number;
}

interface AspectRatioConfig {
    width: number;
    height: number;
    scale: number;
    emote: EmoteConfig
}

interface testingConfig {
    test: boolean
}

export interface Config {
    emote: EmoteConfig;
    port: PortConfig;
    youtube: YoutubeConfig;
    aspectRatio: AspectRatioConfig;
    testing: testingConfig
}
