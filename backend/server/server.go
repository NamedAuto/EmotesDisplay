package server

import (
	"context"
	"log"
	"net/http"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/httpserver"
	"github.com/NamedAuto/EmotesDisplay/backend/myyoutube"
	"github.com/NamedAuto/EmotesDisplay/backend/service"
	"github.com/NamedAuto/EmotesDisplay/backend/websocketserver"
)

var handler = &websocketserver.WebSocketHandler{}
var mux = http.NewServeMux()
var myConfig *config.AppConfig
var previewService *service.PreviewService
var youtubeService *service.YoutubeService

func StartServer(ctx context.Context) {
	log.Println("Server starting")

	myConfig = config.GetMyConfig()
	myPaths := config.GetMyPaths()
	repo := config.GetRepo()
	emoteMap := config.GetEmoteMap()

	previewService = &service.PreviewService{
		Config:   myConfig,
		EmoteMap: emoteMap,
	}

	youtubeService = &service.YoutubeService{
		Ctx:            &ctx,
		PreviewService: previewService,
	}

	go myyoutube.ConfigureYoutube(ctx, myConfig.Youtube.ApiKey)
	go websocketserver.StartWebSocketServer(mux, handler, youtubeService)
	go httpserver.StartHttpServer(mux, myPaths, repo, myConfig.Port)
}
