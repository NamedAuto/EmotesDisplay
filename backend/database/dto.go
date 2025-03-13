package database

type YoutubeDTO struct {
	VideoId          string `json:"videoId"`
	MessageDelay     int    `json:"messageDelay"`
	ShowGlobalEmotes bool   `json:"showGlobalEmotes"`
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
	UseGlobalEmotes  bool `json:"useGlobalEmotes"`
	UseRandomEmotes  bool `json:"useRandomEmotes"`
}

type ApiKeyDTO struct {
	ApiKey string `json:"apiKey"`
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
