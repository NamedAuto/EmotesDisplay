interface EmoteConfig {
    width: number;
    height: number;
    roundness: number;
    backgroundColor: string;
    maxEmoteCount: number;
    randomSizeIncrease: number;
    randomSizeDecrease: number;
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
    scaleCanvas: number;
    scaleImage: number;
    emote: EmoteConfig
}

interface TestingConfig {
    test: boolean
}

export interface Config {
    port: PortConfig;
    youtube: YoutubeConfig;
    aspectRatio: AspectRatioConfig;
    testing: TestingConfig
}
