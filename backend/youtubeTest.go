package main

import (
	"context"
	"fmt"
	"log"

	"github.com/NamedAuto/EmotesDisplay/backend/myyoutube"

	"google.golang.org/api/option"
	"google.golang.org/api/youtube/v3"
)

func masin() {
	ctx := context.Background()
	apiKey := "AIzaSyAxOjESchGSZKbX4bgXOI9RWLno8YnFERA" // Replace with your actual API key

	youtubeService, err := youtube.NewService(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		log.Fatalf("Unable to create YouTube service: %v", err)
	}

	liveChatID, err := myyoutube.GetLiveChatID(youtubeService, "OzwdRFDaW18") // Replace with your live stream video ID
	if err != nil {
		log.Fatalf("Error getting live chat ID: %v", err)
	}

	// Fetch live chat messages asynchronously
	messagesChan, nextPageTokenChan, pollingIntervalMillisChan, errorChan := myyoutube.GetLiveChatMessagesAsync(youtubeService, liveChatID, "")

	// Handle the results or errors
	select {
	case messages := <-messagesChan:
		fmt.Println("Live Chat Messages:")
		for _, message := range messages {
			fmt.Println(message.Snippet.DisplayMessage)
		}
	case nextPageToken := <-nextPageTokenChan:
		fmt.Println("Next Page Token:", nextPageToken)
	case pollingIntervalMillis := <-pollingIntervalMillisChan:
		fmt.Println("Polling Interval (ms):", pollingIntervalMillis)
	case err := <-errorChan:
		log.Fatalf("Error getting live chat messages: %v", err)
	}
}
