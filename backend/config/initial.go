package config

import (
	"log"

	"github.com/joho/godotenv"
)

type Repo struct {
	AppVersion string
	Owner      string
	RepoName   string
}

type MyPaths struct {
	EmotePath      string
	YamlPath       string
	BackgroundPath string
}

var repo Repo
var myPaths MyPaths
var emoteMap map[string]string
var myConfig *AppConfig

const appVersion = "v2.0"
const owner = "NamedAuto"
const repoName = "EmotesDisplay"

func init() {
	log.Println("Initializing")
	godotenv.Load()

	repo = Repo{AppVersion: appVersion, Owner: owner, RepoName: repoName}
	myPaths = SetupFilePaths()

	var err error
	myConfig, err = LoadYamlConfig(myPaths.YamlPath)
	if err != nil {
		log.Fatalf("Error loading config.yaml")
	}

	emoteMap = GenerateEmoteMap(myPaths.EmotePath)
	// fmt.Println("Formatted Emote Map:")
	// for key, value := range emoteMap {
	// 	fmt.Printf("%s: %s\n", key, value)
	// }
}

func GetRepo() Repo {
	return repo
}

func GetMyPaths() MyPaths {
	return myPaths
}

func GetEmoteMap() map[string]string {
	return emoteMap
}

func GetMyConfig() *AppConfig {
	return myConfig
}
