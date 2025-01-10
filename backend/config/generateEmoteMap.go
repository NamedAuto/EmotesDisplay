package config

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func GenerateEmoteMap(emotePath string) map[string]string {
	emoteMap := make(map[string]string)

	emoteFiles, err := os.ReadDir(emotePath)
	if err != nil {
		fmt.Println("Error reading directory for emotes:", err)
		return emoteMap
	}

	for _, file := range emoteFiles {
		if !file.IsDir() {
			emoteName := strings.TrimSuffix(file.Name(), filepath.Ext(file.Name()))
			emoteKey := fmt.Sprintf(":_%s:", strings.ToLower(emoteName))
			emoteMap[emoteKey] = filepath.Join(emotePath, file.Name())
		}
	}

	return emoteMap
}
