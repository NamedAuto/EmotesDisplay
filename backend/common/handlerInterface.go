package common

import (
	"net/http"

	"github.com/NamedAuto/EmotesDisplay/backend/service"
	"github.com/gorilla/websocket"
)

type HandlerInterface interface {
	AddConnection(ws *websocket.Conn)
	RemoveConnection(ws *websocket.Conn)
	ConfigureUpgrader(allowedOrigin string) websocket.Upgrader
	HandleConnections(allowedOrigin string, youtubeService *service.YoutubeService) http.HandlerFunc
	HandleMessage(ws *websocket.Conn, message []byte, youtubeService *service.YoutubeService)
	EmitToAllRandom(port int, emoteMap map[string]string)
	EmitToAll(emoteUrls []string)
	DefaultConnection(connected bool)
	EmitConnectionToYoutube(connected bool)
}
