package parse

import (
	"fmt"
	"log"
	"regexp"
	"strings"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
)

func ParseMessageForEmotes(
	message string,
	channelUrl string,
	globalUrl string,
	emoteMap config.EmotesMap,
) []string {
	emoteUrls := []string{}
	regex := regexp.MustCompile(`:(_.*?|.*?):`)

	matches := regex.FindAllString(message, -1)

	for _, emoteText := range matches {
		loweredText := strings.ToLower((emoteText))

		log.Printf("Looking at: %s", loweredText)

		if _, exists := emoteMap.ChannelMap[loweredText]; exists {
			cleanedText := strings.ReplaceAll(loweredText, ":", "")
			cleanedText = strings.ReplaceAll(cleanedText, "_", "")
			newEmoteUrl := channelUrl + cleanedText

			emoteUrls = append(emoteUrls, newEmoteUrl)

		} else if _, exists := emoteMap.GlobalMap[loweredText]; exists {
			log.Printf("I AM LOOKING AT GLOBAL")
			cleanedText := strings.ReplaceAll(loweredText, ":", "")
			newEmoteUrl := globalUrl + cleanedText

			emoteUrls = append(emoteUrls, newEmoteUrl)
		} else {
			fmt.Printf("Emote Not Found: %s\n", emoteText)
		}

	}

	return emoteUrls
}
