package config

import (
	"log"
	"os"
	"path/filepath"

	"gopkg.in/yaml.v2"
)

func LoadYamlConfig(configPath string) (*AppConfig, error) {
	file, err := os.Open(filepath.Join(configPath, "config.yaml"))
	if err != nil {
		log.Fatalf("Error opening file: %v", err)
		return nil, err
	}
	defer file.Close()

	var config AppConfig
	decoder := yaml.NewDecoder(file)
	err = decoder.Decode(&config)
	decoder.Decode(&config)

	if err != nil {
		log.Fatalf("Error decoding YAML: %v", err)
		return nil, err
	}

	return &config, err
}
