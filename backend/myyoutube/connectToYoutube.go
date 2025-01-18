package myyoutube

import (
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/NamedAuto/EmotesDisplay/backend/common"
	"github.com/NamedAuto/EmotesDisplay/backend/parse"
	"github.com/NamedAuto/EmotesDisplay/backend/service"

	"google.golang.org/api/youtube/v3"
)

// can try encapsuling in a struct to remove tight coupling
var (
	stopChan chan bool
	wg       sync.WaitGroup
	mu       sync.Mutex
)
var apiCallCounter = 0

func ConnectToYoutube(handler common.HandlerInterface, myYoutubeService *service.YoutubeService) {
	log.Println("Connecting to youtube")
	mu.Lock()
	defer mu.Unlock()

	if stopChan != nil {
		log.Println("Youtube goroutine is already running")
		return
	}

	stopChan = make(chan bool)
	wg.Add(1)

	go GetYoutubeMessages(handler, youtubeService, myYoutubeService)
}

func DisconnectFromYoutube() {
	mu.Lock()
	defer mu.Unlock()

	if stopChan != nil {
		close(stopChan)
		stopChan = nil
		if ticker != nil {
			ticker.Stop()
		}
		log.Println("Disconnecting from youtube")
	} else {
		log.Println("No youtube goroutine to stop")
	}

	wg.Wait()
}

var ticker *time.Ticker

func GetYoutubeMessages(
	handler common.HandlerInterface,
	youtubeService *youtube.Service,
	myYoutubeService *service.YoutubeService,
) {

	defer wg.Done()

	apiCallCounter++
	liveChatId, err := GetLiveChatID(youtubeService,
		myYoutubeService.DefaultService.Config.Youtube.VideoId)
	if err != nil {
		log.Printf("Error getting live chat ID: %v\n", err)
		if stopChan != nil {
			close(stopChan)
			stopChan = nil
		}
		return
	}

	nextPageToken := ""

	lastMessageDelay := myYoutubeService.DefaultService.Config.Youtube.MessageDelay
	duration := time.Duration(lastMessageDelay) * time.Millisecond
	ticker = time.NewTicker(duration)
	defer ticker.Stop()

	for {
		select {
		case <-stopChan:
			log.Println("Received stop signal. Stopping message retrieval.")
			return
		case <-ticker.C:
			messages,
				newNextPageToken,
				pollingIntervalMillis,
				err := GetLiveChatMessages(youtubeService, liveChatId, nextPageToken)

			apiCallCounter++
			log.Printf("API Call counter: %d", apiCallCounter)

			if err != nil {
				log.Println("Error in YouTube messages:", err)
				if stopChan != nil {
					close(stopChan)
					stopChan = nil
					if ticker != nil {
						ticker = nil
					}
				}
				return
			}

			if len(messages) > 0 {
				for _, message := range messages {
					// displayName := message.AuthorDetails.DisplayName
					msg := message.Snippet.DisplayMessage
					// log.Printf("%s: %s", displayName, msg)

					baseUrl := fmt.Sprintf("http://localhost:%d/emotes/",
						myYoutubeService.DefaultService.Config.Port)
					emoteUrls := parse.ParseMessageForEmotes(
						msg,
						baseUrl,
						myYoutubeService.DefaultService.EmoteMap)

					if len(emoteUrls) > 0 {
						time.Sleep(100 * time.Millisecond)
						// log.Printf("These are the emoteUrls: ")
						// for _, url := range emoteUrls {
						// 	log.Println(url)
						// }
						handler.EmitToAll(emoteUrls)
					}
				}
			}

			nextPageToken = newNextPageToken

			mu.Lock()
			currentMessageDelay := myYoutubeService.DefaultService.Config.Youtube.MessageDelay

			if currentMessageDelay != lastMessageDelay {
				if pollingIntervalMillis > int64(currentMessageDelay) {
					log.Printf("Polling too fast, setting to %d\n", pollingIntervalMillis)
					currentMessageDelay = int(pollingIntervalMillis)
				}
				lastMessageDelay = currentMessageDelay
				duration = time.Duration(currentMessageDelay) * time.Millisecond

				ticker.Stop()
				ticker = time.NewTicker(duration)
			}
			mu.Unlock()
		}
	}
}
