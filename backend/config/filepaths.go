package config

import (
	"log"
	"os"
	"path/filepath"
)

func setupFilePaths(folder Folder) MyPaths {
	env := os.Getenv("ENV")

	channelEmote := "Images/Emotes/" + folder.ChannelEmote
	globalEmote := "Images/Emotes/" + folder.GlobalEmote
	previewEmote := "Images/Emotes/" + folder.PreviewEmote
	icon := "Images/" + folder.Icon
	background := "Images/" + folder.Background

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

	channelEmotePath := filepath.Join(dir, channelEmote)
	globalEmotePath := filepath.Join(dir, globalEmote)
	previewEmotePath := filepath.Join(dir, previewEmote)
	iconPath := filepath.Join(dir, icon)
	backgroundPath := filepath.Join(dir, background)

	return MyPaths{ChannelEmotePath: channelEmotePath,
		GlobalEmotePath:  globalEmotePath,
		PreviewEmotePath: previewEmotePath,
		IconPath:         iconPath,
		BackgroundPath:   backgroundPath}
}
