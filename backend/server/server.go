package server

import (
	"context"
	"log"
	"net/http"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"github.com/NamedAuto/EmotesDisplay/backend/helper"
	"github.com/NamedAuto/EmotesDisplay/backend/httpserver"
	"github.com/NamedAuto/EmotesDisplay/backend/myport"
	"github.com/NamedAuto/EmotesDisplay/backend/myyoutube"
	"github.com/NamedAuto/EmotesDisplay/backend/websocketserver"
	"gorm.io/gorm"
)

var handler = &websocketserver.WebSocketHandler{}
var mux = http.NewServeMux()

var db *gorm.DB

func StartServer(ctx context.Context) {
	log.Println("Server starting")
	db = database.StartDatabase("AppData/emotesDisplay.db")
	myport.CheckPort(db)

	myPaths := config.GetMyPaths()
	endpoints := config.GetMyEndpoints()
	folders := config.GetFolderNames()

	resultChan := make(chan config.EmotesMap)
	go func() {
		resultChan <- helper.GenerateEmoteMap(db, myPaths, folders)
	}()

	myyoutube.StartUpApiCheck(db)
	go myyoutube.WaitUntilQuotaReset(db, handler)

	emoteMap := <-resultChan
	go websocketserver.StartWebSocketServer(ctx, mux, handler, db, emoteMap, endpoints)
	go httpserver.StartHttpServer(mux, db, myPaths, endpoints, emoteMap)
}
