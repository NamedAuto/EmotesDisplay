package parse

import (
	"log"
	"regexp"
	"strings"
	"unicode"
	"unicode/utf8"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
	emoji "github.com/NamedAuto/goemoji"
	"github.com/gempir/go-twitch-irc/v4"
)

// CDN for Twitch Emotes
var base = "https://static-cdn.jtvnw.net/emoticons/v2/"
var end = "/default/light/3.0"

func ParseYoutubeMessage(
	message string,
	channelUrl string,
	globalUrl string,
	emoteMap config.EmotesMap,
	useGlobalEmotes bool,
) []string {
	emoteUrls := []string{}
	regex := regexp.MustCompile((`:(_.*?|.*?):`))

	separatedMessage := regex.ReplaceAllString(message, " $0 ")
	words := strings.Fields(separatedMessage)

	for _, word := range words {
		if strings.HasPrefix(word, ":") {
			loweredText := strings.ToLower((word))

			// fmt.Printf("Looking at: %s", loweredText)

			if _, exists := emoteMap.ChannelMap[loweredText]; exists {
				cleanedText := strings.ReplaceAll(loweredText, ":", "")
				cleanedText = strings.ReplaceAll(cleanedText, "_", "")
				newEmoteUrl := channelUrl + cleanedText

				emoteUrls = append(emoteUrls, newEmoteUrl)

			} else if _, exists := emoteMap.GlobalMap[loweredText]; exists {
				if useGlobalEmotes {
					cleanedText := strings.ReplaceAll(loweredText, ":", "")
					newEmoteUrl := globalUrl + cleanedText

					emoteUrls = append(emoteUrls, newEmoteUrl)
				} else {
					log.Printf("Ignoring global emote %s", word)
				}
			} else {
				log.Printf("Emote Not Found: %s\n", word)
			}
		}
		// Emojis not being used right now
		// else {
		// 	// log.Printf("Looking for emoji in : %s", word)
		// 	result := FindEmojis(word, emoji.EmojiMap)
		// 	fmt.Println(result)

		// }
	}

	return emoteUrls
}

func ParseTwitchMessage(emotes []*twitch.Emote) []string {
	var emoteUrls []string

	for _, emote := range emotes {
		var url = base + emote.ID + end
		for range emote.Count {
			emoteUrls = append(emoteUrls, url)
		}
	}

	return emoteUrls
}

func FindEmojisLessEfficient(text string, emojiMap map[string]emoji.Emoji) []emoji.Emoji {
	var result []emoji.Emoji
	for len(text) > 0 {
		matched := false
		for emojiKey := range emojiMap {
			if strings.HasPrefix(text, emojiKey) {
				result = append(result, emojiMap[emojiKey])
				text = text[len(emojiKey):]
				matched = true
				break
			}
		}
		if !matched {
			_, size := utf8.DecodeRuneInString(text)
			text = text[size:]
		}
	}

	return result
}

func FindEmojis(text string, emojiMap map[string]emoji.Emoji) []emoji.Emoji {
	var result []emoji.Emoji
	for len(text) > 0 {
		runeValue, size := utf8.DecodeRuneInString(text)
		if unicode.IsLetter(runeValue) || unicode.IsDigit(runeValue) {
			text = text[size:]
			continue
		}

		matched := false
		for emojiKey := range emojiMap {
			if strings.HasPrefix(text, emojiKey) {
				result = append(result, emojiMap[emojiKey])
				text = text[len(emojiKey):]
				matched = true
				break
			}
		}
		if !matched {
			text = text[size:]
		}
	}

	return result
}
