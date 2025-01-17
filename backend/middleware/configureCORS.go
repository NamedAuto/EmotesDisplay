package middleware

import (
	"net/http"

	"github.com/rs/cors"
)

func ConfigureCORS(handler http.Handler) http.Handler {
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Content-Type", "Authorization", "Sec-WebSocket-Protocol"},
		AllowCredentials: true,
	})
	return c.Handler(handler)
}
