package config

import (
	"log"
	"os"
	"path/filepath"
)

func SetupFilePaths(folder Folder) MyPaths {
	env := os.Getenv("ENV")

	channelEmote := "Images/Emotes/" + folder.ChannelEmote
	globalEmote := "Images/Emotes/" + folder.GlobalEmote
	previewEmote := "Images/Emotes/" + folder.PreviewEmote
	icon := "Images/" + folder.Icon
	yaml := folder.Yaml
	background := "Images/" + folder.Background

	var channelEmotePath string
	var globalEmotePath string
	var previewEmotePath string
	var iconPath string
	var yamlPath string
	var backgroundPath string

	var dir string
	if env == "development" {
		log.Println("In development")
		var err error
		dir, err = os.Getwd()
		if err != nil {
			log.Fatalf("Error getting current working directory: %v", err)
		}

	} else {
		log.Println("In production")
		exePath, err := os.Executable()
		if err != nil {
			log.Fatalf("Failed to get executable path: %v", err)
		}

		dir = filepath.Dir(exePath)
	}

	channelEmotePath = filepath.Join(dir, channelEmote)
	globalEmotePath = filepath.Join(dir, globalEmote)
	previewEmotePath = filepath.Join(dir, previewEmote)
	iconPath = filepath.Join(dir, icon)
	yamlPath = filepath.Join(dir, yaml)
	backgroundPath = filepath.Join(dir, background)

	// log.Printf("EMOTEPATH: %s", EmotePath)
	// log.Printf("YAMLPATH: %s", YamlPath)
	// log.Printf("BACKGROUNDPATH: %s", BackgroundPath)
	return MyPaths{ChannelEmotePath: channelEmotePath,
		GlobalEmotePath:  globalEmotePath,
		PreviewEmotePath: previewEmotePath,
		IconPath:         iconPath,
		YamlPath:         yamlPath,
		BackgroundPath:   backgroundPath}
}
