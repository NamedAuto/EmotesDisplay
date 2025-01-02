package main

import (
	"fmt"
	"log"
	"myproject/backend/config"
	"myproject/backend/handlers"
	"myproject/backend/middleware"
	"net/http"
)

func maasdin() {
	config.SetupFilePaths()

	mux := http.NewServeMux()
	handlers.ConfigureEndpoints(mux,
		config.EmotePath,
		config.YamlPath,
		config.BackgroundPath)

	middleware.ConfigureCORS(mux, config.AppConfig{})

	fmt.Println("Server started at :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
