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
	"github.com/NamedAuto/EmotesDisplay/backend/websocketserver"
	"gorm.io/gorm"
)

var handler = &websocketserver.WebSocketHandler{}
var mux = http.NewServeMux()

var db *gorm.DB

// 49152-65535
func StartServer(ctx context.Context) {
	log.Println("Server starting")
	db = database.StartDatabase()

	var p database.Port
	db.First(&p)
	port := p.Port
	if isPortAvailable(port) {
		fmt.Printf("Port %d is available!\n", port)
	} else {
		fmt.Printf("Port %d is already in use.\n", port)
		startPort := 49152
		endPort := 65535

		port, err := findAvailablePort(startPort, endPort)
		if err != nil {
			fmt.Println("Error:", err)
		} else {
			fmt.Printf("Found available port : %d\n", port)
			p.Port = port
			db.Model(&p).Update("Port", port)
		}
	}

	// appConfig := database.GetAppConfig()
	myPaths := config.GetMyPaths()
	endpoints := config.GetMyEndpoints()
	repo := config.GetRepo()
	emoteMap := config.GetEmoteMap()

	go websocketserver.StartWebSocketServer(ctx, mux, handler, db, emoteMap, endpoints)
	go httpserver.StartHttpServer(mux, db, myPaths, repo, endpoints)
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
