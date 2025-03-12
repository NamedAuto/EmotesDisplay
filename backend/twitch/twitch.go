package twitch

import (
	"fmt"
	"log"

	"github.com/NamedAuto/EmotesDisplay/backend/common"
	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"github.com/NamedAuto/EmotesDisplay/backend/parse"
	"github.com/gempir/go-twitch-irc/v4"
	"gorm.io/gorm"
)

var ircClient *twitch.Client

func ConnectToIRC(handler common.HandlerInterface, db *gorm.DB) {
	ircClient = twitch.NewAnonymousClient()

	ircClient.OnPrivateMessage(func(message twitch.PrivateMessage) {
		fmt.Println(message)
		// fmt.Println(message.Emotes)
		// fmt.Println(message.Message)

		// result := parse.FindEmojis(message.Message, emoji.EmojiMap)
		// log.Println(result)
		// fmt.Println(result)

		if len(message.Emotes) != 0 {
			log.Println(message)
			// log.Println(message.Emotes[0])
			handler.EmitTwitchEmotes(parse.ParseTwitchMessage(message.Emotes))
		}
	})

	var twitch database.Twitch
	db.First(&twitch)

	ircClient.Join(*twitch.ChannelName)

	go func() {
		/*
			Assume the connectioin is a success since Connect() is blocking
			and does not return unless an error or Disconnect() is called
		*/
		handler.EmitTwitchConnection(true)
		err := ircClient.Connect()
		if err != nil {
			handler.EmitTwitchConnection(false)
		}
	}()
}

func DisconnectFromIRC(handler common.HandlerInterface) {
	handler.EmitTwitchConnection(false)
	ircClient.Disconnect()
}
