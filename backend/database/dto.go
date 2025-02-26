package database

type YoutubeDTO struct {
	VideoId      string `json:"videoId"`
	MessageDelay int    `json:"messageDelay"`
}

type TwitchDTO struct {
	ChannelName string `json:"channelName"`
}

type PortDTO struct {
	Port int `json:"port"`
}

type VersionDTO struct {
	Version  string `json:"version"`
	Owner    string `json:"owner"`
	RepoName string `json:"repoName"`
}

type AspectRatioDTO struct {
	ForceWidthHeight bool    `json:"forceWidthHeight"`
	Width            int     `json:"width"`
	Height           int     `json:"height"`
	ScaleCanvas      float32 `json:"scaleCanvas"`
	ScaleImage       float32 `json:"scaleImage"`
}

type EmoteDTO struct {
	Width              int    `json:"width"`
	Height             int    `json:"height"`
	RandomSizeIncrease int    `json:"randomSizeIncrease"`
	RandomSizeDecrease int    `json:"randomSizeDecrease"`
	MaxEmoteCount      int    `json:"maxEmoteCount"`
	GroupEmotes        bool   `json:"groupEmotes"`
	Roundness          int    `json:"roundness"`
	BackgroundColor    string `json:"backgroundColor"`
}

type AnimationsDTO struct {
	// Add fields here as needed
}

type PreviewDTO struct {
	SpeedOfEmotes int `json:"speedOfEmotes"`
}

type AppConfigDTO struct {
	Youtube     YoutubeDTO     `json:"youtube"`
	Twitch      TwitchDTO      `json:"twitch"`
	Port        PortDTO        `json:"port"`
	Version     VersionDTO     `json:"version"`
	AspectRatio AspectRatioDTO `json:"aspectRatio"`
	Emote       EmoteDTO       `json:"emote"`
	Animations  AnimationsDTO  `json:"animations"`
	Preview     PreviewDTO     `json:"preview"`
}

func ToYoutubeDTO(y Youtube) YoutubeDTO {
	return YoutubeDTO{
		VideoId:      *y.VideoId,
		MessageDelay: y.MessageDelay,
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

func ToVersionDTO(v Version) VersionDTO {
	return VersionDTO{
		Version:  v.Version,
		Owner:    v.Owner,
		RepoName: v.RepoName,
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
		SpeedOfEmotes: p.SpeedOfEmotes,
	}
}

func ToAppConfigDTO(config AppConfig) AppConfigDTO {
	return AppConfigDTO{
		Youtube:     ToYoutubeDTO(config.Youtube),
		Twitch:      ToTwitchDTO(config.Twitch),
		Port:        ToPortDTO(config.Port),
		Version:     ToVersionDTO(config.Version),
		AspectRatio: ToAspectRatioDTO(config.AspectRatio),
		Emote:       ToEmoteDTO(config.Emote),
		Animations:  ToAnimationsDTO(config.Animations),
		Preview:     ToPreviewDTO(config.Preview),
	}
}

func ToAppConfigModel(dto AppConfigDTO) AppConfig {
	return AppConfig{
		Youtube:     ToYoutubeModel(dto.Youtube),
		Twitch:      ToTwitchModel(dto.Twitch),
		Port:        ToPortModel(dto.Port),
		Version:     ToVersionModel(dto.Version),
		AspectRatio: ToAspectRatioModel(dto.AspectRatio),
		Emote:       ToEmoteModel(dto.Emote),
		Animations:  ToAnimationsModel(dto.Animations),
		Preview:     ToPreviewModel(dto.Preview),
	}
}

func ToYoutubeModel(dto YoutubeDTO) Youtube {
	return Youtube{
		VideoId:      &dto.VideoId,
		MessageDelay: dto.MessageDelay,
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

func ToVersionModel(dto VersionDTO) Version {
	return Version{
		Version:  dto.Version,
		Owner:    dto.Owner,
		RepoName: dto.RepoName,
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
		SpeedOfEmotes: dto.SpeedOfEmotes,
	}
}
