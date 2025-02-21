package twitch

import (
	"fmt"

	"github.com/gempir/go-twitch-irc/v4"
	"github.com/nicklaw5/helix/v2"
)

var client *helix.Client
var user helix.User

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

func ConnectToChatIRC() {
	ircClient := twitch.NewAnonymousClient()

	ircClient.OnPrivateMessage(func(message twitch.PrivateMessage) {
		// Retrieve chat messages

		// fmt.Println(message)
		// fmt.Println(message.Message)
	})

	ircClient.Join(user.DisplayName)

	err := ircClient.Connect()
	if err != nil {
		panic(err)
	}
}
