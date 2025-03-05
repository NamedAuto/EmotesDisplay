package websocketserver

import (
	"fmt"
	"regexp"

	"golang.org/x/exp/rand"
)

func generateRandomUrls(port int, emoteMap map[string]string) []string {
	count := rand.Intn(5) + 1
	var urls []string
	for range count {
		emote := getRandomEmoteKey(emoteMap)
		url := generateEmotesUrl(port)
		message := parseEmoteToURL(emote, url)
		urls = append(urls, message)
	}

	return urls
}

func generateEmotesUrl(port int) string {
	return fmt.Sprintf("http://localhost:%d/channel-emotes/", port)
}

func getRandomEmoteKey(emoteMap map[string]string) string {
	keys := make([]string, 0, len(emoteMap))
	for key := range emoteMap {
		keys = append(keys, key)
	}

	randomKey := keys[rand.Intn(len(keys))]
	return randomKey
}

func parseEmoteToURL(emote string, url string) string {
	re := regexp.MustCompile(`[:_]`)
	cleanedText := re.ReplaceAllString(emote, "")
	emoteURL := url + cleanedText

	return emoteURL
}
