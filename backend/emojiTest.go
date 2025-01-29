package main

import (
	"fmt"

	emoji "github.com/NamedAuto/goemoji"
)

func main() {

	value, exists := emoji.EmojiMap["👨‍👦‍👦"]
	// value, exists := goemoji.EmojiMap["👨‍👦‍👦"]
	if exists {
		fmt.Print("Is found: ")
		fmt.Println(value)
	} else {
		fmt.Println("Not found: ")
	}

	// emoji.ConvertJson2Go()
	// emoji.Download()
}
