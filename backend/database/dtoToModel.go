package database

func ToAppConfigModel(dto AppConfigDTO) AppConfig {
	return AppConfig{
		Youtube:     ToYoutubeModel(dto.Youtube),
		Twitch:      ToTwitchModel(dto.Twitch),
		Port:        ToPortModel(dto.Port),
		AppInfo:     ToAppInfoModel(dto.AppInfo),
		AspectRatio: ToAspectRatioModel(dto.AspectRatio),
		Emote:       ToEmoteModel(dto.Emote),
		Animations:  ToAnimationsModel(dto.Animations),
		Preview:     ToPreviewModel(dto.Preview),
	}
}

func ToYoutubeModel(dto YoutubeDTO) Youtube {
	return Youtube{
		VideoId:          &dto.VideoId,
		MessageDelay:     dto.MessageDelay,
		ShowGlobalEmotes: &dto.ShowGlobalEmotes,
	}
}

func ToTwitchModel(dto TwitchDTO) Twitch {
	return Twitch{
		ChannelName: &dto.ChannelName,
	}
}

func ToPortModel(dto PortDTO) Port {
	return Port{
		Port: dto.Port,
	}
}

func ToAppInfoModel(dto AppInfoDTO) AppInfo {
	return AppInfo{
		Version:     dto.Version,
		Owner:       dto.Owner,
		RepoName:    dto.RepoName,
		LastChecked: int64(dto.LastChecked),
	}
}

func ToAspectRatioModel(dto AspectRatioDTO) AspectRatio {
	return AspectRatio{
		ForceWidthHeight: &dto.ForceWidthHeight,
		Width:            dto.Width,
		Height:           dto.Height,
		ScaleCanvas:      dto.ScaleCanvas,
		ScaleImage:       dto.ScaleImage,
	}
}

func ToEmoteModel(dto EmoteDTO) Emote {
	return Emote{
		Width:              dto.Width,
		Height:             dto.Height,
		RandomSizeIncrease: &dto.RandomSizeIncrease,
		RandomSizeDecrease: &dto.RandomSizeDecrease,
		MaxEmoteCount:      dto.MaxEmoteCount,
		MaxEmotesPerMsg:    dto.MaxEmotesPerMsg,
		GroupEmotes:        &dto.GroupEmotes,
		Roundness:          &dto.Roundness,
		BackgroundColor:    dto.BackgroundColor,
	}
}

func ToAnimationsModel(dto AnimationsDTO) Animations {
	return Animations{
		// Map fields here as needed
	}
}

func ToPreviewModel(dto PreviewDTO) Preview {
	return Preview{
		MaxRandomEmotes:  dto.MaxRandomEmotes,
		SpeedOfEmotes:    dto.SpeedOfEmotes,
		UseChannelEmotes: &dto.UseChannelEmotes,
		UseGlobalEmotes:  &dto.UseGlobalEmotes,
		UseRandomEmotes:  &dto.UseRandomEmotes,
	}
}

func ToApiKeyModel(dto ApiKeyDTO) ApiKey {
	return ApiKey{
		ApiKey: &dto.ApiKey,
	}
}
