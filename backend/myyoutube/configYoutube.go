package myyoutube

import (
	"context"
	"log"

	"google.golang.org/api/option"
	"google.golang.org/api/youtube/v3"
)

var youtubeService *youtube.Service

func ConfigureYoutube(ctx context.Context, apiKey string) {
	tempService, err := youtube.NewService(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		log.Printf("Unable to create YouTube service: %v", err)
	}

	log.Println("Youtube serivce created")
	youtubeService = tempService
}
