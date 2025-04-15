package helper

import (
	"context"
	"fmt"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/resize"
	"gorm.io/gorm"
)

func GenerateEmoteMap(ctx context.Context,
	db *gorm.DB,
	paths config.MyPaths,
	folders config.Folder,
) config.EmotesMap {
	type result struct {
		ChannelMap  map[string]config.EmotePathInfo
		ChannelKeys []string
		GlobalMap   map[string]config.EmotePathInfo
		GlobalKeys  []string
		RandomMap   map[string]config.EmotePathInfo
		RandomKeys  []string
	}

	resultChan := make(chan result)

	go func() {
		channelMap, _ := resize.GenerateEmoteMap(ctx,
			db,
			paths.ChannelEmotePath,
			folders.ChannelEmote,
			paths.ResizedChannelEmotePath,
			":_",
			":")
		channelKeys := generateKeyArray(channelMap)
		resultChan <- result{ChannelMap: channelMap,
			ChannelKeys: channelKeys,
		}
	}()

	go func() {
		globalMap, _ := resize.GenerateEmoteMap(ctx,
			db,
			paths.GlobalEmotePath,
			folders.GlobalEmote,
			paths.ResizedGlobalEmotePath,
			":",
			":")
		globalKeys := generateKeyArray(globalMap)
		resultChan <- result{GlobalMap: globalMap,
			GlobalKeys: globalKeys,
		}
	}()

	go func() {
		randomMap, _ := resize.GenerateEmoteMap(ctx,
			db,
			paths.PreviewEmotePath,
			folders.PreviewEmote,
			paths.ResizedPreviewEmotePath,
			"",
			"")
		randomKeys := generateKeyArray(randomMap)
		resultChan <- result{RandomMap: randomMap,
			RandomKeys: randomKeys,
		}
	}()

	finalResult := result{}
	for range 3 {
		r := <-resultChan
		if r.ChannelMap != nil {
			finalResult.ChannelMap = r.ChannelMap
			finalResult.ChannelKeys = r.ChannelKeys
		}
		if r.GlobalMap != nil {
			finalResult.GlobalMap = r.GlobalMap
			finalResult.GlobalKeys = r.GlobalKeys
		}
		if r.RandomMap != nil {
			finalResult.RandomMap = r.RandomMap
			finalResult.RandomKeys = r.RandomKeys
		}
	}

	emotesMap := config.EmotesMap{
		ChannelMap:  finalResult.ChannelMap,
		ChannelKeys: finalResult.ChannelKeys,
		GlobalMap:   finalResult.GlobalMap,
		GlobalKeys:  finalResult.GlobalKeys,
		RandomMap:   finalResult.RandomMap,
		RandomKeys:  finalResult.RandomKeys,
	}

	// printEmotesMap(emotesMap)
	return emotesMap
}

func generateKeyArray(myMap map[string]config.EmotePathInfo) []string {
	keys := make([]string, 0, len(myMap))
	for key := range myMap {
		keys = append(keys, key)
	}

	return keys
}

func printEmotesMap(emotesMap config.EmotesMap) {
	// Print contents of ChannelMap
	fmt.Println("ChannelMap:")
	for key, value := range emotesMap.ChannelMap {
		fmt.Printf("Key: %s, Value: %v\n", key, value)
	}

	// Print contents of GlobalMap
	fmt.Println("\nGlobalMap:")
	for key, value := range emotesMap.GlobalMap {
		fmt.Printf("Key: %s, Value: %v\n", key, value)
	}

	// Print contents of RandomMap
	fmt.Println("\nRandomMap:")
	for key, value := range emotesMap.RandomMap {
		fmt.Printf("Key: %s, Value: %v\n", key, value)
	}
}
