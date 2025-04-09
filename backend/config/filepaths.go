package config

import (
	"log"
	"os"
	"path/filepath"
)

func setupFilePaths(folder Folder) MyPaths {
	env := os.Getenv("ENV")

	mainBase := "Images/Emotes/"
	resizeBase := "AppData/ResizedImages/"

	channelEmote := mainBase + folder.ChannelEmote
	resizedChannelEmote := resizeBase + folder.ResizedChannelEmote
	globalEmote := mainBase + folder.GlobalEmote
	resizedGlobalEmote := resizeBase + folder.ResizedGlobalEmote
	previewEmote := mainBase + folder.PreviewEmote
	resizedPreviewEmote := resizeBase + folder.ResizedPreviewEmote
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
	resizedChannelEmotePath := filepath.Join(dir, resizedChannelEmote)
	globalEmotePath := filepath.Join(dir, globalEmote)
	resizedGlobalEmotePath := filepath.Join(dir, resizedGlobalEmote)
	previewEmotePath := filepath.Join(dir, previewEmote)
	resizedPreviewEmotePath := filepath.Join(dir, resizedPreviewEmote)
	iconPath := filepath.Join(dir, icon)
	backgroundPath := filepath.Join(dir, background)

	return MyPaths{ChannelEmotePath: channelEmotePath,
		ResizedChannelEmotePath: resizedChannelEmotePath,
		GlobalEmotePath:         globalEmotePath,
		ResizedGlobalEmotePath:  resizedGlobalEmotePath,
		PreviewEmotePath:        previewEmotePath,
		ResizedPreviewEmotePath: resizedPreviewEmotePath,
		IconPath:                iconPath,
		BackgroundPath:          backgroundPath}
}
