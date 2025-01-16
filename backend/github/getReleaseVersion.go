package github

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
)

// const AppVersion = "v2.0"
// const Owner = "NamedAuto"
// const RepoName = "EmotesDisplay"

// type Repo struct {
// 	AppVersion string
// 	Owner      string
// 	RepoName   string
// }

type Release struct {
	TagName string `json:"tag_name"`
}

func GetLatestReleaseVersion(owner string, repoName string) (string, error) {
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/releases/latest", owner, repoName)
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

func versionHandler(w http.ResponseWriter, r *http.Request, repo config.Repo) {
	latestVersion, err := GetLatestReleaseVersion(repo.Owner, repo.RepoName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := map[string]string{
		"owner":          repo.Owner,
		"repo":           repo.RepoName,
		"currentVersion": repo.AppVersion,
		"latestVersion":  latestVersion,
	}

	json.NewEncoder(w).Encode(response)
}
