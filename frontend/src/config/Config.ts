interface EmoteConfig {
    Width: number;
    Height: number;
    Roundness: number;
    BackgroundColor: string;
    MaxEmoteCount: number;
    RandomSizeIncrease: number;
    RandomSizeDecrease: number;
}

interface YoutubeConfig {
    ApiKey: string;
    VideoId: string;
    MessageDelay: number;
}

interface PortConfig {
    App: number;
    Browser:number;
    // port: number;
}

interface AspectRatioConfig {
    Width: number;
    Height: number;
    ScaleCanvas: number;
    ScaleImage: number;
}

interface TestingConfig {
    Test: boolean
    SpeedOfEmotes: number
}

export interface Config {
    Emote: EmoteConfig;
    Youtube: YoutubeConfig;
    AspectRatio: AspectRatioConfig;
    Testing: TestingConfig
    Port: number
}
