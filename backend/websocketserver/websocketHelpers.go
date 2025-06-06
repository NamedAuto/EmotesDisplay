package websocketserver

import (
	"fmt"
	"log"
	"math/rand/v2"
	"regexp"

	"github.com/NamedAuto/EmotesDisplay/backend/common"
	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/database"
)

func generateRandomUrls(port int,
	emoteMap *config.EmotesMap,
	endpoints *config.Endpoint,
	random database.Preview) []common.EmoteInfo {
	count := rand.IntN(random.MaxRandomEmotes) + 1
	var emoteInfo []common.EmoteInfo

	if !*random.UseChannelEmotes && !*random.UseGlobalEmotes && !*random.UseRandomEmotes {
		log.Printf("No folder in use for emotes")
		return emoteInfo
	}

	for range count {
		mapToUse, keysToUse, endpoint := decideMapAndEndpoint(emoteMap, endpoints, random)
		if len(keysToUse) > 0 {
			emote := keysToUse[rand.IntN((len(keysToUse)))]
			baseUrl := generateEmotesUrl(port, endpoint)
			message := parseEmoteToURL(emote, baseUrl)
			temp := common.EmoteInfo{
				Url:   message,
				Ratio: mapToUse[emote].Ratio,
			}
			emoteInfo = append(emoteInfo, temp)
		}
	}

	return emoteInfo
}

func generateEmotesUrl(port int, endpoint string) string {
	return fmt.Sprintf("http://localhost:%d%s", port, endpoint)
}

func decideMapAndEndpoint(
	emoteMap *config.EmotesMap,
	endpoints *config.Endpoint,
	random database.Preview) (map[string]config.EmotePathInfo, []string, string) {
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
		return nil, nil, ""
	}

	randomNum := rand.IntN(count) + 1

	var eMap map[string]config.EmotePathInfo
	var randomKey []string
	var endpoint string
	if *random.UseChannelEmotes && randomNum < channelCount {
		eMap = emoteMap.ChannelMap
		randomKey = emoteMap.ChannelKeys
		endpoint = endpoints.ChannelEmote
	} else if *random.UseGlobalEmotes && randomNum < channelCount+globalCount {
		eMap = emoteMap.GlobalMap
		randomKey = emoteMap.GlobalKeys
		endpoint = endpoints.GlobalEmote
	} else {
		eMap = emoteMap.RandomMap
		randomKey = emoteMap.RandomKeys
		endpoint = endpoints.PreviewEmote
	}

	return eMap, randomKey, endpoint
}

func parseEmoteToURL(emote string, url string) string {
	re := regexp.MustCompile(`[:_]`)
	cleanedText := re.ReplaceAllString(emote, "")
	emoteURL := url + cleanedText

	return emoteURL
}
