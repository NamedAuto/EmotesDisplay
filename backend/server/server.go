package server

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"github.com/NamedAuto/EmotesDisplay/backend/httpserver"
	"github.com/NamedAuto/EmotesDisplay/backend/myyoutube"
	"github.com/NamedAuto/EmotesDisplay/backend/resize"
	"github.com/NamedAuto/EmotesDisplay/backend/websocketserver"
	"gorm.io/gorm"
)

var handler = &websocketserver.WebSocketHandler{}
var mux = http.NewServeMux()

var db *gorm.DB

func StartServer(ctx context.Context) {
	log.Println("Server starting")
	db = database.StartDatabase("AppData/emotesDisplay.db")

	myPaths := config.GetMyPaths()
	endpoints := config.GetMyEndpoints()
	emoteMap := config.GetEmoteMap()
	folders := config.GetFolderNames()
	go temp(db, myPaths, folders)

	myyoutube.StartUpApiCheck(db)
	go myyoutube.WaitUntilQuotaReset(db, handler)

	var p database.Port
	db.First(&p)
	port := p.Port
	if isPortAvailable(port) {
		fmt.Printf("Port %d is available!\n", port)
	} else {
		fmt.Printf("Port %d is already in use. Searching for another one.\n", port)
		startPort := 49152
		endPort := 65535

		port, err := findAvailablePort(startPort, endPort)
		if err != nil {
			log.Println("Error:", err)
		} else {
			log.Printf("Found available port : %d\n", port)
			p.Port = port
			db.Model(&p).Update("Port", port)
		}
	}

	go websocketserver.StartWebSocketServer(ctx, mux, handler, db, emoteMap, endpoints)
	go httpserver.StartHttpServer(mux, db, myPaths, endpoints)
}

func isPortAvailable(port int) bool {
	ln, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		return false
	}
	ln.Close()
	return true
}

// func isPortInUse(port int) bool {
//     cmd := exec.Command("lsof", "-i", fmt.Sprintf(":%d", port))
//     output, err := cmd.Output()
//     if err != nil {
//         return false
//     }
//     return strings.Contains(string(output), fmt.Sprintf(":%d", port))
// }

func findAvailablePort(startPort, endPort int) (int, error) {
	for port := startPort; port <= endPort; port++ {
		ln, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
		if err == nil {
			ln.Close()
			return port, nil
		}
	}
	return 0, fmt.Errorf("no available port found in the range %d-%d", startPort, endPort)
}

func temp(db *gorm.DB, paths config.MyPaths, folders config.Folder) {
	type result struct {
		ChannelMap  map[string]string
		ChannelKeys []string
		GlobalMap   map[string]string
		GlobalKeys  []string
		RandomMap   map[string]string
		RandomKeys  []string
	}

	resultChan := make(chan result)

	go func() {
		channelMap, _ := resize.GenerateEmoteMap(db,
			paths.ChannelEmotePath,
			folders.ChannelEmote,
			paths.ResizedChannelEmotePath,
			":_",
			":")
		channelKeys := generateKeyArray(channelMap)
		resultChan <- result{ChannelMap: channelMap, ChannelKeys: channelKeys}
	}()

	go func() {
		globalMap, _ := resize.GenerateEmoteMap(db,
			paths.GlobalEmotePath,
			folders.GlobalEmote,
			paths.ResizedGlobalEmotePath,
			":",
			":")
		globalKeys := generateKeyArray(globalMap)
		resultChan <- result{GlobalMap: globalMap, GlobalKeys: globalKeys}
	}()

	go func() {
		randomMap, _ := resize.GenerateEmoteMap(db,
			paths.PreviewEmotePath,
			folders.PreviewEmote,
			paths.ResizedPreviewEmotePath,
			"",
			"")
		randomKeys := generateKeyArray(randomMap)
		resultChan <- result{RandomMap: randomMap, RandomKeys: randomKeys}
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

	// emotesMap := config.EmotesMap{
	// 	ChannelMap:  channelMap,
	// 	ChannelKeys: channelKeys,
	// 	GlobalMap:   globalMap,
	// 	GlobalKeys:  globalKeys,
	// 	RandomMap:   randomMap,
	// 	RandomKeys:  randomKeys,
	// }

	config.AssignEmoteMap(emotesMap)
}

func generateKeyArray(myMap map[string]string) []string {
	keys := make([]string, 0, len(myMap))
	for key := range myMap {
		keys = append(keys, key)
	}

	return keys
}
