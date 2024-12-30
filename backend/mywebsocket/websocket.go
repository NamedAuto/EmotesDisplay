package mywebsocket

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"sync"
	"time"

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

func (handler *WebSocketHandler) EmitToAll(emoteMap map[string]string) {
	handler.mu.Lock()
	defer handler.mu.Unlock()

	// message := getRandomEmoteValue(emoteMap)
	emote := getRandomEmoteKey(emoteMap)
	message := parseEmoteToURL(emote, "http://localhost:8080/emotes/")
	// fmt.Printf("Emit: %s\n", message)

	msg := map[string]string{
		"type": "new-emote",
		"data": message,
	}

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

// ConfigureUpgrader creates a new WebSocket upgrader with custom settings.
func ConfigureUpgrader(allowedOrigin string) websocket.Upgrader {
	return websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			fmt.Println("Received connection attempt from origin:", r.Header.Get("Origin"))
			fmt.Println(r)
			origin := r.Header.Get("Origin")
			if origin == "http://wails.localhost:34115" || origin == "http://localhost:5173" || origin == "http://localhost:8080" || origin == "http://wails.localhost:8080" {
				// if origin == "http://wails.localhost:8080" || origin == "http://localhost:8080" {
				return true
			}
			log.Printf("Invalid origin: %s", origin)
			return false
		},
	}
}

// HandleConnections handles incoming WebSocket connections.
func HandleConnections(allowedOrigin string, handler *WebSocketHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("HTTP handler invoked")
		upgrader := ConfigureUpgrader(allowedOrigin)
		fmt.Println("Attempting to upgrade to WebSocket...")
		ws, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Printf("Upgrade error: %v", err)
			return
		}
		defer ws.Close() // Ensure the WebSocket is closed when done

		log.Printf("Client connected: %s", ws.RemoteAddr().String())
		handler.AddConnection(ws)
		// handler.ws = ws

		// Channel to signal the end of the connection
		done := make(chan struct{})

		// Goroutine to read messages
		go func() {
			defer close(done)
			for {
				_, msg, err := ws.ReadMessage()
				if err != nil {
					log.Printf("Read error: %v", err)
					break
				}
				log.Printf("Received: %s\n", msg)
			}
		}()

		// Wait for the read goroutine to finish
		<-done

		handler.RemoveConnection(ws)
		log.Printf("Client disconnected: %s", ws.RemoteAddr().String())
		// handler.ws = nil
	}
}

// func (handler *WebSocketHandler) EmitFunction(emoteMap map[string]string) {
// 	message := getRandomEmote(emoteMap)
// 	err := handler.ws.WriteMessage(websocket.TextMessage, []byte(message))
// 	if err != nil {
// 		log.Printf("Write error: %v", err)
// 	}

// }

func getRandomEmoteValue(emoteMap map[string]string) string {
	// Extract the keys of the map into a slice
	keys := make([]string, 0, len(emoteMap))
	for _, key := range emoteMap {
		keys = append(keys, key)
	}

	// randomIndex := rand.Intn(len(keys))
	// randomKey := keys[randomIndex]
	// return emoteMap[randomKey]

	return keys[rand.Intn(len(keys))]
}

func getRandomEmoteKey(emoteMap map[string]string) string {
	// Extract the keys of the map into a slice
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

// func (handler *WebSocketHandler) EmitFunction(generateMessage func() interface{}) {
// 	// Call the provided function to get the message
// 	message := generateMessage()

// 	// Use type assertion to handle different data types
// 	switch v := message.(type) {
// 	case string:
// 		// Send string message through the WebSocket connection
// 		err := handler.ws.WriteMessage(websocket.TextMessage, []byte(v))
// 		if err != nil {
// 			log.Printf("Write error: %v", err)
// 		}
// 	case int32:
// 		// Convert int32 to string and send through the WebSocket connection
// 		msg := fmt.Sprintf("%d", v)
// 		err := handler.ws.WriteMessage(websocket.TextMessage, []byte(msg))
// 		if err != nil {
// 			log.Printf("Write error: %v", err)
// 		}
// 	default:
// 		log.Printf("Unsupported message type: %T", v)
// 	}
// }

func (handler *WebSocketHandler) RunAtFlag(interval time.Duration, fn func(), stopChan chan bool) {
	// Create a ticker that triggers at the specified interval
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			fn()
		case <-stopChan:
			fmt.Println("Ending function")
			return
		}
	}
}
