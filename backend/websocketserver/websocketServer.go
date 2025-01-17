package websocketserver

import (
	"fmt"
	"log"
	"net/http"

	"github.com/NamedAuto/EmotesDisplay/backend/service"
)

func StartWebSocketServer(mux *http.ServeMux, handler *WebSocketHandler, youtubeService *service.YoutubeService) {
	log.Printf("Starting websocket server on port %d\n", youtubeService.DefaultService.Config.Port)
	allowedOrigin := fmt.Sprintf("http://localhost:%d", youtubeService.DefaultService.Config.Port)

	mux.HandleFunc("/ws", handler.HandleConnections(allowedOrigin, youtubeService))
}
