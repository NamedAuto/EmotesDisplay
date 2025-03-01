package common

import (
	"context"
	"net/http"

	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

type HandlerInterface interface {
	AddConnection(ws *websocket.Conn)
	RemoveConnection(ws *websocket.Conn)
	ConfigureUpgrader(allowedOrigin string) websocket.Upgrader
	HandleConnections(ctx context.Context,
		allowedOrigin string,
		db *gorm.DB,
		emoteMap map[string]string) http.HandlerFunc
	HandleMessage(ctx context.Context,
		ws *websocket.Conn,
		message []byte,
		db *gorm.DB,
		emoteMap map[string]string)
	EmitToAllRandom(port int, emoteMap map[string]string)
	EmitYoutubeEmotes(emoteUrls []string)
	EmitTwitchEmotes(emoteUrls []string)
	EmitPreviewConnection(connected bool)
	EmitYoutubeConnection(connected bool)
	EmitTwitchConnection(connected bool)
	EmitAuthenticationPresent(success AuthenticationPresent)
}
