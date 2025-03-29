package database

import (
	"time"

	"gorm.io/gorm"
)

type Youtube struct {
	gorm.Model
	VideoId          *string
	MessageDelay     int
	ShowGlobalEmotes *bool
}

type Twitch struct {
	gorm.Model
	ChannelName *string
}

type Port struct {
	gorm.Model
	Port int
}

type AppInfo struct {
	gorm.Model
	Version     string
	Owner       string
	RepoName    string
	LastChecked int64
}

type AspectRatio struct {
	gorm.Model
	ForceWidthHeight *bool
	Width            int
	Height           int
	ScaleCanvas      float32
	ScaleImage       float32
}

type Emote struct {
	gorm.Model
	Width              int
	Height             int
	RandomSizeIncrease *int
	RandomSizeDecrease *int
	MaxEmoteCount      int
	MaxEmotesPerMsg    int
	GroupEmotes        *bool
	Roundness          *int
	BackgroundColor    string
}

type Animations struct {
	gorm.Model
}

type Preview struct {
	gorm.Model
	MaxRandomEmotes  int
	SpeedOfEmotes    int
	UseChannelEmotes *bool
	UseGlobalEmotes  *bool
	UseRandomEmotes  *bool
}

type Authentication struct {
	gorm.Model
	YoutubeApiKey string
	Twitch        string
}

type AppConfig struct {
	gorm.Model
	YoutubeID     uint
	Youtube       Youtube
	TwitchID      uint
	Twitch        Twitch
	PortID        uint
	Port          Port
	AppInfoID     uint
	AppInfo       AppInfo
	AspectRatioID uint
	AspectRatio   AspectRatio
	EmoteID       uint
	Emote         Emote
	AnimationsID  uint
	Animations    Animations
	PreviewID     uint
	Preview       Preview
}

type ApiKey struct {
	gorm.Model
	ApiKey    *string
	ApiUsage  *int
	LastUsed  time.Time
	NextReset time.Time
}
