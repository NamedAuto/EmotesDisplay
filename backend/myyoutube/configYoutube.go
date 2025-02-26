package myyoutube

import (
	"context"
	"log"

	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"google.golang.org/api/option"
	"google.golang.org/api/youtube/v3"
	"gorm.io/gorm"
)

var youtubeService *youtube.Service

func ConfigureYoutube(ctx context.Context, db *gorm.DB) {
	if youtubeService != nil {
		return
	}

	var authentication database.Authentication
	db.First(&authentication)

	tempService, err := youtube.NewService(ctx, option.WithAPIKey(authentication.YoutubeApiKey))
	if err != nil {
		log.Printf("Unable to create YouTube service: %v", err)
	}

	log.Println("Youtube serivce created")
	youtubeService = tempService
}
