package server

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/httpserver"
	"github.com/NamedAuto/EmotesDisplay/backend/myyoutube"
	"github.com/NamedAuto/EmotesDisplay/backend/websocketserver"
)

var handler = &websocketserver.WebSocketHandler{}
var mux = http.NewServeMux()
var myConfig *config.AppConfig

func startEmits(ctx context.Context, myConfig *config.AppConfig, emoteMap map[string]string) {
	if myConfig.Testing.Test {
		duration := time.Duration(myConfig.Testing.SpeedOfEmotes) * time.Millisecond
		go func() {
			stopChan := make(chan bool)
			handler.RunAtFlag(duration, func() { handler.EmitToAllRandom(myConfig.Port, emoteMap) }, stopChan)
			stopChan <- true
		}()

	} else {
		log.Println("Connecting to youtube")
		myyoutube.ConfigureYoutube(ctx, myConfig.Youtube.ApiKey)
		go myyoutube.GetYoutubeMessages(myyoutube.YoutubeService, myConfig.Youtube.VideoId, myConfig.Youtube.MessageDelay)

		// done := make(chan string)
		// go myyoutube.StartYoutube(ctx, myConfig)
	}
}

func StartServer(ctx context.Context) {
	log.Println("Server starting")

	myConfig = config.GetMyConfig()
	myPaths := config.GetMyPaths()
	repo := config.GetRepo()
	emoteMap := config.GetEmoteMap()

	go websocketserver.StartWebSocketServer(mux, handler, myConfig.Port)
	go httpserver.StartHttpServer(mux, myPaths, repo, myConfig.Port)

	startEmits(ctx, myConfig, emoteMap)
}
