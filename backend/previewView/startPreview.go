package previewView

import (
	"log"
	"sync"

	"github.com/NamedAuto/EmotesDisplay/backend/common"
	"gorm.io/gorm"
)

var (
	stopChan chan bool
	wg       sync.WaitGroup
	mu       sync.Mutex
)

func StartPreview(handler common.HandlerInterface, db *gorm.DB, emoteMap map[string]string) {
	mu.Lock()
	defer mu.Unlock()

	if stopChan != nil {
		log.Println("Goroutine is already running.")
		return
	}

	stopChan = make(chan bool)
	wg.Add(1)

	handler.EmitPreviewConnection(true)
	go startEmitTimer(handler, db, emoteMap, stopChan)
}
