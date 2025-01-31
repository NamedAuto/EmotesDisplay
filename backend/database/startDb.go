package database

import (
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var appConfig *AppConfig

func StartDb() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to the database")
	}

	db = db.Debug()

	if err := db.AutoMigrate(
		&Youtube{},
		&Port{},
		&Version{},
		&AspectRatio{},
		&Emote{},
		&Animations{},
		&Preview{},
		&AppConfig{}); err != nil {
		log.Fatal("Failed to migrate the database: ", err)
	}

	initDatabase(db)

	db.Preload("Youtube").
		Preload("Port").
		Preload("Version").
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
	youtube := Youtube{
		ApiKey:       "AIzaSyAxOjESchGSZKbX4bgXOI9RWLno8YnFERA",
		VideoId:      "",
		MessageDelay: 5000,
	}
	db.Create(&youtube)

	port := Port{Port: 3124}
	db.Create(&port)

	version := Version{
		Version:  "v2.1",
		Owner:    "NamedAuto",
		RepoName: "EmotesDisplay",
	}
	db.Create(&version)

	aspectRatio := AspectRatio{
		ForceWidthHeight: true,
		Width:            1920,
		Height:           1080,
		ScaleCanvas:      1,
		ScaleImage:       1,
	}
	db.Create(&aspectRatio)

	emote := Emote{
		Width:              50,
		Height:             50,
		RandomSizeIncrease: 10,
		RandomSizeDecrease: 20,
		MaxEmoteCount:      200,
		GroupEmotes:        true,
		Roundness:          50,
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
		PortID:        port.ID,
		Port:          port,
		VersionID:     version.ID,
		Version:       version,
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
	log.Printf("Inserted AppConfig with ID: %d", initialConfig.ID)
}

func GetAppConfig() *AppConfig {
	return appConfig
}

func SetAppConfig() {
}
