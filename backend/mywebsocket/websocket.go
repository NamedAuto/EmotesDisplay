package mywebsocket

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
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

func (handler *WebSocketHandler) EmitToAll(port int, emoteMap map[string]string) {
	handler.mu.Lock()
	defer handler.mu.Unlock()

	emote := getRandomEmoteKey(emoteMap)
	url := generateEmotesUrl(port)
	message := parseEmoteToURL(emote, url)
	fmt.Printf("Emit: %s\n", message)

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

func ConfigureUpgrader(port int, allowedOrigin string) websocket.Upgrader {
	return websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			log.Println("Received connection attempt from origin:", r.Header.Get("Origin"))
			origin := r.Header.Get("Origin")
			url := generateBaseUrl(port)

			env := os.Getenv("ENV")
			if env == "development" {
				log.Println("In development in ws upgrader")
				if origin == "http://wails.localhost:34115" ||
					origin == "http://localhost:5173" ||
					origin == url {
					return true
				}
			} else {
				// Allow wails window to connect to ws
				if origin == url || origin == "http://wails.localhost" {
					return true
				}
			}

			log.Printf("Invalid origin: %s", origin)
			return false
		},
	}
}

func HandleConnections(port int, allowedOrigin string, handler *WebSocketHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		upgrader := ConfigureUpgrader(port, allowedOrigin)
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
			}
		}()

		<-done

		handler.RemoveConnection(ws)
		log.Printf("Client disconnected: %s", ws.RemoteAddr().String())
	}
}

func generateBaseUrl(port int) string {
	return fmt.Sprintf("http://localhost:%d", port)
}

func generateEmotesUrl(port int) string {
	return fmt.Sprintf("http://localhost:%d/emotes/", port)
}

func getRandomEmoteValue(emoteMap map[string]string) string {
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

func (handler *WebSocketHandler) RunAtFlag(interval time.Duration, fn func(), stopChan chan bool) {
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			fn()
		case <-stopChan:
			log.Println("Ending function")
			return
		}
	}
}
