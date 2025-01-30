package database

import "gorm.io/gorm"

type Youtube struct {
	gorm.Model
	ApiKey       string
	VideoId      string
	MessageDelay int
}

type Port struct {
	gorm.Model
	Port int
}

type Version struct {
	gorm.Model
	Version  string
	Owner    string
	RepoName string
}

type AspectRatio struct {
	gorm.Model
	ForceWidthHeight bool
	Width            int
	Height           int
	ScaleCanvas      float32
	ScaleImage       float32
}

type Emote struct {
	gorm.Model
	Width              int
	Height             int
	RandomSizeIncrease int
	RandomSizeDecrease int
	MaxEmoteCount      int
	GroupEmotes        bool
	Roundness          int
	BackgroundColor    string
}

type Animations struct {
	gorm.Model
}

type Preview struct {
	gorm.Model
	SpeedOfEmotes int
}

type AppConfig struct {
	gorm.Model
	YoutubeID     uint
	Youtube       Youtube
	PortID        uint
	Port          Port
	VersionID     uint
	Version       Version
	AspectRatioID uint
	AspectRatio   AspectRatio
	EmoteID       uint
	Emote         Emote
	AnimationsID  uint
	Animations    Animations
	PreviewID     uint
	Preview       Preview
}
