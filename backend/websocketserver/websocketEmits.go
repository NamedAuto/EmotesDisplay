package websocketserver

import (
	"encoding/json"
	"log"

	"github.com/NamedAuto/EmotesDisplay/backend/common"
	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

func (handler *WebSocketHandler) EmitRandom(port int,
	emoteMap config.EmotesMap,
	endpoints config.Endpoint,
	db *gorm.DB) {
	handler.mu.Lock()
	defer handler.mu.Unlock()

	var random database.Preview
	db.First(&random)
	emoteUrls := generateRandomUrls(port, emoteMap, endpoints, random)

	msg := createEmoteMessage("preview-emote", emoteUrls)

	emit(msg, handler)
}

func (handler *WebSocketHandler) EmitYoutubeEmotes(emoteUrls []string) {
	handler.mu.Lock()
	defer handler.mu.Unlock()

	msg := createEmoteMessage("youtube-emote", emoteUrls)

	emit(msg, handler)
}

func (handler *WebSocketHandler) EmitTwitchEmotes(emoteUrls []string) {
	handler.mu.Lock()
	defer handler.mu.Unlock()

	msg := createEmoteMessage("twitch-emote", emoteUrls)

	emit(msg, handler)
}

func createEmoteMessage(eventType string, data []string) map[string]any {
	return map[string]any{
		"eventType": eventType,
		"data":      data,
	}
}

func (handler *WebSocketHandler) EmitPreviewConnection(connected bool) {
	handler.mu.Lock()
	defer handler.mu.Unlock()

	msg := createConnectionMessage(connected, "preview-connection")

	emit(msg, handler)
}

func (handler *WebSocketHandler) EmitYoutubeConnection(connected bool) {
	handler.mu.Lock()
	defer handler.mu.Unlock()

	msg := createConnectionMessage(connected, "youtube-connection")

	emit(msg, handler)
}

func (handler *WebSocketHandler) EmitTwitchConnection(connected bool) {
	handler.mu.Lock()
	defer handler.mu.Unlock()

	msg := createConnectionMessage(connected, "twitch-connection")

	emit(msg, handler)
}

/*
Calculate time left on backend and send instead
Frontend just displays it counting down every second or minute
Updates if the sent value is different? Need to check

*/

func (handler *WebSocketHandler) EmitYoutubeApiTimeLeft(timeLeft int) {
	handler.mu.Lock()
	defer handler.mu.Unlock()

	msg := map[string]any{
		"eventType": "youtube-api-time-left",
		"timeLeft":  timeLeft,
	}

	emit(msg, handler)
}

func createConnectionMessage(connected bool, eventType string) map[string]any {
	var connection bool
	if connected {
		connection = true
	} else {
		connection = false
	}

	return map[string]any{
		"eventType":  eventType,
		"connection": connection,
	}
}

func (handler *WebSocketHandler) EmitAuthenticationPresent(present common.AuthenticationPresent) {
	handler.mu.Lock()
	defer handler.mu.Unlock()

	msg := map[string]any{
		"eventType":     "authentication-present",
		"youtubeApiKey": present.YoutubeApiKey,
		"twitch":        present.TwitchKey,
	}

	emit(msg, handler)

}

/*
Currently emits to all connections
*/
func emit(msg map[string]any, handler *WebSocketHandler) {
	jsonData, err := json.Marshal(msg)
	if err != nil {
		log.Printf("Error marshalling message to JSON: %v", err)
		return
	}

	for _, ws := range handler.connections {
		if ws != nil {
			err := ws.WriteMessage(websocket.TextMessage, jsonData)
			if err != nil {
				log.Printf("Write error: %v", err)
			}
		}
	}
}
