package server

import (
	"context"
	"log"
	"net/http"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"github.com/NamedAuto/EmotesDisplay/backend/httpserver"
	"github.com/NamedAuto/EmotesDisplay/backend/myyoutube"
	"github.com/NamedAuto/EmotesDisplay/backend/service"
	"github.com/NamedAuto/EmotesDisplay/backend/websocketserver"
	"gorm.io/gorm"
)

var handler = &websocketserver.WebSocketHandler{}
var mux = http.NewServeMux()

var previewService *service.PreviewService
var youtubeService *service.YoutubeService
var db *gorm.DB

func StartServer(ctx context.Context) {
	log.Println("Server starting")
	db = database.StartDb()

	appConfig := database.GetAppConfig()
	myPaths := config.GetMyPaths()
	repo := config.GetRepo()
	emoteMap := config.GetEmoteMap()

	previewService = &service.PreviewService{
		Config:   appConfig,
		EmoteMap: emoteMap,
	}

	youtubeService = &service.YoutubeService{
		Ctx:            &ctx,
		PreviewService: previewService,
	}

	go myyoutube.ConfigureYoutube(ctx, appConfig.Youtube.ApiKey)
	go websocketserver.StartWebSocketServer(mux, handler, db, youtubeService)
	go httpserver.StartHttpServer(mux, db, myPaths, repo, appConfig.Port.Port)
}
