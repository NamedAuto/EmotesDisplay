package database

import (
	"github.com/NamedAuto/EmotesDisplay/backend/common"
	"gorm.io/gorm"
)

func SaveAuthentication(handler common.HandlerInterface, db *gorm.DB, data map[string]any) {
	youtubeApiKey := data["youtubeApiKey"].(string)
	twitch := data["twitch"].(string)

	var dbAuth Authentication
	db.First(&dbAuth)

	auth := common.AuthenticationPresent{YoutubeApiKey: false, TwitchKey: false}

	if youtubeApiKey != "" {
		dbAuth.YoutubeApiKey = youtubeApiKey
		auth.YoutubeApiKey = true
	}

	if twitch != "" {
		dbAuth.Twitch = twitch
		auth.TwitchKey = true
	}

	db.Model(&dbAuth).Updates(dbAuth)
	handler.EmitAuthenticationPresent(auth)
}

func IsAuthenticationPresent(handler common.HandlerInterface, db *gorm.DB) {
	var dbAuth Authentication
	db.First(&dbAuth)

	auth := common.AuthenticationPresent{YoutubeApiKey: false, TwitchKey: false}

	if dbAuth.YoutubeApiKey != "" {
		auth.YoutubeApiKey = true
	}

	if dbAuth.Twitch != "" {
		auth.TwitchKey = true
	}

	handler.EmitAuthenticationPresent(auth)
}

func HasYoutubeApiKey(handler common.HandlerInterface, db *gorm.DB) {

}
