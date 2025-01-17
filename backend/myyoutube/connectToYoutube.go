package myyoutube

import (
	"fmt"
	"log"
	"time"

	"github.com/NamedAuto/EmotesDisplay/backend/common"
	"github.com/NamedAuto/EmotesDisplay/backend/parse"
	"github.com/NamedAuto/EmotesDisplay/backend/service"

	"google.golang.org/api/youtube/v3"
)

func ConnectToYoutube(handler common.HandlerInterface, myYoutubeService *service.YoutubeService) {
	log.Println("Connecting to youtube")
	ConfigureYoutube(*myYoutubeService.Ctx, myYoutubeService.DefaultService.Config.Youtube.ApiKey)
	go GetYoutubeMessages(handler, YoutubeService, myYoutubeService)

	// done := make(chan string)
	// go myyoutube.StartYoutube(ctx, myConfig)
}

func GetYoutubeMessages(handler common.HandlerInterface, youtubeService *youtube.Service, myYoutubeService *service.YoutubeService) {
	apiCallCounter := 1
	liveChatId, err := GetLiveChatID(youtubeService, myYoutubeService.DefaultService.Config.Youtube.VideoId)
	if err != nil {
		log.Printf("Error getting live chat ID: %v\n", err)
		return
	}

	var nextPageToken = ""

	for {
		// go func() {
		messages,
			newNextPageToken,
			err := GetLiveChatMessages(youtubeService, liveChatId, nextPageToken)

		apiCallCounter++
		log.Printf("API Call counter: %d", apiCallCounter)

		if err != nil {
			log.Println("Error in YouTube messages:", err)
			break
			// return
		}

		if len(messages) > 0 {
			for _, message := range messages {
				// displayName := message.AuthorDetails.DisplayName
				msg := message.Snippet.DisplayMessage
				// log.Printf("%s: %s", displayName, msg)

				baseUrl := fmt.Sprintf("http://localhost:%d/emotes/", myYoutubeService.DefaultService.Config.Port)
				emoteUrls := parse.ParseMessageForEmotes(msg, baseUrl, myYoutubeService.DefaultService.EmoteMap)

				if len(emoteUrls) > 0 {
					time.Sleep(100 * time.Millisecond)
					log.Printf("These are the emoteUrls: ")
					for _, url := range emoteUrls {
						log.Println(url)
					}
					handler.EmitToAll(emoteUrls)
				}
			}
		}

		time.Sleep(time.Duration(myYoutubeService.DefaultService.Config.Youtube.MessageDelay) * time.Second)

		nextPageToken = newNextPageToken
	}
}
