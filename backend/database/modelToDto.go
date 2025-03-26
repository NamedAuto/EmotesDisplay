package database

func ToYoutubeDTO(y Youtube) YoutubeDTO {
	return YoutubeDTO{
		VideoId:          *y.VideoId,
		MessageDelay:     y.MessageDelay,
		ShowGlobalEmotes: *y.ShowGlobalEmotes,
	}
}

func ToTwitchDTO(t Twitch) TwitchDTO {
	return TwitchDTO{
		ChannelName: *t.ChannelName,
	}
}

func ToPortDTO(p Port) PortDTO {
	return PortDTO{
		Port: p.Port,
	}
}

func ToAppInfoDTO(v AppInfo) AppInfoDTO {
	return AppInfoDTO{
		Version:     v.Version,
		Owner:       v.Owner,
		RepoName:    v.RepoName,
		LastChecked: int(v.LastChecked),
	}
}

func ToAspectRatioDTO(a AspectRatio) AspectRatioDTO {
	return AspectRatioDTO{
		ForceWidthHeight: *a.ForceWidthHeight,
		Width:            a.Width,
		Height:           a.Height,
		ScaleCanvas:      a.ScaleCanvas,
		ScaleImage:       a.ScaleImage,
	}
}

func ToEmoteDTO(e Emote) EmoteDTO {
	return EmoteDTO{
		Width:              e.Width,
		Height:             e.Height,
		RandomSizeIncrease: *e.RandomSizeIncrease,
		RandomSizeDecrease: *e.RandomSizeDecrease,
		MaxEmoteCount:      e.MaxEmoteCount,
		MaxEmotesPerMsg:    e.MaxEmotesPerMsg,
		GroupEmotes:        *e.GroupEmotes,
		Roundness:          *e.Roundness,
		BackgroundColor:    e.BackgroundColor,
	}
}

func ToAnimationsDTO(a Animations) AnimationsDTO {
	return AnimationsDTO{
		// Map fields here as needed
	}
}

func ToPreviewDTO(p Preview) PreviewDTO {
	return PreviewDTO{
		MaxRandomEmotes:  p.MaxRandomEmotes,
		SpeedOfEmotes:    p.SpeedOfEmotes,
		UseChannelEmotes: *p.UseChannelEmotes,
		UseGlobalEmotes:  *p.UseGlobalEmotes,
		UseRandomEmotes:  *p.UseRandomEmotes,
	}
}

func ToAppConfigDTO(config AppConfig) AppConfigDTO {
	return AppConfigDTO{
		Youtube:     ToYoutubeDTO(config.Youtube),
		Twitch:      ToTwitchDTO(config.Twitch),
		Port:        ToPortDTO(config.Port),
		AppInfo:     ToAppInfoDTO(config.AppInfo),
		AspectRatio: ToAspectRatioDTO(config.AspectRatio),
		Emote:       ToEmoteDTO(config.Emote),
		Animations:  ToAnimationsDTO(config.Animations),
		Preview:     ToPreviewDTO(config.Preview),
	}
}

func ToApiKeyDTO(a ApiKey) ApiKeyDTO {
	return ApiKeyDTO{
		ApiKey: *a.ApiKey,
	}
}

func ToApiUsageDTO(a ApiKey) ApiUsageDTO {
	return ApiUsageDTO{
		ApiUsage: *a.ApiUsage,
		LastUsed: a.LastUsed,
	}
}
