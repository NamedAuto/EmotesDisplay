package server

import (
	"fmt"
	"log"
	"myproject/backend/config"
	"myproject/backend/handlers"
	"myproject/backend/middleware"
	"myproject/backend/mywebsocket"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
)

var MyConfig *config.AppConfig
var emoteMap map[string]string

var handler *mywebsocket.WebSocketHandler
var mux *http.ServeMux

func loadEmotes() {
	emoteMap = config.GenerateEmoteMap(config.EmotePath)
}

func ConfigureConnection(myConfig *config.AppConfig) {
	handler = &mywebsocket.WebSocketHandler{}

	mux = http.NewServeMux()

	url := fmt.Sprintf("http://localhost:%d", myConfig.Port)

	mux.HandleFunc("/ws", mywebsocket.HandleConnections(myConfig.Port, url, handler))
	handlers.ConfigureEndpoints(
		mux,
		config.EmotePath,
		config.YamlPath,
		config.BackgroundPath)
}

func startEmits(myConfig *config.AppConfig) {
	if myConfig.Testing.Test {
		duration := time.Duration(myConfig.Testing.SpeedOfEmotes) * time.Millisecond
		go func() {
			stopChan := make(chan bool)
			handler.RunAtFlag(duration, func() { handler.EmitToAll(myConfig.Port, emoteMap) }, stopChan)
			stopChan <- true
		}()

	} else {
		println("Would read messages")
	}
}

func listenAndServe(myConfig *config.AppConfig) {
	go func() {
		log.Printf("Server is starting on port %d...", myConfig.Port)
		err := http.ListenAndServe(fmt.Sprintf(":%d", myConfig.Port),
			middleware.ConfigureCORS(mux, config.AppConfig{}))
		if err != nil {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()
}

func setLogOutput() {
	logFile, err := os.OpenFile("server.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		fmt.Println("Failed to open log file:", err)
		// return
	}

	defer logFile.Close()
	log.SetOutput(logFile)
}

func StartServer() {
	setLogOutput()
	log.Println("Starting application... In Server")

	godotenv.Load()

	config.SetupFilePaths()

	var err error
	MyConfig, err = config.LoadConfig(config.YamlPath)

	println(err)

	loadEmotes()
	// fmt.Println("Formatted Emote Map:")
	// for key, value := range emoteMap {
	// 	fmt.Printf("%s: %s\n", key, value)
	// }

	ConfigureConnection(MyConfig)

	startEmits(MyConfig)

	listenAndServe(MyConfig)
}
