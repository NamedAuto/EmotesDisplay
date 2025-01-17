package myyoutube

import (
	"context"
	"log"
	"sync"

	"google.golang.org/api/option"
	"google.golang.org/api/youtube/v3"
)

var youtubeService *youtube.Service
var once sync.Once

func ConfigureYoutube(ctx context.Context, apiKey string) {
	once.Do(func() {
		var err error
		youtubeService, err = youtube.NewService(ctx, option.WithAPIKey(apiKey))
		if err != nil {
			log.Fatalf("Unable to create YouTube service: %v", err)
		}
	})
}
