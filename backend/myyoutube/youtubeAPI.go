package myyoutube

import (
	"fmt"

	"google.golang.org/api/youtube/v3"
)

func GetLiveChatID(service *youtube.Service, videoID string) (string, error) {
	// Get the live broadcast details
	broadcastCall := service.Videos.List([]string{"liveStreamingDetails"}).Id(videoID)
	broadcastResponse, err := broadcastCall.Do()
	if err != nil {
		return "", fmt.Errorf("error retrieving live broadcast details: %v", err)
	}

	// Check if live chat ID is available
	if len(broadcastResponse.Items) > 0 {
		liveChatID := broadcastResponse.Items[0].LiveStreamingDetails.ActiveLiveChatId
		if liveChatID != "" {
			return liveChatID, nil
		}
	}

	return "", fmt.Errorf("no live broadcast found or no active live chat")
}

// Response structure for live chat messages
type LiveChatMessagesResponse struct {
	Messages              []*youtube.LiveChatMessage
	NextPageToken         string
	PollingIntervalMillis int64
}

func GetLiveChatMessagesAsync(service *youtube.Service, liveChatID string, pageToken string) (chan []*youtube.LiveChatMessage, chan string, chan int64, chan error) {
	messagesChan := make(chan []*youtube.LiveChatMessage)
	nextPageTokenChan := make(chan string)
	pollingIntervalMillisChan := make(chan int64)
	errorChan := make(chan error)

	go func() {
		call := service.LiveChatMessages.List(liveChatID, []string{"snippet", "authorDetails"})
		if pageToken != "" {
			call = call.PageToken(pageToken)
		}

		response, err := call.Do()
		if err != nil {
			errorChan <- fmt.Errorf("error retrieving live chat messages: %v", err)
			return
		}

		messagesChan <- response.Items
		nextPageTokenChan <- response.NextPageToken
		pollingIntervalMillisChan <- response.PollingIntervalMillis
	}()

	return messagesChan, nextPageTokenChan, pollingIntervalMillisChan, errorChan
}

// func main() {
//     ctx := context.Background()
//     apiKey := "YOUR_API_KEY" // Replace with your actual API key

//     youtubeService, err := youtube.NewService(ctx, option.WithAPIKey(apiKey))
//     if err != nil {
//         log.Fatalf("Unable to create YouTube service: %v", err)
//     }

//     // Use the youtubeService to interact with the YouTube API
//     getLiveChatID(youtubeService)
// }
/*
package main

import (
    "context"
    "fmt"
    "log"
    "google.golang.org/api/option"
    "google.golang.org/api/youtube/v3"
)

func main() {
    ctx := context.Background()
    apiKey := "YOUR_API_KEY" // Replace with your actual API key

    youtubeService, err := youtube.NewService(ctx, option.WithAPIKey(apiKey))
    if err != nil {
        log.Fatalf("Unable to create YouTube service: %v", err)
    }

    liveChatID, err := getLiveChatID(youtubeService, "YOUR_VIDEO_ID") // Replace with your live stream video ID
    if err != nil {
        log.Fatalf("Error getting live chat ID: %v", err)
    }

    // Fetch live chat messages asynchronously
    messagesChan, nextPageTokenChan, pollingIntervalMillisChan, errorChan := getLiveChatMessagesAsync(youtubeService, liveChatID, "")

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

// getLiveChatID function (as defined earlier)
func getLiveChatID(service *youtube.Service, videoID string) (string, error) {
    broadcastCall := service.Videos.List([]string{"liveStreamingDetails"}).Id(videoID)
    broadcastResponse, err := broadcastCall.Do()
    if err != nil {
        return "", fmt.Errorf("error retrieving live broadcast details: %v", err)
    }

    if len(broadcastResponse.Items) > 0 {
        liveChatID := broadcastResponse.Items[0].LiveStreamingDetails.ActiveLiveChatId
        if liveChatID != "" {
            return liveChatID, nil
        }
    }

    return "", fmt.Errorf("no live broadcast found or no active live chat")
}

// getLiveChatMessagesAsync function for asynchronous calls
func getLiveChatMessagesAsync(service *youtube.Service, liveChatID string, pageToken string) (chan []*youtube.LiveChatMessage, chan string, chan int64, chan error) {
    messagesChan := make(chan []*youtube.LiveChatMessage)
    nextPageTokenChan := make(chan string)
    pollingIntervalMillisChan := make(chan int64)
    errorChan := make(chan error)

    go func() {
        // Correcting the method call to match the function signature
        call := service.LiveChatMessages.List(liveChatID, []string{"snippet", "authorDetails"})
        if pageToken != "" {
            call = call.PageToken(pageToken)
        }

        response, err := call.Do()
        if err != nil {
            errorChan <- fmt.Errorf("error retrieving live chat messages: %v", err)
            return
        }

        messagesChan <- response.Items
        nextPageTokenChan <- response.NextPageToken
        pollingIntervalMillisChan <- response.PollingIntervalMillis
    }()

    return messagesChan, nextPageTokenChan, pollingIntervalMillisChan, errorChan
}
*/
