package websocketserver

import (
	"fmt"
	"log"
	"net/http"
)

func StartWebSocketServer(mux *http.ServeMux, handler *WebSocketHandler, port int) {
	log.Printf("Starting websocket server on port %d\n", port)
	allowedOrigin := fmt.Sprintf("http://localhost:%d", port)
	mux.HandleFunc("/ws", handler.handleConnections(allowedOrigin))
}
