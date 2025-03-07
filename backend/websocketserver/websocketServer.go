package websocketserver

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"gorm.io/gorm"
)

func StartWebSocketServer(ctx context.Context,
	mux *http.ServeMux,
	handler *WebSocketHandler,
	db *gorm.DB,
	emoteMap config.EmotesMap,
	endpoints config.Endpoint) {

	var port database.Port
	db.First(&port)
	log.Printf("Starting websocket server on port %d\n", port.Port)
	allowedOrigin := fmt.Sprintf("http://localhost:%d", port.Port)

	mux.HandleFunc("/ws", handler.HandleConnections(ctx, allowedOrigin, db, emoteMap, endpoints))
}
