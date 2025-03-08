package config

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func generateEmoteMap(path string, start string, end string) map[string]string {
	emoteMap := make(map[string]string)

	emoteFiles, err := os.ReadDir(path)
	if err != nil {
		fmt.Printf("Error reading directory %s for emotes: %s", path, err)
		return emoteMap
	}

	for _, file := range emoteFiles {
		if !file.IsDir() {
			emoteName := strings.TrimSuffix(file.Name(), filepath.Ext(file.Name()))
			emoteKey := fmt.Sprintf("%s%s%s", start, strings.ToLower(emoteName), end)
			emoteMap[emoteKey] = filepath.Join(path, file.Name())
		}
	}

	return emoteMap
}
