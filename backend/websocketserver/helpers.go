package websocketserver

import (
	"fmt"
	"regexp"
	"time"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"golang.org/x/exp/rand"
)

func generateRandomUrls(port int,
	emoteMap config.EmotesMap,
	endpoints config.Endpoint,
	random database.Preview) []string {
	count := rand.Intn(random.MaxRandomEmotes) + 1
	var urls []string

	keysToUse, endpoint := decideMapAndEndpoint(emoteMap, endpoints, random)

	if keysToUse == nil {
		return urls
	}

	for range count {
		emote := keysToUse[rand.Intn((len(keysToUse)))]
		url := generateEmotesUrl(port, endpoint)
		message := parseEmoteToURL(emote, url)
		urls = append(urls, message)
	}

	return urls
}

func generateEmotesUrl(port int, endpoint string) string {
	return fmt.Sprintf("http://localhost:%d%s", port, endpoint)
}

func getMapAndEndpoint() {

}

// func getRandomEmote(emoteMap config.EmotesMap, random database.Preview, endpoints config.Endpoint) string {
// 	keysToUse, endpoint := decideMapAndEndpoint(emoteMap, endpoints, random)
// 	if keysToUse == nil {
// 		return "",
// 	}

// 	keys := make([]string, 0, len(keysToUse))
// 	for key := range keysToUse {
// 		keys = append(keys, key)
// 	}

// 	randomKey := keys[rand.Intn(len(keys))]
// 	return randomKey
// }

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

	rand.Seed(uint64(time.Now().UnixNano()))
	randomNum := rand.Intn(count)

	var randomKey []string
	var endpoint string
	if *random.UseChannelEmotes && randomNum < channelCount {
		// mapToUse = emoteMap.ChannelMap
		randomKey = emoteMap.ChannelKeys
		endpoint = endpoints.ChannelEmote
	} else {
		// mapToUse = emoteMap.RandomMap
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
