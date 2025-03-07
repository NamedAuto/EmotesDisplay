package config

import (
	"log"
	// "sync"

	"github.com/joho/godotenv"
)

type Repo struct {
	AppVersion string
	Owner      string
	RepoName   string
}

type MyPaths struct {
	ChannelEmotePath string
	GlobalEmotePath  string
	PreviewEmotePath string
	IconPath         string
	YamlPath         string
	BackgroundPath   string
}

type Folder struct {
	ChannelEmote string
	GlobalEmote  string
	PreviewEmote string
	Icon         string
	Yaml         string
	Background   string
}

type Endpoint struct {
	ChannelEmote  string
	GlobalEmote   string
	PreviewEmote  string
	Icon          string
	Config        string
	Background    string
	AppInfo       string
	YTAPiKey      string
	CheckYTAPiKey string
	Default       string
}

type EmotesMap struct {
	ChannelMap map[string]string
	GlobalMap  map[string]string
	RandomMap  map[string]string
}

var repo Repo
var myPaths MyPaths
var emotesMap EmotesMap

// var channelEmoteMap map[string]string
// var globalEmoteMap map[string]string
var endpoints Endpoint

// var myConfig *AppConfig
// var mu sync.RWMutex

const appVersion = "v2.1"
const owner = "NamedAuto"
const repoName = "EmotesDisplay"

func init() {
	log.Println("Initializing")
	godotenv.Load()

	repo = Repo{AppVersion: appVersion, Owner: owner, RepoName: repoName}
	folder := initFolderNames()
	myPaths = SetupFilePaths(folder)
	endpoints = initEndpointNames()

	emotesMap = EmotesMap{
		ChannelMap: generateEmoteMap(myPaths.ChannelEmotePath),
		GlobalMap:  generateEmoteMap(myPaths.GlobalEmotePath),
		RandomMap:  generateEmoteMap(myPaths.PreviewEmotePath)}

	// fmt.Println("Formatted Emote Map:")
	// for key, value := range emoteMap {
	// 	fmt.Printf("%s: %s\n", key, value)
	// }
}

func initEndpointNames() Endpoint {
	return Endpoint{
		ChannelEmote:  "/channel-emotes/",
		GlobalEmote:   "/global-emotes/",
		PreviewEmote:  "/random-emotes/",
		Icon:          "/icons/",
		Config:        "/config",
		Background:    "/background",
		AppInfo:       "/app-info",
		YTAPiKey:      "/youtube-api-key",
		CheckYTAPiKey: "/check-for-youtube-api-key",
		Default:       "/",
	}
}

func initFolderNames() Folder {
	return Folder{
		ChannelEmote: "ChannelEmotesYT",
		GlobalEmote:  "GlobalEmotesYT",
		PreviewEmote: "RandomEmotes",
		Icon:         "Icons",
		Yaml:         "Config",
		Background:   "Background",
	}
}

func GetRepo() Repo {
	return repo
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
