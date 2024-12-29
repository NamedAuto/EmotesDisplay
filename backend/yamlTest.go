package main

import (
	"fmt"
	"log"
	"myproject/backend/config"
)

func yaml() {
	config, err := config.LoadConfig("config/config.yaml")
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	fmt.Printf("Loaded Config: %+v\n", config)
}
