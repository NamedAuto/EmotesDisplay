package service

import (
	"github.com/NamedAuto/EmotesDisplay/backend/database"
)

type PreviewService struct {
	Config   *database.AppConfig
	EmoteMap map[string]string
}
