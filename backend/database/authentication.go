package database

import (
	"log"

	"github.com/NamedAuto/EmotesDisplay/backend/common"
	"gorm.io/gorm"
)

func SaveAuthentication(handler common.HandlerInterface, db *gorm.DB, data map[string]interface{}) {
	youtubeApiKey := data["youtubeApiKey"].(string)
	twitch := data["twitch"].(string)

	log.Printf("Yt: %s, T: %s", youtubeApiKey, twitch)

	var t Authentication
	db.First(&t)

	auth := common.AuthenticationSuccess{YoutubeUpdated: false, TwitchUpdated: false}

	if youtubeApiKey != "" {
		log.Println("Youtube")
		t.YoutubeApiKey = youtubeApiKey
		auth.YoutubeUpdated = true
	}

	if twitch != "" {
		log.Println("Twitch")
		t.Twitch = twitch
		auth.TwitchUpdated = true
	}

	db.Model(&t).Updates(t)
	handler.EmitAuthenticationSuccess(auth)

}
