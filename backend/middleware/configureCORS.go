package middleware

import (
	"myproject/backend/config"
	"net/http"

	"github.com/rs/cors"
)

// ConfigureCORS sets up the CORS middleware with the specified options.
func ConfigureCORS(handler http.Handler, config config.AppConfig) http.Handler {
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // + strconv.Itoa(config.Port.Browser)}, // Adjust as needed
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Content-Type", "Authorization", "Sec-WebSocket-Protocol"},
		AllowCredentials: true,
	})
	return c.Handler(handler)
}

/*
TODO: Porentially setup helmet equivalent settings
*/

// package main

// import (
//     "net/http"

//     "github.com/rs/cors"
// )

// func main() {
//     mux := http.NewServeMux()
//     mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
//         w.Header().Set("Content-Type", "application/json")
//         w.Write([]byte("{\"hello\": \"world\"}"))
//     })

//     // cors.Default() setup the middleware with default options being
//     // all origins accepted with simple methods (GET, POST). See
//     // documentation below for more options.
//     handler := cors.Default().Handler(mux)
//     http.ListenAndServe(":8080", handler)
// }
