package websocketserver

import (
	"fmt"
	"log"
	"net/http"

	"github.com/NamedAuto/EmotesDisplay/backend/service"
)

func StartWebSocketServer(mux *http.ServeMux,
	handler *WebSocketHandler,
	youtubeService *service.YoutubeService) {

	port := youtubeService.DefaultService.Config.Port
	log.Printf("Starting websocket server on port %d\n", port)
	allowedOrigin := fmt.Sprintf("http://localhost:%d", port)

	mux.HandleFunc("/ws", handler.HandleConnections(allowedOrigin, youtubeService))
}
