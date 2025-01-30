package httpserver

import (
	"embed"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/github"

	"gopkg.in/yaml.v2"
)

var assets embed.FS

var extensions = []string{".png", ".jpg", ".jpeg", ".webp", ".gif"}

func AssignAssets(embed embed.FS) {
	assets = embed
}

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

func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}

func configureConfigEndpoint(mux *http.ServeMux, yamlPath string) {
	mux.HandleFunc("/config", func(w http.ResponseWriter, r *http.Request) {
		configPath := filepath.Join(yamlPath, "config.yaml")
		if r.Method == http.MethodGet {

			if _, err := os.Stat(configPath); os.IsNotExist(err) {
				http.Error(w, "Config file not found", http.StatusNotFound)
				return
			}

			file, err := os.Open(configPath)
			if err != nil {
				http.Error(w, fmt.Sprintf("Error reading config file: %v", err),
					http.StatusInternalServerError)
				return
			}
			defer file.Close()

			fileContent, err := io.ReadAll(file)
			if err != nil {
				http.Error(w, fmt.Sprintf("Error reading config file: %v", err),
					http.StatusInternalServerError)
				return
			}

			var config config.AppConfig
			err = yaml.Unmarshal(fileContent, &config)
			if err != nil {
				http.Error(w, fmt.Sprintf("Error parsing config file: %v", err),
					http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(config)

		} else if r.Method == http.MethodPost {
			var newConfig config.AppConfig

			err := json.NewDecoder(r.Body).Decode(&newConfig)
			if err != nil {
				http.Error(w, fmt.Sprintf("Error decoding JSON: %v", err),
					http.StatusBadRequest)
				return
			}

			// log.Println("This is what I received: ")
			// log.Println(config)

			fileContent, err := yaml.Marshal(&newConfig)
			if err != nil {
				http.Error(w, fmt.Sprintf("Error converting to YAML: %v", err),
					http.StatusInternalServerError)
				return
			}

			// log.Println("This is my yaml")
			// log.Println(string(fileContent))

			err = os.WriteFile(configPath, fileContent, 0644)
			if err != nil {
				http.Error(w, fmt.Sprintf("Error writing config file: %v", err),
					http.StatusInternalServerError)
				return
			}

			// config.SetMyConfig(&newConfig)
			// TODO: Update to use database
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("Config saved successfully"))
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})
}

func configureVersionEndpoint(mux *http.ServeMux, repo config.Repo) {
	mux.HandleFunc("/version", func(w http.ResponseWriter, r *http.Request) {
		latestVersion, err := github.GetLatestReleaseVersion(repo.Owner, repo.RepoName)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		response := map[string]string{
			"owner":          repo.Owner,
			"repoName":       repo.RepoName,
			"currentVersion": repo.AppVersion,
			"latestVersion":  latestVersion,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	})
}

func configureDefaultEndpoint(mux *http.ServeMux) {
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" || r.URL.Path == "/index.html" {
			data, err := assets.ReadFile("frontend/dist/index.html")
			if err != nil {
				http.Error(w, "Could not read index.html", http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "text/html")
			w.Write(data)
			return
		}

		// Otherwise, serve other static assets like JS, CSS, etc.
		data, err := assets.ReadFile("frontend/dist" + r.URL.Path)
		if err != nil {

			data, err := assets.ReadFile("frontend/dist/index.html")
			if err != nil {
				http.Error(w, "Could not read index.html", http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "text/html")
			w.Write(data)
			// http.Error(w, "File not found", http.StatusNotFound)
			return
		}

		// Set the correct Content-Type for JavaScript, CSS, etc.
		switch {
		case strings.HasSuffix(r.URL.Path, ".js"):
			w.Header().Set("Content-Type", "application/javascript")
		case strings.HasSuffix(r.URL.Path, ".css"):
			w.Header().Set("Content-Type", "text/css")
		case strings.HasSuffix(r.URL.Path, ".png"):
			w.Header().Set("Content-Type", "image/png")
		case strings.HasSuffix(r.URL.Path, ".jpg"), strings.HasSuffix(r.URL.Path, ".jpeg"):
			w.Header().Set("Content-Type", "image/jpeg")
		case strings.HasSuffix(r.URL.Path, ".svg"):
			w.Header().Set("Content-Type", "image/svg+xml")
		case strings.HasSuffix(r.URL.Path, ".ico"):
			w.Header().Set("Content-Type", "image/x-icon")
		default:
			w.Header().Set("Content-Type", "application/octet-stream")
		}

		w.Write(data)
	})
}

func ConfigureEndpoints(mux *http.ServeMux, myPaths config.MyPaths, repo config.Repo) {

	configureEmotesEndpoint(mux, myPaths.EmotePath)
	configureConfigEndpoint(mux, myPaths.YamlPath)
	configureBackgroundImageEndpoint(mux, myPaths.BackgroundPath)
	configureVersionEndpoint(mux, repo)
	configureDefaultEndpoint(mux)
}
