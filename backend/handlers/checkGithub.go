package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

const AppVersion = "v2.0"
const Owner = "NamedAuto"
const RepoName = "EmotesDisplay"

type Release struct {
	TagName string `json:"tag_name"`
}

func GetLatestReleaseVersion() (string, error) {
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/releases/latest", Owner, RepoName)
	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("failed to fetch release info: %s", resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var release Release
	if err := json.Unmarshal(body, &release); err != nil {
		return "", err
	}

	return release.TagName, nil
}

func versionHandler(w http.ResponseWriter, r *http.Request) {
	latestVersion, err := GetLatestReleaseVersion()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := map[string]string{
		"owner":          Owner,
		"repo":           RepoName,
		"currentVersion": AppVersion,
		"latestVersion":  latestVersion,
	}

	json.NewEncoder(w).Encode(response)
}

func main() {
	http.HandleFunc("/version", versionHandler)

	mine, err := GetLatestReleaseVersion()

	println(mine)

	if err != nil {

	}

	http.ListenAndServe(":8080", nil)
}
