package websocketserver

import (
	"fmt"
	"math/rand/v2"
	"regexp"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/database"
)

func generateRandomUrls(port int,
	emoteMap config.EmotesMap,
	endpoints config.Endpoint,
	random database.Preview) []string {
	count := rand.IntN(random.MaxRandomEmotes) + 1
	var urls []string

	keysToUse, endpoint := decideMapAndEndpoint(emoteMap, endpoints, random)

	if keysToUse == nil {
		return urls
	}

	for range count {
		emote := keysToUse[rand.IntN((len(keysToUse)))]
		url := generateEmotesUrl(port, endpoint)
		message := parseEmoteToURL(emote, url)
		urls = append(urls, message)
	}

	return urls
}

func generateEmotesUrl(port int, endpoint string) string {
	return fmt.Sprintf("http://localhost:%d%s", port, endpoint)
}

func decideMapAndEndpoint(
	emoteMap config.EmotesMap,
	endpoints config.Endpoint,
	random database.Preview) ([]string, string) {
	count := 0
	channelCount := len(emoteMap.ChannelMap)
	randmonCount := len(emoteMap.RandomMap)

	if *random.UseChannelEmotes {
		count += channelCount
	}
	if *random.UseRandomEmotes {
		count += randmonCount
	}

	if count == 0 {
		return nil, ""
	}

	randomNum := rand.IntN(count)

	var randomKey []string
	var endpoint string
	if *random.UseChannelEmotes && randomNum < channelCount {
		randomKey = emoteMap.ChannelKeys
		endpoint = endpoints.ChannelEmote
	} else {
		randomKey = emoteMap.RandomKeys
		endpoint = endpoints.PreviewEmote
	}

	return randomKey, endpoint
}

func parseEmoteToURL(emote string, url string) string {
	re := regexp.MustCompile(`[:_]`)
	cleanedText := re.ReplaceAllString(emote, "")
	emoteURL := url + cleanedText

	return emoteURL
}
