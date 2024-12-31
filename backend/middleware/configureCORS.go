package middleware

import (
	"myproject/backend/config"
	"net/http"

	"github.com/rs/cors"
)

func ConfigureCORS(handler http.Handler, config config.AppConfig) http.Handler {
	c := cors.New(cors.Options{
		// AllowedOrigins:   []string{"http://localhost:8080", "http://wails.localhost:", "http://wails.localhost"}, // + strconv.Itoa(config.Port.Browser)}, // Adjust as needed
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Content-Type", "Authorization", "Sec-WebSocket-Protocol"},
		AllowCredentials: true,
	})
	return c.Handler(handler)
}
