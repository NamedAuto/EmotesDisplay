package myyoutube

import (
	"context"
	"myproject/backend/config"

	"google.golang.org/api/youtube/v3"
)

func ConnectToYoutube(ctx context.Context, config *config.AppConfig) {
	ConfigureYoutube(ctx, config.Youtube.ApiKey)
	go GetYoutubeMessages(YoutubeService, config.Youtube.VideoId, config.Youtube.MessageDelay)
}

func GetYoutubeMessages(youtubeService *youtube.Service, videoId string, messageDelay int) {
	// apiCallCounter := 1
	// liveChatId, err := GetLiveChatID(youtubeService, videoId)
	// if err != nil {
	// 	log.Printf("Error getting live chat ID: %v\n", err)
	// 	return
	// }

	// var nextPageToken = ""

	// for {
	// 	// go func() {
	// 	messages,
	// 		newNextPageToken,
	// 		err := GetLiveChatMessages(youtubeService, liveChatId, nextPageToken)

	// 	apiCallCounter++
	// 	log.Printf("API Call counter: %d", apiCallCounter)

	// 	if err != nil {
	// 		log.Println("Error in YouTube messages:", err)
	// 		break
	// 		// return
	// 	}

	// 	if len(messages) > 0 {
	// 		for _, message := range messages {
	// 			// displayName := message.AuthorDetails.DisplayName
	// 			msg := message.Snippet.DisplayMessage
	// 			// log.Printf("%s: %s", displayName, msg)

	// 			baseUrl := fmt.Sprintf("http://localhost:%d/emotes/", MyConfig.Port)
	// 			emoteUrls := parse.ParseMessageForEmotes(msg, baseUrl, emoteMap)

	// 			if len(emoteUrls) > 0 {
	// 				time.Sleep(100 * time.Millisecond)
	// 				log.Printf("These are the emoteUrls: ")
	// 				for _, url := range emoteUrls {
	// 					log.Println(url)
	// 				}
	// 				handler.EmitToAll(emoteUrls)
	// 			}
	// 		}
	// 	}

	// 	time.Sleep(time.Duration(messageDelay) * time.Second)

	// 	nextPageToken = newNextPageToken
	// }
}
