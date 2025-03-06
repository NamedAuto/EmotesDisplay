package previewView

import (
	"log"
	"sync"

	"github.com/NamedAuto/EmotesDisplay/backend/common"
	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"gorm.io/gorm"
)

var (
	stopChan chan bool
	wg       sync.WaitGroup
	mu       sync.Mutex
)

func StartPreview(handler common.HandlerInterface,
	db *gorm.DB,
	emoteMap map[string]string,
	endpoints config.Endpoint) {
	mu.Lock()
	defer mu.Unlock()

	if stopChan != nil {
		log.Println("Goroutine is already running.")
		return
	}

	stopChan = make(chan bool)
	wg.Add(1)

	handler.EmitPreviewConnection(true)
	go startEmitTimer(handler, db, emoteMap, stopChan, endpoints)
}
