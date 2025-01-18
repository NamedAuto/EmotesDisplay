package defaultView

import (
	"log"
	"sync"

	"github.com/NamedAuto/EmotesDisplay/backend/common"
	"github.com/NamedAuto/EmotesDisplay/backend/service"
)

var (
	stopChan chan bool
	wg       sync.WaitGroup
	mu       sync.Mutex
)

func StartDefault(handler common.HandlerInterface, defaultService *service.DefaultService) {
	mu.Lock()
	defer mu.Unlock()

	if stopChan != nil {
		log.Println("Goroutine is already running.")
		return
	}

	stopChan = make(chan bool)
	wg.Add(1)

	go startEmitTimer(handler, defaultService, stopChan)
}
