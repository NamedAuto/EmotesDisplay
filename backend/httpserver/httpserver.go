package httpserver

import (
	"fmt"
	"log"
	"net/http"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"github.com/NamedAuto/EmotesDisplay/backend/middleware"
	"gorm.io/gorm"
)

func StartHttpServer(mux *http.ServeMux,
	db *gorm.DB,
	myPaths config.MyPaths,
	endpoints config.Endpoint) {

	ConfigureEndpoints(mux, db, myPaths, endpoints)

	var port database.Port
	db.First(&port)

	log.Printf("Starting http server on port %d\n", port.Port)
	err := http.ListenAndServe(fmt.Sprintf(":%d", port.Port),
		middleware.ConfigureCORS(mux))
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
