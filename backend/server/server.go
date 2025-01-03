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
	"os"
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

func startEmits(myConfig *config.AppConfig) {
	if myConfig.Testing.Test {
		duration := time.Duration(myConfig.Testing.SpeedOfEmotes) * time.Millisecond
		go func() {
			stopChan := make(chan bool)
			handler.RunAtFlag(duration, func() { handler.EmitToAllRandom(myConfig.Port, emoteMap) }, stopChan)
			stopChan <- true
		}()

	} else {
		println("Would read messages")
	}
}

func listenAndServe(myConfig *config.AppConfig) {
	go func() {
		log.Printf("Server is starting on port %d...", myConfig.Port)
		err := http.ListenAndServe(fmt.Sprintf(":%d", myConfig.Port),
			middleware.ConfigureCORS(mux, config.AppConfig{}))
		if err != nil {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()
}

func setLogOutput() {
	logFile, err := os.OpenFile("server.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		fmt.Println("Failed to open log file:", err)
		// return
	}

	defer logFile.Close()
	log.SetOutput(logFile)
}

func StartServer(ctx context.Context) {
	// setLogOutput()
	log.Println("Starting application... In Server")

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
	myyoutube.ConfigureYoutube(ctx, MyConfig.Youtube.ApiKey)

	if MyConfig.Testing.Test {
		// Emit random emotes
		startEmits(MyConfig)
	} else {
		log.Println("WANT TO READ YOUTUBE MESSAGES")
		// Get youtube messages and get emotes
		go getYoutubeMessages(myyoutube.YoutubeService, MyConfig.Youtube.VideoId, MyConfig.Youtube.MessageDelay)

	}

	listenAndServe(MyConfig)
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

				for _, url := range emoteUrls {
					fmt.Printf("Emote Found: %s\n", url)
					handler.EmitToAll(url)
				}
			}
		}

		time.Sleep(time.Duration(messageDelay) * time.Second)

		nextPageToken = newNextPageToken
	}
}
