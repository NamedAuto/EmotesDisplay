package websocketserver

import (
	"fmt"
	"math/rand/v2"
	"regexp"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"github.com/labstack/gommon/log"
)

func generateRandomUrls(port int,
	emoteMap config.EmotesMap,
	endpoints config.Endpoint,
	random database.Preview) []string {
	count := rand.IntN(random.MaxRandomEmotes) + 1
	var urls []string

	if !(*random.UseChannelEmotes || *random.UseGlobalEmotes || *random.UseRandomEmotes) {
		log.Printf("No folder in use for emotes")
		return urls
	}

	for range count {
		keysToUse, endpoint := decideMapAndEndpoint(emoteMap, endpoints, random)
		emote := keysToUse[rand.IntN((len(keysToUse)))]
		url := generateEmotesUrl(port, endpoint)
		message := parseEmoteToURL(emote, url)
		urls = append(urls, message)
		log.Printf("Message: %s", message)
		log.Printf("Url: %s", url)

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
	channelCount := 0
	globalCount := 0
	randmonCount := 0

	if *random.UseChannelEmotes {
		channelCount = len(emoteMap.ChannelMap)
		count += channelCount
	}

	if *random.UseGlobalEmotes {
		globalCount = len(emoteMap.GlobalMap)
		count += globalCount
	}

	if *random.UseRandomEmotes {
		randmonCount = len(emoteMap.RandomMap)
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
	} else if *random.UseGlobalEmotes && randomNum < channelCount+globalCount {
		randomKey = emoteMap.GlobalKeys
		endpoint = endpoints.GlobalEmote
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
