package server

import (
	"context"
	"fmt"
	"log"
	"net"
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

	myyoutube.StartUpApiCheck(db)
	go myyoutube.WaitUntilQuotaReset()

	var p database.Port
	db.First(&p)
	port := p.Port
	if isPortAvailable(port) {
		fmt.Printf("Port %d is available!\n", port)
	} else {
		fmt.Printf("Port %d is already in use. Searching for another one.\n", port)
		startPort := 49152
		endPort := 65535

		port, err := findAvailablePort(startPort, endPort)
		if err != nil {
			log.Println("Error:", err)
		} else {
			log.Printf("Found available port : %d\n", port)
			p.Port = port
			db.Model(&p).Update("Port", port)
		}
	}

	myPaths := config.GetMyPaths()
	endpoints := config.GetMyEndpoints()
	emoteMap := config.GetEmoteMap()

	go websocketserver.StartWebSocketServer(ctx, mux, handler, db, emoteMap, endpoints)
	go httpserver.StartHttpServer(mux, db, myPaths, endpoints)
}

func isPortAvailable(port int) bool {
	ln, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		return false
	}
	ln.Close()
	return true
}

func findAvailablePort(startPort, endPort int) (int, error) {
	for port := startPort; port <= endPort; port++ {
		ln, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
		if err == nil {
			ln.Close()
			return port, nil
		}
	}
	return 0, fmt.Errorf("no available port found in the range %d-%d", startPort, endPort)
}
