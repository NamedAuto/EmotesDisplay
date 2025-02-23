package httpserver

import (
	"embed"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"github.com/NamedAuto/EmotesDisplay/backend/github"
	"gorm.io/gorm"
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

func configureConfigEndpoint(mux *http.ServeMux, db *gorm.DB) {
	mux.HandleFunc("/config", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			w.Header().Set("Content-Type", "application/json")

			json.NewEncoder(w).Encode(database.ToAppConfigDTO(*database.GetAppConfig()))

		} else if r.Method == http.MethodPost {
			var incomingConfigDTO database.AppConfigDTO

			err := json.NewDecoder(r.Body).Decode(&incomingConfigDTO)
			if err != nil {
				http.Error(w, fmt.Sprintf("Error decoding JSON: %v", err),
					http.StatusBadRequest)
				return
			}

			existingConfig := database.GetAppConfig()

			// Update only the changed fields
			if incomingConfigDTO.Youtube != database.ToYoutubeDTO(existingConfig.Youtube) {
				db.Model(&existingConfig.Youtube).Updates(database.ToYoutubeModel(incomingConfigDTO.Youtube))
			}
			if incomingConfigDTO.Port != database.ToPortDTO(existingConfig.Port) {
				db.Model(&existingConfig.Port).Updates(database.ToPortModel(incomingConfigDTO.Port))
			}
			if incomingConfigDTO.Version != database.ToVersionDTO(existingConfig.Version) {
				db.Model(&existingConfig.Version).Updates(database.ToVersionModel(incomingConfigDTO.Version))
			}
			if incomingConfigDTO.AspectRatio != database.ToAspectRatioDTO(existingConfig.AspectRatio) {
				db.Model(&existingConfig.AspectRatio).Updates(database.ToAspectRatioModel(incomingConfigDTO.AspectRatio))
			}
			if incomingConfigDTO.Emote != database.ToEmoteDTO(existingConfig.Emote) {
				db.Model(&existingConfig.Emote).Updates(database.ToEmoteModel(incomingConfigDTO.Emote))
			}
			if incomingConfigDTO.Animations != database.ToAnimationsDTO(existingConfig.Animations) {
				db.Model(&existingConfig.Animations).Updates(database.ToAnimationsModel(incomingConfigDTO.Animations))
			}
			if incomingConfigDTO.Preview != database.ToPreviewDTO(existingConfig.Preview) {
				db.Model(&existingConfig.Preview).Updates(database.ToPreviewModel(incomingConfigDTO.Preview))
			}

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

func ConfigureEndpoints(mux *http.ServeMux, db *gorm.DB, myPaths config.MyPaths, repo config.Repo) {

	configureEmotesEndpoint(mux, myPaths.EmotePath)
	configureConfigEndpoint(mux, db)
	configureBackgroundImageEndpoint(mux, myPaths.BackgroundPath)
	configureVersionEndpoint(mux, repo)
	configureDefaultEndpoint(mux)
}
