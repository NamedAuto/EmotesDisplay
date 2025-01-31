package server

import (
	"context"
	"log"
	"net/http"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"github.com/NamedAuto/EmotesDisplay/backend/httpserver"
	"github.com/NamedAuto/EmotesDisplay/backend/myyoutube"
	"github.com/NamedAuto/EmotesDisplay/backend/websocketserver"
	"gorm.io/gorm"
)

var handler = &websocketserver.WebSocketHandler{}
var mux = http.NewServeMux()

var db *gorm.DB

func StartServer(ctx context.Context) {
	log.Println("Server starting")
	db = database.StartDatabase()

	appConfig := database.GetAppConfig()
	myPaths := config.GetMyPaths()
	repo := config.GetRepo()
	emoteMap := config.GetEmoteMap()

	go myyoutube.ConfigureYoutube(ctx, appConfig.Youtube.ApiKey)
	go websocketserver.StartWebSocketServer(mux, handler, db, emoteMap)
	go httpserver.StartHttpServer(mux, db, myPaths, repo, appConfig.Port.Port)
}
