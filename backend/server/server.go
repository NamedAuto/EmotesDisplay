package server

import (
	"context"
	"fmt"
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

	myPaths := config.GetMyPaths()
	endpoints := config.GetMyEndpoints()
	folders := config.GetFolderNames()

	resultChan := make(chan config.EmotesMap)
	go func() {
		resultChan <- helper.GenerateEmoteMap(db, myPaths, folders)
	}()
	emoteMap := <-resultChan

	myyoutube.StartUpApiCheck(db)
	go myyoutube.WaitUntilQuotaReset(db, handler)

	var p database.Port
	db.First(&p)
	port := p.Port
	if myport.IsPortAvailable(port) {
		fmt.Printf("Port %d is available!\n", port)
	} else {
		fmt.Printf("Port %d is already in use. Searching for another one.\n", port)
		startPort := 49152
		endPort := 65535

		port, err := myport.FindAvailablePort(startPort, endPort)
		if err != nil {
			log.Println("Error:", err)
		} else {
			log.Printf("Found available port : %d\n", port)
			p.Port = port
			db.Model(&p).Update("Port", port)
		}
	}

	go websocketserver.StartWebSocketServer(ctx, mux, handler, db, emoteMap, endpoints)
	go httpserver.StartHttpServer(mux, db, myPaths, endpoints, emoteMap)
}
