package service

import "context"

type YoutubeService struct {
	Ctx            *context.Context
	PreviewService *PreviewService
}
