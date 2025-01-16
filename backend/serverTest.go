package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/httpserver"
	"github.com/NamedAuto/EmotesDisplay/backend/middleware"
)

func maasdin() {
	myPaths := config.SetupFilePaths()
	repo := config.Repo{}

	mux := http.NewServeMux()
	httpserver.ConfigureEndpoints(mux, myPaths, repo)

	middleware.ConfigureCORS(mux)

	fmt.Println("Server started at :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
