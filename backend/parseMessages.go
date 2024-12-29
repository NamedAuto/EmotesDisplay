package main

import (
	"fmt"
	"regexp"
	"strings"
)

func ParseMessageForEmotes(message string, emoteUrl string, emoteMap map[string]string) []string {
	emoteUrls := []string{}
	regex := regexp.MustCompile(`:_.*?:`)
	matches := regex.FindAllString(message, -1)

	for _, emoteText := range matches {
		if url, exists := emoteMap[emoteText]; exists {
			cleanedText := strings.ReplaceAll(emoteText, ":", "")
			cleanedText = strings.ReplaceAll(cleanedText, "_", "")
			newEmoteUrl := emoteUrl + cleanedText

			fmt.Printf("Emit %s\n", newEmoteUrl)
			// Note: In Go, you might use a WebSocket library to emit the new emote URL.
			// This placeholder assumes you have a mechanism to handle real-time communication.
			// For example:
			// websocketConn.Emit("new-emote", map[string]string{"url": newEmoteUrl})

			emoteUrls = append(emoteUrls, url)
		}
	}

	return emoteUrls
}
