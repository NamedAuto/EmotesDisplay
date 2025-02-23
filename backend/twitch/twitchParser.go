package twitch

import (
	"github.com/gempir/go-twitch-irc/v4"
)

var base = "https://static-cdn.jtvnw.net/emoticons/v2/"
var end = "/default/light/3.0"

func GetEmoteURLs(emotes []*twitch.Emote) []string {
	var emoteUrls []string

	for _, emote := range emotes {
		var url = base + emote.ID + end
		emoteUrls = append(emoteUrls, url)
	}

	return emoteUrls
}
