package defaultView

import (
	"log"
	"time"

	"github.com/NamedAuto/EmotesDisplay/backend/common"
	"github.com/NamedAuto/EmotesDisplay/backend/service"
)

var ticker *time.Ticker

func startEmitTimer(handler common.HandlerInterface,
	defaultService *service.DefaultService,
	stopChan chan bool) {

	defer wg.Done()
	lastSpeedOfEmotes := defaultService.Config.Testing.SpeedOfEmotes
	duration := time.Duration(lastSpeedOfEmotes) * time.Millisecond
	ticker = time.NewTicker(duration)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			handler.EmitToAllRandom(defaultService.Config.Port, defaultService.EmoteMap)

			currentSpeedOfEmotes := defaultService.Config.Testing.SpeedOfEmotes
			if currentSpeedOfEmotes != lastSpeedOfEmotes {
				lastSpeedOfEmotes = currentSpeedOfEmotes
				duration = time.Duration(currentSpeedOfEmotes) * time.Millisecond

				ticker.Stop()
				ticker = time.NewTicker(duration)
			}

		case <-stopChan:
			log.Println("Ending function")
			ticker.Stop()
			return
		}
	}
}
