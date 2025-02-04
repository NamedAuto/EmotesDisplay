package common

import (
	"net/http"

	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

type HandlerInterface interface {
	AddConnection(ws *websocket.Conn)
	RemoveConnection(ws *websocket.Conn)
	ConfigureUpgrader(allowedOrigin string) websocket.Upgrader
	HandleConnections(allowedOrigin string, db *gorm.DB, emoteMap map[string]string) http.HandlerFunc
	HandleMessage(ws *websocket.Conn, message []byte, db *gorm.DB, emoteMap map[string]string)
	EmitToAllRandom(port int, emoteMap map[string]string)
	EmitToAll(emoteUrls []string)
	EmitPreviewConnection(connected bool)
	EmitYoutubeConnection(connected bool)
	EmitAuthenticationSuccess(success AuthenticationSuccess)
}
