package websocketserver

import (
	"fmt"
	"regexp"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"golang.org/x/exp/rand"
)

func generateRandomUrls(port int, emoteMap config.EmotesMap, endpoints config.Endpoint) []string {
	count := rand.Intn(5) + 1
	var urls []string
	for range count {
		emote := getRandomEmoteKey(emoteMap)
		url := generateEmotesUrl(port, endpoints.ChannelEmote)
		message := parseEmoteToURL(emote, url)
		urls = append(urls, message)
	}

	return urls
}

func generateEmotesUrl(port int, endpoint string) string {
	return fmt.Sprintf("http://localhost:%d%s", port, endpoint)
}

func getRandomEmoteKey(emoteMap config.EmotesMap) string {
	keys := make([]string, 0, len(emoteMap.ChannelMap))
	for key := range emoteMap.ChannelMap {
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
