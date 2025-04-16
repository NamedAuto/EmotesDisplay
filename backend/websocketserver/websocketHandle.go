package websocketserver

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
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
	emoteMap *config.EmotesMap,
	endpoints *config.Endpoint) http.HandlerFunc {

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
				handler.HandleMessage(ctx, ws, msg, db, emoteMap, endpoints)
			}
		}()

		<-done

		handler.RemoveConnection(ws)
		log.Printf("Client disconnected: %s", ws.RemoteAddr().String())
	}
}

/*
func (handler *WebSocketHandler) HandleConnections(
	ctx context.Context,
	allowedOrigin string,
	db *gorm.DB,
	emotesChannel chan config.EmotesMap,
	endpoints config.Endpoint) http.HandlerFunc {

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
		// emoteMap := <-emotesChannel

		done := make(chan struct{})
		go func() {
			defer close(done)
			var emoteMap config.EmotesMap
			for {
				select {
				case emoteMap = <-emotesChannel: // Get latest emotesMap from channel
					log.Println("Updated emoteMap received")
				default:
					_, msg, err := ws.ReadMessage()
					if err != nil {
						log.Printf("Read error: %v", err)
						return
						//break
					}
					log.Printf("Received: %s\n", msg)
					handler.HandleMessage(ctx, ws, msg, db, emoteMap, endpoints)
				}
			}
		}()

		<-done

		handler.RemoveConnection(ws)
		log.Printf("Client disconnected: %s", ws.RemoteAddr().String())
	}
}
*/

func (handler *WebSocketHandler) HandleMessage(
	ctx context.Context,
	ws *websocket.Conn,
	message []byte,
	db *gorm.DB,
	emoteMap *config.EmotesMap,
	endpoints *config.Endpoint) {

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
		myyoutube.ConnectToYoutube(ctx, handler, db, emoteMap, endpoints)
	case "disconnectYoutube":
		myyoutube.DisconnectFromYoutube()
	case "connectTwitch":
		twitch.ConnectToIRC(handler, db)
	case "disconnectTwitch":
		twitch.DisconnectFromIRC(handler)
	case "startPreview":
		previewView.StartPreview(handler, db, emoteMap, endpoints)
	case "stopPreview":
		previewView.StopPreview()
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
