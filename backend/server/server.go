package server

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/httpserver"
	"github.com/NamedAuto/EmotesDisplay/backend/service"
	"github.com/NamedAuto/EmotesDisplay/backend/websocketserver"
)

var handler = &websocketserver.WebSocketHandler{}
var mux = http.NewServeMux()
var myConfig *config.AppConfig
var defaultService *service.DefaultService
var youtubeService *service.YoutubeService

func startEmits(ctx context.Context, myConfig *config.AppConfig, emoteMap map[string]string) {
	if myConfig.Testing.Test {
		duration := time.Duration(myConfig.Testing.SpeedOfEmotes) * time.Millisecond
		go func() {
			stopChan := make(chan bool)
			handler.RunAtFlag(duration, func() { handler.EmitToAllRandom(myConfig.Port, emoteMap) }, stopChan)
			stopChan <- true
		}()

	}
}

func StartServer(ctx context.Context) {
	log.Println("Server starting")

	myConfig = config.GetMyConfig()
	myPaths := config.GetMyPaths()
	repo := config.GetRepo()
	emoteMap := config.GetEmoteMap()

	defaultService = &service.DefaultService{
		Config:   myConfig,
		EmoteMap: emoteMap,
	}

	youtubeService = &service.YoutubeService{
		Ctx:            &ctx,
		DefaultService: defaultService,
	}

	go websocketserver.StartWebSocketServer(mux, handler, youtubeService)
	go httpserver.StartHttpServer(mux, myPaths, repo, myConfig.Port)

	// startEmits(ctx, myConfig, emoteMap)
}
