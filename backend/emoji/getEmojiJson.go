package emoji

import (
	"io"
	"log"
	"net/http"
	"os"
)

func GetEmojiJson() {
	// This is where I got the emoji data from. Needs and access key to use
	url := "https://emoji-api.com/emojis?access_key="

	response, err := http.Get(url)
	if err != nil {
		log.Fatal(err)
	}
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		log.Fatal(err)
	}

	err = os.WriteFile("myemoji.json", body, 0644)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("JSON file downloaded successfully!")
}
