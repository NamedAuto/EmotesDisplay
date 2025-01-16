package websocketserver

import (
	"fmt"
	"log"
	"net/http"
)

func StartWebSocketServer(mux *http.ServeMux, handler *WebSocketHandler, port int) {
	log.Printf("Starting websocket server on port %d\n", port)
	url := fmt.Sprintf("http://localhost:%d", port)
	mux.HandleFunc("/ws", HandleConnections(port, url, handler))
}
