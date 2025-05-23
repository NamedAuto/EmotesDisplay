package httpserver

import (
	"embed"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"slices"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"github.com/NamedAuto/EmotesDisplay/backend/github"
	"github.com/NamedAuto/EmotesDisplay/backend/myyoutube"
	"gorm.io/gorm"
)

type HasApiKeyResponse struct {
	Exists bool `json:"exists"`
}

type ApiTimeLeft struct {
	TimeLeft int `json:"timeLeft"`
}

type RepoResponse struct {
	Owner          string `json:"owner"`
	RepoName       string `json:"repoName"`
	CurrentVersion string `json:"currentVersion"`
	LatestVersion  string `json:"latestVersion"`
}

type EmoteInfo struct {
	// FilePath string  `json:"filePath"`
	Ratio float32 `json:"ratio"`
}

var assets embed.FS

var extensions = []string{".png", ".jpg", ".jpeg", ".webp", ".gif"}

func AssignAssets(embed embed.FS) {
	assets = embed
}

func configureEmoteEndpoint(mux *http.ServeMux,
	path string,
	resizedPath string,
	endpoint string,
	emoteMap map[string]config.EmotePathInfo,
	prefix string,
	suffix string,
	errMsg string,
) {
	mux.HandleFunc(endpoint, func(w http.ResponseWriter, r *http.Request) {
		filename := strings.TrimPrefix(r.URL.Path, endpoint)
		key := prefix + filename + suffix

		if info, exists := emoteMap[key]; exists {
			var filePathToUse string
			if info.IsResized {
				filePathToUse = resizedPath
			} else {
				filePathToUse = path
			}

			for _, ext := range extensions {
				fullPath := filepath.Join(filePathToUse, filename+ext)
				if _, err := os.Stat(fullPath); err == nil {
					http.ServeFile(w, r, fullPath)
					return
				}
			}

		}

		http.Error(w, errMsg, http.StatusNotFound)
	})
}

func configureEmoteMetaDataEndpoint(mux *http.ServeMux,
	endpoint string,
	emoteMap map[string]config.EmotePathInfo,
	prefix string,
	suffix string,
	errMsg string,
) {
	mux.HandleFunc(endpoint, func(w http.ResponseWriter, r *http.Request) {
		filename := strings.TrimPrefix(r.URL.Path, endpoint)
		key := prefix + filename + suffix

		if _, exists := emoteMap[key]; exists {

			log.Println("Key: ", emoteMap[key])
			log.Println("Ratio: ", emoteMap[key].Ratio)

			emoteInfo := EmoteInfo{Ratio: emoteMap[key].Ratio}
			w.Header().Set("Content-Type", "application/json")
			err := json.NewEncoder(w).Encode(emoteInfo)
			if err != nil {
				http.Error(w, "Failed to encode Emote JSON", http.StatusInternalServerError)
			}

			return
		}

		http.Error(w, errMsg, http.StatusNotFound)
	})
}

func configureFolderEndpoint(mux *http.ServeMux,
	path string,
	endpoint string,
	errMsg string,
) {
	mux.HandleFunc(endpoint, func(w http.ResponseWriter, r *http.Request) {
		filename := strings.TrimPrefix(r.URL.Path, endpoint)
		var filePath string

		for _, ext := range extensions {

			// if(emotesMap[filename])

			filePath = filepath.Join(path, filename+ext)
			if _, err := os.Stat(filePath); err == nil {
				http.ServeFile(w, r, filePath)
				return
			}
		}

		http.Error(w, errMsg, http.StatusNotFound)
	})
}

func configureBackgroundImageEndpoint(mux *http.ServeMux, backgroundPath string, endpoint string) {
	mux.HandleFunc(endpoint, func(w http.ResponseWriter, r *http.Request) {
		folderPath := backgroundPath
		files, err := os.ReadDir(folderPath)
		if err != nil {
			http.Error(w, "Error reading the folder", http.StatusInternalServerError)
			return
		}

		var imageFiles []string
		for _, file := range files {
			if !file.IsDir() &&
				slices.Contains(
					extensions,
					strings.ToLower(filepath.Ext(file.Name())),
				) {
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

func configureConfigEndpoint(mux *http.ServeMux, db *gorm.DB, endpoint string) {
	mux.HandleFunc(endpoint, func(w http.ResponseWriter, r *http.Request) {
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

			if incomingConfigDTO.Youtube != database.ToYoutubeDTO(existingConfig.Youtube) {
				db.Model(&existingConfig.Youtube).
					Updates(database.ToYoutubeModel(incomingConfigDTO.Youtube))
			}
			if incomingConfigDTO.Twitch != database.ToTwitchDTO(existingConfig.Twitch) {
				db.Model(&existingConfig.Twitch).
					Updates(database.ToTwitchModel(incomingConfigDTO.Twitch))
			}
			if incomingConfigDTO.Port != database.ToPortDTO(existingConfig.Port) {
				db.Model(&existingConfig.Port).
					Updates(database.ToPortModel(incomingConfigDTO.Port))
			}
			if incomingConfigDTO.AppInfo != database.ToAppInfoDTO(existingConfig.AppInfo) {
				db.Model(&existingConfig.AppInfo).
					Updates(database.ToAppInfoModel(incomingConfigDTO.AppInfo))
			}
			if incomingConfigDTO.AspectRatio != database.ToAspectRatioDTO(existingConfig.AspectRatio) {
				db.Model(&existingConfig.AspectRatio).
					Updates(database.ToAspectRatioModel(incomingConfigDTO.AspectRatio))
			}
			if incomingConfigDTO.Emote != database.ToEmoteDTO(existingConfig.Emote) {
				db.Model(&existingConfig.Emote).
					Updates(database.ToEmoteModel(incomingConfigDTO.Emote))
			}
			if incomingConfigDTO.Animations != database.ToAnimationsDTO(existingConfig.Animations) {
				db.Model(&existingConfig.Animations).
					Updates(database.ToAnimationsModel(incomingConfigDTO.Animations))
			}
			if incomingConfigDTO.Preview != database.ToPreviewDTO(existingConfig.Preview) {
				db.Model(&existingConfig.Preview).
					Updates(database.ToPreviewModel(incomingConfigDTO.Preview))
			}

			w.WriteHeader(http.StatusOK)
			w.Write([]byte("Config saved successfully"))
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})
}

const timeInMillisToWaitBeforeChecking = 3600000

func configureAppInfoEndpoint(mux *http.ServeMux, db *gorm.DB, endpoint string) {
	mux.HandleFunc(endpoint, func(w http.ResponseWriter, r *http.Request) {
		var appInfo database.AppInfo
		db.First(&appInfo)

		var response RepoResponse

		now := time.Now()
		millis := now.UnixNano() / int64(time.Millisecond)

		response = RepoResponse{
			Owner:          appInfo.Owner,
			RepoName:       appInfo.RepoName,
			CurrentVersion: appInfo.Version,
			LatestVersion:  appInfo.Version,
		}

		if (millis - appInfo.LastChecked) > timeInMillisToWaitBeforeChecking {
			latestVersion, err :=
				github.GetLatestReleaseVersion(appInfo.Owner, appInfo.RepoName)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			db.Model(&appInfo).Update("LastChecked", millis)
			response.LatestVersion = latestVersion
		}

		jsonResponse, err := json.Marshal(response)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonResponse)
	})
}

func configureCheckForYoutubeApiKey(mux *http.ServeMux, db *gorm.DB, endpoint string) {
	mux.HandleFunc(endpoint, func(w http.ResponseWriter, r *http.Request) {
		var apiKey database.ApiKey
		exists := true
		if err := db.First(&apiKey).Error; err != nil || *apiKey.ApiKey == "" {
			exists = false
		}

		response := HasApiKeyResponse{Exists: exists}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	})
}

func configureYoutubeApiKey(mux *http.ServeMux, db *gorm.DB, endpoint string) {
	mux.HandleFunc(endpoint, func(w http.ResponseWriter, r *http.Request) {
		var apiKey database.ApiKey
		if err := db.First(&apiKey).Error; err != nil {
			http.Error(w, "API key not found", http.StatusNotFound)
			return
		}

		if r.Method == http.MethodGet {
			jsonResponse, err := json.Marshal(database.ToApiKeyDTO(apiKey))
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			w.Write(jsonResponse)
		} else if r.Method == http.MethodPost {

			var aK database.ApiKeyDTO
			if err := json.NewDecoder(r.Body).Decode(&aK); err != nil {
				http.Error(w, "Invalid request body", http.StatusBadRequest)
				return
			}

			err := myyoutube.HandleSavingNewKey(db, apiKey, &aK.ApiKey)

			if err != nil {
				http.Error(w, "Failed to save API key", http.StatusInternalServerError)
				return
			}

			w.WriteHeader(http.StatusOK)
			fmt.Fprintln(w, "API key saved successfully")
		}
	})
}

func configureYoutubeApiTimeLeft(mux *http.ServeMux, db *gorm.DB, endpoint string) {
	mux.HandleFunc(endpoint, func(w http.ResponseWriter, r *http.Request) {
		var api database.ApiKey
		timeLeft := 0
		if err := db.First(&api).Error; err != nil || *api.ApiKey == "" {
			timeLeft = 0
		}

		timeLeft = myyoutube.CalculateTimeLeftForApi(db, api.ID)

		response := ApiTimeLeft{TimeLeft: timeLeft}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	})
}

func configureDefaultEndpoint(mux *http.ServeMux, endpoint string) {
	mux.HandleFunc(endpoint, func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == endpoint || r.URL.Path == "/index.html" {
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

func ConfigureEndpoints(mux *http.ServeMux,
	db *gorm.DB,
	myPaths config.MyPaths,
	endpoints config.Endpoint,
	emotesChannel chan config.EmotesMap,
) {

	go func() {
		emotesMap := <-emotesChannel
		fmt.Println(emotesMap)

		// Youtube Channel Emotes
		configureEmoteEndpoint(
			mux,
			myPaths.ChannelEmotePath,
			myPaths.ResizedChannelEmotePath,
			endpoints.ChannelEmote,
			emotesMap.ChannelMap,
			":_",
			":",
			"Channel Emote not found",
		)

		configureEmoteMetaDataEndpoint(
			mux,
			endpoints.ChannelEmoteMd,
			emotesMap.ChannelMap,
			":_",
			":",
			"Channel Emote metadata not found",
		)

		// Youtube Global Emotes
		configureEmoteEndpoint(
			mux,
			myPaths.GlobalEmotePath,
			myPaths.ResizedGlobalEmotePath,
			endpoints.GlobalEmote,
			emotesMap.GlobalMap,
			":",
			":",
			"Global Emote not found",
		)

		configureEmoteMetaDataEndpoint(
			mux,
			endpoints.GlobalEmoteMd,
			emotesMap.GlobalMap,
			":",
			":",
			"Global Emote metadata not found",
		)

		// Random Emotes
		configureEmoteEndpoint(
			mux,
			myPaths.PreviewEmotePath,
			myPaths.ResizedPreviewEmotePath,
			endpoints.PreviewEmote,
			emotesMap.RandomMap,
			"",
			"",
			"Random Emote not found",
		)

		configureEmoteMetaDataEndpoint(
			mux,
			endpoints.PreviewEmoteMd,
			emotesMap.RandomMap,
			"",
			"",
			"Random Emote metadata not found",
		)
	}()

	configureFolderEndpoint(
		mux,
		myPaths.IconPath,
		endpoints.Icon,
		"Icon not found",
	)

	configureConfigEndpoint(mux, db, endpoints.Config)
	configureBackgroundImageEndpoint(mux, myPaths.BackgroundPath, endpoints.Background)
	configureAppInfoEndpoint(mux, db, endpoints.AppInfo)
	configureCheckForYoutubeApiKey(mux, db, endpoints.CheckYTAPiKey)
	configureYoutubeApiKey(mux, db, endpoints.YTAPiKey)
	configureYoutubeApiTimeLeft(mux, db, endpoints.ApiTimeLeft)
	configureDefaultEndpoint(mux, endpoints.Default)
}
