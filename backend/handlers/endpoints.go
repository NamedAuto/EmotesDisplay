package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"myproject/backend/config"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"gopkg.in/yaml.v2"
)

var extensions = []string{".png", ".jpg", ".jpeg", ".webp", ".gif"} // Add more extensions as needed

// ConfigureEmotesEndpoint sets up the /emotes/:filename endpoint.
func configureEmotesEndpoint(mux *http.ServeMux, emotePath string) {
	mux.HandleFunc("/emotes/", func(w http.ResponseWriter, r *http.Request) {
		filename := strings.TrimPrefix(r.URL.Path, "/emotes/")
		var filePath string
		for _, ext := range extensions {
			filePath = filepath.Join(emotePath, filename+ext)
			if _, err := os.Stat(filePath); err == nil {
				http.ServeFile(w, r, filePath)
				return
			}
		}
		http.Error(w, "File not found", http.StatusNotFound)
	})
}

// ConfigureBackgroundImageEndpoint sets up the /background endpoint.
func configureBackgroundImageEndpoint(mux *http.ServeMux, backgroundPath string) {
	mux.HandleFunc("/background", func(w http.ResponseWriter, r *http.Request) {
		folderPath := backgroundPath
		files, err := os.ReadDir(folderPath)
		if err != nil {
			http.Error(w, "Error reading the folder", http.StatusInternalServerError)
			return
		}

		var imageFiles []string
		for _, file := range files {
			if !file.IsDir() && contains(extensions, strings.ToLower(filepath.Ext(file.Name()))) {
				imageFiles = append(imageFiles, file.Name())
			}
		}

		if len(imageFiles) == 0 {
			http.Error(w, "No background found", http.StatusNotFound)
			return
		}

		imageName := imageFiles[0]
		imagePath := filepath.Join(folderPath, imageName)
		http.ServeFile(w, r, imagePath)
	})
}

// Helper function to check if a slice contains a string.
func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}

// ConfigureConfigEndpoint sets up the /config endpoint.
func configureConfigEndpoint(mux *http.ServeMux, yamlPath string) {
	mux.HandleFunc("/config", func(w http.ResponseWriter, r *http.Request) {
		configPath := filepath.Join(yamlPath, "config.yaml")
		if _, err := os.Stat(configPath); os.IsNotExist(err) {
			http.Error(w, "Config file not found", http.StatusNotFound)
			return
		}

		file, err := os.Open(configPath)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error reading config file: %v", err), http.StatusInternalServerError)
			return
		}
		defer file.Close()

		fileContent, err := io.ReadAll(file)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error reading config file: %v", err), http.StatusInternalServerError)
			return
		}

		var config config.AppConfig
		err = yaml.Unmarshal(fileContent, &config)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error parsing config file: %v", err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(config)
	})
}

// TODO: FIX FOR REAL USE
// ConfigureDefaultEndpoint sets up the default endpoint to serve the index.html file.
func configureDefaultEndpoint(mux *http.ServeMux, frontendPath string) {
	// fs := http.FileServer(http.Dir("../frontend/dist"))
	// http.Handle("/", fs)
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		cwd, err := os.Getwd()
		if err != nil {
			log.Fatalf("Error getting current working directory: %v", err)
		}

		if r.URL.Path == "/" || r.URL.Path == "/index.html" {
			http.ServeFile(w, r, filepath.Join(cwd, "frontend/index.html"))
		} else {
			http.NotFound(w, r)
		}

		// if r.URL.Path != "/" {
		// 	println("!= /")
		// 	println(filepath.Join(cwd, "backend/index.html"))
		// 	http.ServeFile(w, r, filepath.Join(cwd, "backend/index.html"))
		// 	return
		// }

		// http.ServeFile(w, r, filepath.Join(cwd, "backend/index.html"))
	})
}

func ConfigureEndpoints(mux *http.ServeMux, frontendPath string, emotePath string, yamlPath string, backgroundPath string) {

	configureEmotesEndpoint(mux, emotePath)
	configureConfigEndpoint(mux, yamlPath)
	configureBackgroundImageEndpoint(mux, backgroundPath)
	configureDefaultEndpoint(mux, frontendPath)
}
