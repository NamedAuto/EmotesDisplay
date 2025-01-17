package service

import (
	"github.com/NamedAuto/EmotesDisplay/backend/config"
)

type DefaultService struct {
	Config   *config.AppConfig
	EmoteMap map[string]string
}
