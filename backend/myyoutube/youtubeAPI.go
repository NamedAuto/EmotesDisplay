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

func GetLiveChatMessagesAsync(
	service *youtube.Service,
	liveChatID string,
	pageToken string) (chan []*youtube.LiveChatMessage, chan string, chan int64, chan error) {

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

func GetLiveChatMessages(
	service *youtube.Service,
	liveChatID string,
	pageToken string) ([]*youtube.LiveChatMessage, string, int64, error) {

	call := service.LiveChatMessages.List(liveChatID, []string{"snippet", "authorDetails"})
	if pageToken != "" {
		call = call.PageToken(pageToken)
	}

	response, err := call.Do()
	if err != nil {
		return nil, "", 0, fmt.Errorf("error retrieving live chat messages: %v", err)
	}

	return response.Items, response.NextPageToken, response.PollingIntervalMillis, nil
}
