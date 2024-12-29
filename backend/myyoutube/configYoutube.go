package myyoutube

import (
	"context"
	"log"
	"sync"

	"google.golang.org/api/option"
	"google.golang.org/api/youtube/v3"
)

// Exported variable to hold the YouTube service
var YoutubeService *youtube.Service
var once sync.Once

// ConfigureYoutube initializes the YouTube service with the provided API key
func ConfigureYoutube(ctx context.Context, apiKey string) {
	once.Do(func() {
		var err error
		YoutubeService, err = youtube.NewService(ctx, option.WithAPIKey(apiKey))
		if err != nil {
			log.Fatalf("Unable to create YouTube service: %v", err)
		}
	})
}
