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

var repo Repo
var myPaths MyPaths
var emoteMap map[string]string
var endpoints Endpoint

// var myConfig *AppConfig
// var mu sync.RWMutex

const appVersion = "v2.1"
const owner = "NamedAuto"
const repoName = "EmotesDisplay"

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

func init() {
	log.Println("Initializing")
	godotenv.Load()

	repo = Repo{AppVersion: appVersion, Owner: owner, RepoName: repoName}
	folder := initFolderNames()
	myPaths = SetupFilePaths(folder)
	endpoints = initEndpointNames()

	// var err error
	// myConfig, err = LoadYamlConfig(myPaths.YamlPath)
	// if err != nil {
	// 	log.Fatalf("Error loading config.yaml")
	// }

	emoteMap = GenerateEmoteMap(myPaths.ChannelEmotePath)
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

func GetEmoteMap() map[string]string {
	return emoteMap
}
