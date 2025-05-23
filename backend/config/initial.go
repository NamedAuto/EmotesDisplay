package config

import (
	"log"

	"github.com/joho/godotenv"
)

type MyPaths struct {
	ChannelEmotePath        string
	ResizedChannelEmotePath string
	GlobalEmotePath         string
	ResizedGlobalEmotePath  string
	PreviewEmotePath        string
	ResizedPreviewEmotePath string
	IconPath                string
	BackgroundPath          string
}

type Folder struct {
	ChannelEmote        string
	ResizedChannelEmote string
	GlobalEmote         string
	ResizedGlobalEmote  string
	PreviewEmote        string
	ResizedPreviewEmote string
	Icon                string
	Yaml                string
	Background          string
}

type Endpoint struct {
	ChannelEmote   string
	GlobalEmote    string
	PreviewEmote   string
	ChannelEmoteMd string
	GlobalEmoteMd  string
	PreviewEmoteMd string
	Icon           string
	Config         string
	Background     string
	AppInfo        string
	YTAPiKey       string
	CheckYTAPiKey  string
	ApiTimeLeft    string
	Default        string
}

type EmotePathInfo struct {
	Path      string
	IsResized bool
	Ratio     float32
}

type EmotesMap struct {
	ChannelMap  map[string]EmotePathInfo
	ChannelKeys []string
	GlobalMap   map[string]EmotePathInfo
	GlobalKeys  []string
	RandomMap   map[string]EmotePathInfo
	RandomKeys  []string
}

var myPaths MyPaths
var emotesMap EmotesMap
var endpoints Endpoint
var folder Folder

func init() {
	configSetup()
}

func configSetup() {
	log.Println("Initializing")
	godotenv.Load()

	folder = initFolderNames()
	myPaths = setupFilePaths(folder)
	endpoints = initEndpointNames()
}

func initEndpointNames() Endpoint {
	return Endpoint{
		ChannelEmote:   "/channel-emotes/",
		ChannelEmoteMd: "/channel-emotes-md/",
		GlobalEmote:    "/global-emotes/",
		GlobalEmoteMd:  "/global-emotes-md/",
		PreviewEmote:   "/random-emotes/",
		PreviewEmoteMd: "/random-emotes-md/",
		Icon:           "/icons/",
		Config:         "/config",
		Background:     "/background",
		AppInfo:        "/app-info",
		YTAPiKey:       "/youtube-api-key",
		CheckYTAPiKey:  "/check-for-youtube-api-key",
		ApiTimeLeft:    "/youtube-api-time-left",
		Default:        "/",
	}
}

func initFolderNames() Folder {
	return Folder{
		ChannelEmote:        "ChannelEmotesYT",
		ResizedChannelEmote: "ResizedChannelEmotesYT",
		GlobalEmote:         "GlobalEmotesYT",
		ResizedGlobalEmote:  "ResizedGlobalEmotesYT",
		PreviewEmote:        "RandomEmotes",
		ResizedPreviewEmote: "ResizedRandomEmotes",
		Icon:                "Icons",
		Yaml:                "Config",
		Background:          "Background",
	}
}

func GetMyPaths() MyPaths {
	return myPaths
}

func GetMyEndpoints() Endpoint {
	return endpoints
}

func GetEmoteMap() EmotesMap {
	return emotesMap
}

func GetFolderNames() Folder {
	return folder
}

func AssignEmoteMap(myMap EmotesMap) {
	emotesMap = myMap
}
