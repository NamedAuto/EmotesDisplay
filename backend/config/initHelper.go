package config

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
)

func generateEmoteMap(path string, prefix string, suffix string) map[string]string {
	emoteMap := make(map[string]string)

	emoteFiles, err := os.ReadDir(path)
	if err != nil {
		log.Printf("Error reading directory %s for emotes: %s", path, err)
		return emoteMap
	}

	for _, file := range emoteFiles {
		if !file.IsDir() {
			emoteName := strings.TrimSuffix(file.Name(), filepath.Ext(file.Name()))
			emoteKey := fmt.Sprintf("%s%s%s", prefix, strings.ToLower(emoteName), suffix)
			emoteMap[emoteKey] = filepath.Join(path, file.Name())
		}
	}

	return emoteMap
}

func generateKeyArray(myMap map[string]string) []string {
	keys := make([]string, 0, len(myMap))
	for key := range myMap {
		keys = append(keys, key)
	}

	return keys
}
