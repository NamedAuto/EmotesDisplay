package httpserver

import (
	"fmt"
	"log"
	"myproject/backend/config"
	"myproject/backend/middleware"
	"net/http"
)

func StartHttpServer(mux *http.ServeMux, myPaths config.MyPaths, repo config.Repo, port int) {
	ConfigureEndpoints(
		mux,
		myPaths,
		repo)

	log.Printf("Starting http server on port %d\n", port)
	err := http.ListenAndServe(fmt.Sprintf(":%d", port),
		middleware.ConfigureCORS(mux))
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
