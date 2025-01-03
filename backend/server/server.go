package server

import (
	"context"
	"fmt"
	"log"
	"myproject/backend/config"
	"myproject/backend/handlers"
	"myproject/backend/middleware"
	"myproject/backend/myyoutube"
	"myproject/backend/parse"
	"net/http"
	"time"

	"github.com/joho/godotenv"
	"google.golang.org/api/youtube/v3"
)

var MyConfig *config.AppConfig
var emoteMap map[string]string

var handler *handlers.WebSocketHandler
var mux *http.ServeMux

func loadEmotes() {
	emoteMap = config.GenerateEmoteMap(config.EmotePath)
}

func ConfigureConnection(myConfig *config.AppConfig) {
	handler = &handlers.WebSocketHandler{}

	mux = http.NewServeMux()

	url := fmt.Sprintf("http://localhost:%d", myConfig.Port)

	mux.HandleFunc("/ws", handlers.HandleConnections(myConfig.Port, url, handler))
	handlers.ConfigureEndpoints(
		mux,
		config.EmotePath,
		config.YamlPath,
		config.BackgroundPath)
}

func startEmits(ctx context.Context, myConfig *config.AppConfig) {
	if myConfig.Testing.Test {
		duration := time.Duration(myConfig.Testing.SpeedOfEmotes) * time.Millisecond
		go func() {
			stopChan := make(chan bool)
			handler.RunAtFlag(duration, func() { handler.EmitToAllRandom(myConfig.Port, emoteMap) }, stopChan)
			stopChan <- true
		}()

	} else {
		log.Println("Connecting to youtube")
		myyoutube.ConfigureYoutube(ctx, MyConfig.Youtube.ApiKey)
		go getYoutubeMessages(myyoutube.YoutubeService, MyConfig.Youtube.VideoId, MyConfig.Youtube.MessageDelay)

		// done := make(chan string)
		// go startYoutube(ctx, myConfig)
	}
}

func startYoutube(ctx context.Context, myConfig *config.AppConfig) {
	myyoutube.ConfigureYoutube(ctx, myConfig.Youtube.ApiKey)
	getYoutubeMessages(myyoutube.YoutubeService, myConfig.Youtube.VideoId, myConfig.Youtube.MessageDelay)
}

func listenAndServe(myConfig *config.AppConfig) {
	go func() {
		log.Printf("Server is listening on port %d...", myConfig.Port)
		err := http.ListenAndServe(fmt.Sprintf(":%d", myConfig.Port),
			middleware.ConfigureCORS(mux, config.AppConfig{}))
		if err != nil {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()
}

func StartServer(ctx context.Context) {
	log.Println("Server starting")

	godotenv.Load()

	config.SetupFilePaths()

	var err error
	MyConfig, err = config.LoadConfig(config.YamlPath)

	println(err)

	loadEmotes()
	// fmt.Println("Formatted Emote Map:")
	// for key, value := range emoteMap {
	// 	fmt.Printf("%s: %s\n", key, value)
	// }

	ConfigureConnection(MyConfig)

	listenAndServe(MyConfig)

	startEmits(ctx, MyConfig)
}

func getYoutubeMessages(youtubeService *youtube.Service, videoId string, messageDelay int) {
	apiCallCounter := 1
	liveChatId, err := myyoutube.GetLiveChatID(youtubeService, videoId)
	if err != nil {
		log.Printf("Error getting live chat ID: %v\n", err)
		return
	}

	var nextPageToken = ""

	for {
		// go func() {
		messages,
			newNextPageToken,
			err := myyoutube.GetLiveChatMessages(youtubeService, liveChatId, nextPageToken)

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

				baseUrl := fmt.Sprintf("http://localhost:%d/emotes/", MyConfig.Port)
				emoteUrls := parse.ParseMessageForEmotes(msg, baseUrl, emoteMap)

				if len(emoteUrls) > 0 {
					time.Sleep(100 * time.Millisecond)
					handler.EmitToAll(emoteUrls)
				}
			}
		}

		time.Sleep(time.Duration(messageDelay) * time.Second)

		nextPageToken = newNextPageToken
	}
}
