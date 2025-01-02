package config

import (
	"log"
	"os"
	"path/filepath"

	"gopkg.in/yaml.v2"
)

type YoutubeConfig struct {
	ApiKey       string `yaml:"apiKey"`
	VideoId      string `yaml:"videoId"`
	MessageDelay int    `yaml:"messageDelay"`
}

type PortConfig struct {
	App     int `yaml:"app"`
	Browser int `yaml:"browser"`
}

type AspectRatioConfig struct {
	Width       int     `yaml:"width"`
	Height      int     `yaml:"height"`
	ScaleCanvas float32 `yaml:"scaleCanvas"`
	ScaleImage  float32 `yaml:"scaleImage"`
}

type EmoteConfig struct {
	Width              int    `yaml:"width"`
	Height             int    `yaml:"height"`
	RandomSizeIncrease int    `yaml:"randomSizeIncrease"`
	RandomSizeDecrease int    `yaml:"randomSizeDecrease"`
	MaxEmoteCount      int    `yaml:"maxEmoteCount"`
	Roundness          int    `yaml:"roundness"`
	BackgroundColor    string `yaml:"backgroundColor"`
}

type TestingConfig struct {
	Test          bool `yaml:"test"`
	SpeedOfEmotes int  `yaml:"speedOfEmotes"`
}

// AppConfig struct definition
type AppConfig struct {
	Youtube     YoutubeConfig     `yaml:"youtube"`
	AspectRatio AspectRatioConfig `yaml:"aspectRatio"`
	Emote       EmoteConfig       `yaml:"emote"`
	Testing     TestingConfig     `yaml:"testing"`
	Port        int               `yaml:"port"`
}

func LoadConfig(configPath string) (*AppConfig, error) {
	file, err := os.Open(filepath.Join(configPath, "config.yaml"))
	if err != nil {
		log.Fatalf("Error opening file: %v", err)
		return nil, err
	}
	defer file.Close()

	var config AppConfig
	decoder := yaml.NewDecoder(file)
	err = decoder.Decode(&config)
	decoder.Decode(&config)

	if err != nil {
		log.Fatalf("Error decoding YAML: %v", err)
		return nil, err
	}

	return &config, err
}
