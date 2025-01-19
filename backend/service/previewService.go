package service

import (
	"github.com/NamedAuto/EmotesDisplay/backend/config"
)

type PreviewService struct {
	Config   *config.AppConfig
	EmoteMap map[string]string
}
