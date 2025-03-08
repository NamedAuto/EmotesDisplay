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

type AppInfoDTO struct {
	Version     string `json:"version"`
	Owner       string `json:"owner"`
	RepoName    string `json:"repoName"`
	LastChecked int    `json:"lastChecked"`
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
	MaxEmotesPerMsg    int    `json:"maxEmotesPerMsg"`
	GroupEmotes        bool   `json:"groupEmotes"`
	Roundness          int    `json:"roundness"`
	BackgroundColor    string `json:"backgroundColor"`
}

type AnimationsDTO struct {
	// Add fields here as needed
}

type PreviewDTO struct {
	MaxRandomEmotes  int  `json:"maxRandomEmotes"`
	SpeedOfEmotes    int  `json:"speedOfEmotes"`
	UseChannelEmotes bool `json:"useChannelEmotes"`
	UseRandomEmotes  bool `json:"useRandomEmotes"`
}

type AppConfigDTO struct {
	Youtube     YoutubeDTO     `json:"youtube"`
	Twitch      TwitchDTO      `json:"twitch"`
	Port        PortDTO        `json:"port"`
	AppInfo     AppInfoDTO     `json:"app"`
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
		UseRandomEmotes:  &dto.UseRandomEmotes,
	}
}
