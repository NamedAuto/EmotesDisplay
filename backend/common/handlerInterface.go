package common

import (
	"net/http"
	"time"

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
	RunAtFlag(interval time.Duration, fn func(), stopChan chan bool)
}