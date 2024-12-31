package main

import (
	"fmt"
	"log"
	"myproject/backend/config"
	"myproject/backend/filepaths"
	"myproject/backend/handlers"
	"myproject/backend/middleware"
	"net/http"
)

func maasdin() {
	filepaths.SetupFilePaths()

	mux := http.NewServeMux()
	handlers.ConfigureEndpoints(mux,
		filepaths.EmotePath,
		filepaths.YamlPath,
		filepaths.BackgroundPath)

	middleware.ConfigureCORS(mux, config.AppConfig{})

	fmt.Println("Server started at :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
