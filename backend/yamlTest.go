package main

import (
	"fmt"
	"log"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
)

func yaml() {
	config, err := config.LoadYamlConfig("config/config.yaml")
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	fmt.Printf("Loaded Config: %+v\n", config)
}
