package httpserver

import (
	"fmt"
	"log"
	"net/http"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/middleware"
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