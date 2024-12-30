package server

import (
	"context"
	"fmt"
	"log"
	"myproject/backend/config"
	"myproject/backend/filepaths"
	"myproject/backend/handlers"
	"myproject/backend/middleware"
	"myproject/backend/mywebsocket"
	"net/http"
	"os"
	"time"
)

func StartServer(ctx context.Context) {
	logFile, err := os.OpenFile("output.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		fmt.Println("Failed to open log file:", err)
		return
	}
	defer logFile.Close()
	log.SetOutput(logFile)
	log.Println("Starting application...")

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
	mux.HandleFunc("/ws", mywebsocket.HandleConnections("http://localhost:8080", handler))
	handlers.ConfigureEndpoints(mux,
		filepaths.FrontendPath,
		filepaths.EmotePath,
		filepaths.YamlPath,
		filepaths.BackgroundPath)

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

// func main() {
//     env := os.Getenv("ENV")
//     log.Printf("Current environment: %s", env)

//     var dbConnection string
//     if env == "development" {
//         dbConnection = os.Getenv("DEV_DB_CONNECTION")
//     } else if env == "production" {
//         dbConnection = os.Getenv("PROD_DB_CONNECTION")
//     }

//     log.Printf("Database Connection: %s", dbConnection)

//     // Start your application logic here
// }
