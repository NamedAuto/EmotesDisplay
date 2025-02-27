package websocketserver

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/NamedAuto/EmotesDisplay/backend/common"
	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"github.com/NamedAuto/EmotesDisplay/backend/myyoutube"
	"github.com/NamedAuto/EmotesDisplay/backend/previewView"
	"github.com/NamedAuto/EmotesDisplay/backend/twitch"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

func (handler *WebSocketHandler) HandleConnections(
	ctx context.Context,
	allowedOrigin string,
	db *gorm.DB,
	emoteMap map[string]string) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {
		upgrader := handler.ConfigureUpgrader(allowedOrigin)
		log.Println("Attempting to upgrade to WebSocket...")
		ws, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Printf("Upgrade error: %v", err)
			return
		}
		defer ws.Close()

		log.Printf("Client connected: %s", ws.RemoteAddr().String())
		handler.AddConnection(ws)

		done := make(chan struct{})
		go func() {
			defer close(done)
			for {
				_, msg, err := ws.ReadMessage()
				if err != nil {
					log.Printf("Read error: %v", err)
					break
				}
				log.Printf("Received: %s\n", msg)
				handler.HandleMessage(ctx, ws, msg, db, emoteMap)
			}
		}()

		<-done

		handler.RemoveConnection(ws)
		log.Printf("Client disconnected: %s", ws.RemoteAddr().String())
	}
}

func (handler *WebSocketHandler) HandleMessage(
	ctx context.Context,
	ws *websocket.Conn,
	message []byte,
	db *gorm.DB,
	emoteMap map[string]string) {

	var event map[string]any
	if err := json.Unmarshal(message, &event); err != nil {
		log.Printf("Unmarshal error: %v", err)
		return
	}

	eventType, ok := event["eventType"].(string)
	if !ok {
		log.Printf("Invalid event type")
		return
	}

	switch eventType {

	// Example
	case "customEvent":
		data, ok := event["data"].(map[string]any)
		if !ok {
			log.Printf("Invalid event data")
			return
		}

		log.Printf("Received customEvent with data: %v", data)

	case "connectYoutube":
		myyoutube.ConnectToYoutube(ctx, handler, db, emoteMap)
	case "disconnectYoutube":
		myyoutube.DisconnectFromYoutube()
	case "connectTwitch":
		twitch.ConnectToIRC(handler, db)
	case "disconnectTwitch":
		twitch.DisconnectFromIRC()
	case "startPreview":
		previewView.StartPreview(handler, db, emoteMap)
	case "stopPreview":
		previewView.StopPreview()

	case "has-youtube-api-key":

	case "authentication-present":
		database.IsAuthenticationPresent(handler, db)
	case "authentication":
		data, ok := event["data"].(map[string]any)
		if !ok {
			log.Printf("Invalid event data")
			return
		}
		database.SaveAuthentication(handler, db, data)
	// case "twitch-user-auth-code":
	// 	data, ok := event["code"].(string)
	// 	if !ok {
	// 		log.Printf("Invalid event data")
	// 		return
	// 	}

	// 	log.Printf("This is my code %s", data)
	// 	twitch.GetUserAccessToken(data)
	// 	twitch.GetUser()
	// 	twitch.ConnectToChatIRC(handler)

	default:
		log.Printf("Unknown event type: %s", eventType)
	}
}

func (handler *WebSocketHandler) EmitToAllRandom(port int, emoteMap map[string]string) {
	handler.mu.Lock()
	defer handler.mu.Unlock()

	message := generateRandomUrls(port, emoteMap)

	msg := map[string]any{
		"eventType": "new-emote",
		"data":      message,
	}

	emit(msg, handler)
}

func (handler *WebSocketHandler) EmitToAll(emoteUrls []string) {
	handler.mu.Lock()
	defer handler.mu.Unlock()

	msg := map[string]any{
		"eventType": "new-emote",
		"data":      emoteUrls,
	}
	// fmt.Printf("Emit: %s\n", emoteUrls)

	emit(msg, handler)
}

func (handler *WebSocketHandler) EmitTwitchEmotes(emoteUrls []string) {
	handler.mu.Lock()
	defer handler.mu.Unlock()

	msg := map[string]any{
		"eventType": "twitch-emote",
		"data":      emoteUrls,
	}

	emit(msg, handler)
}

func (handler *WebSocketHandler) EmitPreviewConnection(connected bool) {
	handler.mu.Lock()
	defer handler.mu.Unlock()

	var msg map[string]any
	if connected {
		msg = map[string]any{
			"eventType":  "preview-connection",
			"connection": "connected",
		}
	} else {
		msg = map[string]any{
			"eventType":  "preview-connection",
			"connection": "disconnected",
		}
	}

	emit(msg, handler)
}

func (handler *WebSocketHandler) EmitYoutubeConnection(connected bool) {
	handler.mu.Lock()
	defer handler.mu.Unlock()

	var msg map[string]any
	if connected {
		msg = map[string]any{
			"eventType":  "youtube-connection",
			"connection": "connected",
		}
	} else {
		msg = map[string]any{
			"eventType":  "youtube-connection",
			"connection": "disconnected",
		}
	}

	emit(msg, handler)
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
