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
    port: number;
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
    speedOfEmotes: number
}

export interface Config {
    port: PortConfig;
    youtube: YoutubeConfig;
    aspectRatio: AspectRatioConfig;
    testing: TestingConfig
}
