package config

import (
	"log"
	"os"
	"path/filepath"
)

func SetupFilePaths() MyPaths {
	env := os.Getenv("ENV")

	var channelEmote = "images/emotes/channelEmotes"
	var previewEmote = "images/emotes/randomEmotes"
	var icon = "images/icons"
	var yaml = "config"
	var background = "public/background"

	var channelEmotePath string
	var previewEmotePath string
	var iconPath string
	var yamlPath string
	var backgroundPath string

	if env == "development" {
		log.Println("In development")

		cwd, err := os.Getwd()
		if err != nil {
			log.Fatalf("Error getting current working directory: %v", err)
		}

		channelEmotePath = filepath.Join(cwd, channelEmote)
		previewEmotePath = filepath.Join(cwd, previewEmote)
		iconPath = filepath.Join(cwd, icon)
		yamlPath = filepath.Join(cwd, yaml)
		backgroundPath = filepath.Join(cwd, background)

	} else {
		log.Println("In production")
		exePath, err := os.Executable()
		if err != nil {
			log.Fatalf("Failed to get executable path: %v", err)
		}
		exeDir := filepath.Dir(exePath)

		channelEmotePath = filepath.Join(exeDir, channelEmote)
		previewEmotePath = filepath.Join(exeDir, previewEmote)
		iconPath = filepath.Join(exeDir, icon)
		yamlPath = filepath.Join(exeDir, yaml)
		backgroundPath = filepath.Join(exeDir, background)
	}

	// log.Printf("EMOTEPATH: %s", EmotePath)
	// log.Printf("YAMLPATH: %s", YamlPath)
	// log.Printf("BACKGROUNDPATH: %s", BackgroundPath)
	return MyPaths{ChannelEmotePath: channelEmotePath,
		PreviewEmotePath: previewEmotePath,
		IconPath:         iconPath,
		YamlPath:         yamlPath,
		BackgroundPath:   backgroundPath}
}
