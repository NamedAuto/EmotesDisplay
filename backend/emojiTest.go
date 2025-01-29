package main

import (
	"fmt"

	"github.com/NamedAuto/EmotesDisplay/backend/emoji"
)

func main() {

	value, exists := emoji.EmojiMap["👨‍👦‍👦"]
	if exists {
		fmt.Print("Is found: ")
		fmt.Println(value)
	} else {
		fmt.Println("Not found: ")
	}

	emoji.ConvertJson2Go()
	// emoji.Download()
}
