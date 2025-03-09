package twitch

import (
	"fmt"

	"github.com/NamedAuto/EmotesDisplay/backend/common"
	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"github.com/NamedAuto/EmotesDisplay/backend/parse"
	emoji "github.com/NamedAuto/goemoji"
	"github.com/gempir/go-twitch-irc/v4"
	"github.com/nicklaw5/helix/v2"
	"gorm.io/gorm"
)

var client *helix.Client
var user helix.User
var ircClient *twitch.Client

func GetUserAccessToken(code string) {
	var err error
	client, err = helix.NewClient(&helix.Options{
		ClientID:     clientId,
		ClientSecret: clientSecret,
		RedirectURI:  redirectURI,
	})

	if err != nil {
		// handle error
	}

	resp, err := client.RequestUserAccessToken(code)
	if err != nil {
		// handle error
	}

	client.SetUserAccessToken(resp.Data.AccessToken)
}

func GetUser() {
	var params *helix.UsersParams
	resp, err := client.GetUsers(params)
	if err != nil {
		// handle error
	}

	user = resp.Data.Users[0]
	fmt.Printf("%s", resp.Data.Users[0].DisplayName)
}

func GetChannelEmotes() {
	client, err := helix.NewClient(&helix.Options{
		ClientID:     clientId,
		ClientSecret: clientSecret,
		RedirectURI:  redirectURI,
	})
	// v7fqa4mxqxg0o8clt3eccrbdnl0j1b
	if err != nil {
		// handle error
	}

	resp2, err2 := client.GetGlobalEmotes()
	if err2 != nil {
		// handle error
	}

	fmt.Printf("%+v\n", resp2)
}

func ConnectToIRC(handler common.HandlerInterface, db *gorm.DB) {
	ircClient = twitch.NewAnonymousClient()

	ircClient.OnPrivateMessage(func(message twitch.PrivateMessage) {
		fmt.Println(message)
		fmt.Println(message.Emotes)
		fmt.Println(message.Message)

		result := parse.FindEmojisLessEfficient(message.Message, emoji.EmojiMap)
		// log.Printf("Emoji: " + result)
		fmt.Println(result)

		if len(message.Emotes) != 0 {
			// log.Println(message)
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

func ConnectToChatIRC(handler common.HandlerInterface) {
	ircClient := twitch.NewAnonymousClient()

	ircClient.OnPrivateMessage(func(message twitch.PrivateMessage) {
		fmt.Println(message.Emotes)
		fmt.Println(message.Message)

		if len(message.Emotes) != 0 {
			handler.EmitTwitchEmotes(parse.ParseTwitchMessage(message.Emotes))
		}
	})

	ircClient.Join(user.DisplayName)

	err := ircClient.Connect()
	if err != nil {
		panic(err)
	}
}
