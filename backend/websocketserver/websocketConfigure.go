package websocketserver

import (
	"log"
	"net/http"
	"os"
	"slices"
	"sync"

	"github.com/gorilla/websocket"
)

type WebSocketHandler struct {
	connections []*websocket.Conn
	mu          sync.Mutex
}

func (handler *WebSocketHandler) AddConnection(ws *websocket.Conn) {
	handler.mu.Lock()
	handler.connections = append(handler.connections, ws)
	handler.mu.Unlock()
}

func (handler *WebSocketHandler) RemoveConnection(ws *websocket.Conn) {
	handler.mu.Lock()
	defer handler.mu.Unlock()
	for i, conn := range handler.connections {
		if conn == ws {
			handler.connections = slices.Delete(handler.connections, i, i+1)
			break
		}
	}
}

func (handler *WebSocketHandler) ConfigureUpgrader(allowedOrigin string) websocket.Upgrader {
	return websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			log.Println("Received connection attempt from origin:", r.Header.Get("Origin"))
			origin := r.Header.Get("Origin")

			env := os.Getenv("ENV")
			if env == "development" {
				if origin == "http://wails.localhost:34115" ||
					origin == "http://localhost:5173" ||
					origin == allowedOrigin {
					return true
				}
			} else {
				// Allow wails window to connect to ws
				if origin == allowedOrigin || origin == "http://wails.localhost" {
					return true
				}
			}

			log.Printf("Invalid origin: %s", origin)
			return false
		},
	}
}
