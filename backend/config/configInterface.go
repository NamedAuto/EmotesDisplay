package config

type YoutubeConfig struct {
	ApiKey       string `yaml:"apiKey"`       // Google API key
	VideoId      string `yaml:"videoId"`      // Live stream video id
	MessageDelay int    `yaml:"messageDelay"` // The delay before using the API to get chat messages from the live stream
}

type AspectRatioConfig struct {
	ForceWidthHeight bool    `yaml:"forceWidthHeight"` //Force images that are larger than [width x height] to scale down to fit
	Width            int     `yaml:"width"`
	Height           int     `yaml:"height"`
	ScaleCanvas      float32 `yaml:"scaleCanvas"` // Not used for now
	ScaleImage       float32 `yaml:"scaleImage"`  // Not used for now
}

type EmoteConfig struct {
	Width              int    `yaml:"width"`              // Used for the height as well
	Height             int    `yaml:"height"`             // Unused
	RandomSizeIncrease int    `yaml:"randomSizeIncrease"` // Increase emote size by up to this number
	RandomSizeDecrease int    `yaml:"randomSizeDecrease"` // Decrease emote size by up to this number
	MaxEmoteCount      int    `yaml:"maxEmoteCount"`      // Maximum number of emotes to display on the screen at once
	Roundness          int    `yaml:"roundness"`          // Value to round the emote image
	BackgroundColor    string `yaml:"backgroundColor"`    // Add color to the transparent part of the emotes
}

type TestingConfig struct {
	Test          bool `yaml:"test"`          // true, shows random emotes -> false, attempts to connect to live stream
	SpeedOfEmotes int  `yaml:"speedOfEmotes"` // Speed at which emotes appear during testing
}

// AppConfig struct definition
type AppConfig struct {
	Youtube     YoutubeConfig     `yaml:"youtube"`
	Port        int               `yaml:"port"`
	AspectRatio AspectRatioConfig `yaml:"aspectRatio"`
	Emote       EmoteConfig       `yaml:"emote"`
	Testing     TestingConfig     `yaml:"testing"`
}
