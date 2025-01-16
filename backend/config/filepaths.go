package config

import (
	"log"
	"os"
	"path/filepath"
)

func SetupFilePaths() MyPaths {
	env := os.Getenv("ENV")

	var emotePath string
	var yamlPath string
	var backgroundPath string

	if env == "development" {
		log.Println("In development")

		cwd, err := os.Getwd()
		if err != nil {
			log.Fatalf("Error getting current working directory: %v", err)
		}

		emotePath = filepath.Join(cwd, "public", "emotes")
		yamlPath = filepath.Join(cwd, "config")
		backgroundPath = filepath.Join(cwd, "public", "background")

	} else {
		log.Println("In production")
		exePath, err := os.Executable()
		if err != nil {
			log.Fatalf("Failed to get executable path: %v", err)
		}
		exeDir := filepath.Dir(exePath)

		emotePath = filepath.Join(exeDir, "public", "emotes")
		yamlPath = filepath.Join(exeDir, "config")
		backgroundPath = filepath.Join(exeDir, "public", "background")
	}

	// log.Printf("EMOTEPATH: %s", EmotePath)
	// log.Printf("YAMLPATH: %s", YamlPath)
	// log.Printf("BACKGROUNDPATH: %s", BackgroundPath)
	return MyPaths{EmotePath: emotePath, YamlPath: yamlPath, BackgroundPath: backgroundPath}
}
