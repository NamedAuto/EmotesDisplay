package common

import (
	"net/http"

	"github.com/NamedAuto/EmotesDisplay/backend/service"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

type HandlerInterface interface {
	AddConnection(ws *websocket.Conn)
	RemoveConnection(ws *websocket.Conn)
	ConfigureUpgrader(allowedOrigin string) websocket.Upgrader
	HandleConnections(allowedOrigin string, db *gorm.DB, youtubeService *service.YoutubeService) http.HandlerFunc
	HandleMessage(ws *websocket.Conn, message []byte, db *gorm.DB, youtubeService *service.YoutubeService)
	EmitToAllRandom(port int, emoteMap map[string]string)
	EmitToAll(emoteUrls []string)
	EmitPreviewConnection(connected bool)
	EmitYoutubeConnection(connected bool)
}
