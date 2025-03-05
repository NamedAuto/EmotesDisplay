package database

import (
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var appConfig *AppConfig

func StartDatabase() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to the database")
	}

	db = db.Debug()

	if err := db.AutoMigrate(
		&Youtube{},
		&Twitch{},
		&Port{},
		&AppInfo{},
		&AspectRatio{},
		&Emote{},
		&Animations{},
		&Preview{},
		&AppConfig{},
		&ApiKey{},
		&Authentication{}); err != nil {
		log.Fatal("Failed to migrate the database: ", err)
	}

	initDatabase(db)

	db.Preload("Youtube").
		Preload("Twitch").
		Preload("Port").
		Preload("AppInfo").
		Preload("AspectRatio").
		Preload("Emote").
		Preload("Animations").
		Preload("Preview").
		First(&appConfig)

	return db
}

func initDatabase(db *gorm.DB) {
	var count int64
	db.Model(&AppConfig{}).Count(&count)
	if count == 0 {
		insertDefaultValues(db)
		log.Println("Creating database")
	} else {
		log.Println("Database already initialized, skipping initial data insertion.")
	}
}

func insertDefaultValues(db *gorm.DB) {
	videoId := ""
	youtube := Youtube{
		VideoId:      &videoId,
		MessageDelay: 5000,
	}
	db.Create(&youtube)

	channelName := ""
	twitch := Twitch{ChannelName: &channelName}
	db.Create(&twitch)

	port := Port{Port: 3125}
	db.Create(&port)

	appInfo := AppInfo{
		Version:     "v2.1",
		Owner:       "NamedAuto",
		RepoName:    "EmotesDisplay",
		LastChecked: 0,
	}
	db.Create(&appInfo)

	forceWidthHeight := true
	aspectRatio := AspectRatio{
		ForceWidthHeight: &forceWidthHeight,
		Width:            1920,
		Height:           1080,
		ScaleCanvas:      1,
		ScaleImage:       1,
	}
	db.Create(&aspectRatio)

	groupEmotes := true

	randomSizeIncrease := 10
	randomSizeDecrease := 20
	roundness := 50
	emote := Emote{
		Width:              50,
		Height:             50,
		RandomSizeIncrease: &randomSizeIncrease,
		RandomSizeDecrease: &randomSizeDecrease,
		MaxEmoteCount:      200,
		MaxEmotesPerMsg:    5,
		GroupEmotes:        &groupEmotes,
		Roundness:          &roundness,
		BackgroundColor:    "rgba(255, 255, 255, 0)",
	}
	db.Create(&emote)

	animations := Animations{}
	db.Create(&animations)

	preview := Preview{SpeedOfEmotes: 500}
	db.Create(&preview)

	initialConfig := AppConfig{
		YoutubeID:     youtube.ID,
		Youtube:       youtube,
		TwitchID:      twitch.ID,
		Twitch:        twitch,
		PortID:        port.ID,
		Port:          port,
		AppInfoID:     appInfo.ID,
		AppInfo:       appInfo,
		AspectRatioID: aspectRatio.ID,
		AspectRatio:   aspectRatio,
		EmoteID:       emote.ID,
		Emote:         emote,
		AnimationsID:  animations.ID,
		Animations:    animations,
		PreviewID:     preview.ID,
		Preview:       preview,
	}

	db.Create(&initialConfig)

	authentication := Authentication{
		YoutubeApiKey: "",
		Twitch:        "",
	}
	db.Create(&authentication)

	key := ""
	apiKey := ApiKey{
		ApiKey: &key,
	}
	db.Create(&apiKey)

	log.Println("Created database")
}

func GetAppConfig() *AppConfig {
	return appConfig
}

func SetAppConfig() {
}
