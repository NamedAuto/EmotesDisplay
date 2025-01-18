package websocketserver

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"regexp"
	"sync"

	"github.com/NamedAuto/EmotesDisplay/backend/defaultView"
	"github.com/NamedAuto/EmotesDisplay/backend/myyoutube"
	"github.com/NamedAuto/EmotesDisplay/backend/service"
	"github.com/gorilla/websocket"
	"golang.org/x/exp/rand"
)

type WebSocketHandler struct {
	connections []*websocket.Conn
	mu          sync.Mutex
}

func (handler *WebSocketHandler) AddConnection(ws *websocket.Conn) {
	handler.mu.Lock()
	handler.connections = append(handler.connections, ws)
	handler.mu.Unlock()
}

func (handler *WebSocketHandler) RemoveConnection(ws *websocket.Conn) {
	handler.mu.Lock()
	defer handler.mu.Unlock()
	for i, conn := range handler.connections {
		if conn == ws {
			handler.connections = append(handler.connections[:i], handler.connections[i+1:]...)
			break
		}
	}
}

func (handler *WebSocketHandler) ConfigureUpgrader(allowedOrigin string) websocket.Upgrader {
	return websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			log.Println("Received connection attempt from origin:", r.Header.Get("Origin"))
			origin := r.Header.Get("Origin")

			env := os.Getenv("ENV")
			if env == "development" {
				log.Println("In development in ws upgrader")
				if origin == "http://wails.localhost:34115" ||
					origin == "http://localhost:5173" ||
					origin == allowedOrigin {
					return true
				}
			} else {
				// Allow wails window to connect to ws
				if origin == allowedOrigin || origin == "http://wails.localhost" {
					return true
				}
			}

			log.Printf("Invalid origin: %s", origin)
			return false
		},
	}
}

func (handler *WebSocketHandler) HandleConnections(
	allowedOrigin string,
	youtubeService *service.YoutubeService) http.HandlerFunc {

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
				handler.HandleMessage(ws, msg, youtubeService)
			}
		}()

		<-done

		handler.RemoveConnection(ws)
		log.Printf("Client disconnected: %s", ws.RemoteAddr().String())
	}
}

func (handler *WebSocketHandler) HandleMessage(
	ws *websocket.Conn,
	message []byte,
	youtubeService *service.YoutubeService) {

	var event map[string]interface{}
	if err := json.Unmarshal(message, &event); err != nil {
		log.Printf("Unmarshal error: %v", err)
		return
	}

	eventType, ok := event["type"].(string)
	if !ok {
		log.Printf("Invalid event type")
		return
	}

	switch eventType {
	case "customEvent":
		data, ok := event["data"].(map[string]interface{})
		if !ok {
			log.Printf("Invalid event data")
			return
		}

		log.Printf("Received customEvent with data: %v", data)

	case "connectYoutube":
		myyoutube.ConnectToYoutube(handler, youtubeService)
	case "disconnectYoutube":
		myyoutube.DisconnectFromYoutube()
	case "startDefault":
		defaultView.StartDefault(handler, youtubeService.DefaultService)
	case "stopDefault":
		defaultView.StopDefault()
	default:
		log.Printf("Unknown event type: %s", eventType)
	}
}

func (handler *WebSocketHandler) EmitToAllRandom(port int, emoteMap map[string]string) {
	handler.mu.Lock()
	defer handler.mu.Unlock()

	message := generateRandomUrls(port, emoteMap)

	msg := map[string]interface{}{
		"type": "new-emote",
		"data": message,
	}

	emit(msg, handler)
}

func generateRandomUrls(port int, emoteMap map[string]string) []string {
	count := rand.Intn(3) + 1
	var urls []string
	for i := 0; i < count; i++ {
		emote := getRandomEmoteKey(emoteMap)
		url := generateEmotesUrl(port)
		message := parseEmoteToURL(emote, url)
		urls = append(urls, message)
	}

	return urls
}

func (handler *WebSocketHandler) EmitToAll(emoteUrls []string) {
	handler.mu.Lock()
	defer handler.mu.Unlock()

	msg := map[string]interface{}{
		"type": "new-emote",
		"data": emoteUrls,
	}
	// fmt.Printf("Emit: %s\n", emoteUrls)

	emit(msg, handler)
}

func (handler *WebSocketHandler) DefaultConnection(connected bool) {
	handler.mu.Lock()
	defer handler.mu.Unlock()

	var msg map[string]interface{}
	if connected {
		msg = map[string]interface{}{
			"type": "default-connection",
			"data": "connected",
		}
	} else {
		msg = map[string]interface{}{
			"type": "default-connection",
			"data": "disconnected",
		}
	}

	emit(msg, handler)
}

func (handler *WebSocketHandler) EmitConnectionToYoutube(connected bool) {
	handler.mu.Lock()
	defer handler.mu.Unlock()

	var msg map[string]interface{}
	if connected {
		msg = map[string]interface{}{
			"type": "youtube-connection",
			"data": "connected",
		}
	} else {
		msg = map[string]interface{}{
			"type": "youtube-connection",
			"data": "disconnected",
		}
	}

	emit(msg, handler)
}

func emit(msg map[string]interface{}, handler *WebSocketHandler) {
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

func generateEmotesUrl(port int) string {
	return fmt.Sprintf("http://localhost:%d/emotes/", port)
}

func getRandomEmoteKey(emoteMap map[string]string) string {
	keys := make([]string, 0, len(emoteMap))
	for key := range emoteMap {
		keys = append(keys, key)
	}

	randomKey := keys[rand.Intn(len(keys))]
	return randomKey
}

func parseEmoteToURL(emote string, url string) string {
	re := regexp.MustCompile(`[:_]`)
	cleanedText := re.ReplaceAllString(emote, "")
	emoteURL := url + cleanedText

	return emoteURL
}
