package common

import (
	"context"
	"net/http"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
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
		emoteMap *config.EmotesMap,
		endpoints *config.Endpoint) http.HandlerFunc
	HandleMessage(ctx context.Context,
		ws *websocket.Conn,
		message []byte,
		db *gorm.DB,
		emoteMap *config.EmotesMap,
		endpoints *config.Endpoint)
	EmitRandom(port int, emoteMap config.EmotesMap, endpoints config.Endpoint, db *gorm.DB)
	EmitYoutubeEmotes(emoteUrls []EmoteInfo)
	EmitTwitchEmotes(emoteUrls []EmoteInfo)
	EmitPreviewConnection(connected bool)
	EmitYoutubeConnection(connected bool)
	EmitTwitchConnection(connected bool)
	EmitYoutubeApiTimeLeft(timeLeft int)
	EmitAuthenticationPresent(success AuthenticationPresent)
}
