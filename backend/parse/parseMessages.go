package parse

import (
	"fmt"
	"regexp"
	"strings"
)

// func parse(message string){
// 	regex := regexp.MustCompile(`:_.*?:`)
// 	matches := regex.FindAllString(message, -1)

// 	fpr _, temp := range matcmatches{
// 		cleanedText := strings.ReplaceAll(emoteText, ":", "")
// 		cleanedText = strings.ReplaceAll(cleanedText, "_", "")
// 	}
// }

func ParseMessageForEmotes(message string, emoteUrl string, emoteMap map[string]string) []string {
	emoteUrls := []string{}
	regex := regexp.MustCompile(`:_.*?:`)
	matches := regex.FindAllString(message, -1)

	for _, emoteText := range matches {
		if _, exists := emoteMap[emoteText]; exists {
			cleanedText := strings.ReplaceAll(emoteText, ":", "")
			cleanedText = strings.ReplaceAll(cleanedText, "_", "")
			newEmoteUrl := emoteUrl + cleanedText

			emoteUrls = append(emoteUrls, newEmoteUrl)

		} else {
			fmt.Printf("Emote Not Found: %s\n", emoteText)
		}
	}

	return emoteUrls
}
