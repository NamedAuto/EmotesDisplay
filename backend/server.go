package main

import (
	"log"
	"myproject/backend/config"
	"myproject/backend/filepaths"
	"myproject/backend/handlers"
	"myproject/backend/middleware"
	"myproject/backend/mywebsocket"
	"net/http"
	"time"
)

func main() {
	// ctx := context.Background()
	filepaths.SetupFilePaths()
	myConfig, err := config.LoadConfig(filepaths.YamlPath)
	emoteMap := config.GenerateEmoteMap(filepaths.EmotePath)

	// fmt.Println("Formatted Emote Map:")
	// for key, value := range emoteMap {
	// 	fmt.Printf("%s: %s\n", key, value)
	// }

	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}
	// port := myConfig.Port.App

	handler := &mywebsocket.WebSocketHandler{}
	mux := http.NewServeMux()
	handlers.ConfigureEndpoints(mux,
		filepaths.FrontendPath,
		filepaths.EmotePath,
		filepaths.YamlPath,
		filepaths.BackgroundPath)

	mux.HandleFunc("/ws", mywebsocket.HandleConnections("http://localhost:5173", handler))

	middleware.ConfigureCORS(mux, config.AppConfig{})
	// myyoutube.ConfigureYoutube(ctx, config.YamlConfig.Youtube.ApiKey)

	if myConfig.Testing.Test {
		duration := time.Duration(myConfig.Testing.SpeedOfEmotes) * time.Millisecond
		go func() {
			stopChan := make(chan bool)
			handler.RunAtFlag(duration, func() { handler.EmitToAll(emoteMap) }, stopChan)
			stopChan <- true
		}()

		// go handler.RunAtFlag(duration, emoteMap, stopChan)
	} else {
		println("Would read messages")
	}

	log.Println("Server is starting on port 8080...")
	err = http.ListenAndServe(":8080", mux)
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}

}
