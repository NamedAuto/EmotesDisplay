package websocketserver

import (
	"fmt"
	"log"
	"net/http"

	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"gorm.io/gorm"
)

func StartWebSocketServer(mux *http.ServeMux,
	handler *WebSocketHandler,
	db *gorm.DB,
	emoteMap map[string]string) {

	var port database.Port
	db.First(&port) // db.Select("port").Find(&Port) // youtubeService.PreviewService.Config.Port.Port
	log.Printf("Starting websocket server on port %d\n", port.Port)
	allowedOrigin := fmt.Sprintf("http://localhost:%d", port.Port)

	mux.HandleFunc("/ws", handler.HandleConnections(allowedOrigin, db, emoteMap))
}
