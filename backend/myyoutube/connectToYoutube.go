package myyoutube

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/NamedAuto/EmotesDisplay/backend/common"
	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"github.com/NamedAuto/EmotesDisplay/backend/parse"
	"gorm.io/gorm"

	"google.golang.org/api/youtube/v3"
)

var (
	stopChan chan bool
	wg       sync.WaitGroup
	mu       sync.Mutex
)
var apiCallCounter = 0
var keyInUse = ""

func ConnectToYoutube(
	ctx context.Context,
	handler common.HandlerInterface,
	db *gorm.DB,
	emoteMap config.EmotesMap,
	endpoints config.Endpoint,
) {
	log.Println("Connecting to youtube")
	mu.Lock()
	defer mu.Unlock()

	var apiKey database.ApiKey
	db.First(&apiKey)

	if youtubeService == nil || keyInUse != *apiKey.ApiKey {
		keyInUse = *apiKey.ApiKey
		ConfigureYoutube(ctx, *apiKey.ApiKey)
	}

	if stopChan != nil {
		log.Println("Youtube goroutine is already running")
		return
	}

	stopChan = make(chan bool)
	wg.Add(1)

	go GetYoutubeMessages(handler, db, youtubeService, emoteMap, endpoints)
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
	db *gorm.DB,
	youtubeService *youtube.Service,
	emoteMap config.EmotesMap,
	endpoints config.Endpoint,
) {

	defer wg.Done()

	var youtube database.Youtube
	var port database.Port
	db.First(&youtube)
	db.First(&port)

	apiCallCounter++

	liveChatId, err := GetLiveChatID(youtubeService, *youtube.VideoId)
	if err != nil {
		log.Printf("Error getting live chat ID: %v\n", err)
		if stopChan != nil {
			close(stopChan)
			stopChan = nil
		}
		return
	}

	nextPageToken := ""

	handler.EmitYoutubeConnection(true)
	lastMessageDelay := youtube.MessageDelay
	duration := time.Duration(lastMessageDelay) * time.Millisecond
	ticker = time.NewTicker(duration)
	defer ticker.Stop()

	for {
		select {
		case <-stopChan:
			log.Println("Received stop signal. Stopping message retrieval.")
			handler.EmitYoutubeConnection(false)
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
				handler.EmitYoutubeConnection(false)
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

					baseChannelUrl :=
						fmt.Sprintf("http://localhost:%d/%s/", port.Port, endpoints.ChannelEmote)
					baseGlobalUrl :=
						fmt.Sprintf("http://localhost:%d/%s/", port.Port, endpoints.GlobalEmote)
					emoteUrls := parse.ParseYoutubeMessage(
						msg,
						baseChannelUrl,
						baseGlobalUrl,
						emoteMap,
						*youtube.ShowGlobalEmotes)

					/*
						The sleep() is used to prevent the browser from becoming unresponsive from
						receiving too many emotes at once
					*/
					if len(emoteUrls) > 0 {
						time.Sleep(100 * time.Millisecond)
						// log.Printf("These are the emoteUrls: ")
						// for _, url := range emoteUrls {
						// 	log.Println(url)
						// }
						handler.EmitYoutubeEmotes(emoteUrls)
					}
				}
			}

			nextPageToken = newNextPageToken

			mu.Lock()

			var currentMessageDelay int
			db.Model(&database.Youtube{}).
				Where("id = ?", youtube.ID).
				Select("message_delay").
				Scan(&currentMessageDelay)

			if currentMessageDelay != lastMessageDelay ||
				pollingIntervalMillis > int64(currentMessageDelay) {
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
