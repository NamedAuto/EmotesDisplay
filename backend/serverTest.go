package main

import (
	"fmt"
	"log"
	"myproject/backend/config"
	"myproject/backend/httpserver"
	"myproject/backend/middleware"
	"net/http"
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
