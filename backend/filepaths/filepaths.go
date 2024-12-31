package filepaths

import (
	"log"
	"os"
	"path/filepath"
)

var (
	EmotePath      string
	YamlPath       string
	BackgroundPath string
	FrontendPath   string
)

func SetupFilePaths() {
	env := os.Getenv("ENV")

	log.Println("ENV: " + env)

	// if env == "development" {
	log.Println("In development")

	cwd, err := os.Getwd()
	if err != nil {
		log.Fatalf("Error getting current working directory: %v", err)
	}

	EmotePath = filepath.Join(cwd, "public", "emotes")
	YamlPath = filepath.Join(cwd, "config")
	BackgroundPath = filepath.Join(cwd, "public", "background")
	FrontendPath = filepath.Join(cwd, "frontend", "dist")

	// // } else {
	// log.Println("In production")
	// exePath, err := os.Executable()
	// if err != nil {
	// 	log.Fatalf("Failed to get executable path: %v", err)
	// }
	// exeDir := filepath.Dir(exePath)

	// EmotePath = filepath.Join(exeDir, "public", "emotes")
	// YamlPath = filepath.Join(exeDir, "config")
	// BackgroundPath = filepath.Join(exeDir, "public", "background")
	// FrontendPath = filepath.Join(exeDir, "..", "..", "frontend", "dist")

	log.Printf("EMOTEPATH: %s", EmotePath)
	log.Printf("YAMLPATH: %s", YamlPath)
	log.Printf("BACKGROUNDPATH: %s", BackgroundPath)
	log.Printf("FRONTENDPATH: %s", FrontendPath)

	// }
}
