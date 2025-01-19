package previewView

import (
	"log"
	"time"

	"github.com/NamedAuto/EmotesDisplay/backend/common"
	"github.com/NamedAuto/EmotesDisplay/backend/service"
)

var ticker *time.Ticker

func startEmitTimer(handler common.HandlerInterface,
	previewService *service.PreviewService,
	stopChan chan bool) {

	defer wg.Done()

	lastSpeedOfEmotes := previewService.Config.Testing.SpeedOfEmotes
	duration := time.Duration(lastSpeedOfEmotes) * time.Millisecond
	ticker = time.NewTicker(duration)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			handler.EmitToAllRandom(previewService.Config.Port, previewService.EmoteMap)

			currentSpeedOfEmotes := previewService.Config.Testing.SpeedOfEmotes
			if currentSpeedOfEmotes != lastSpeedOfEmotes {
				lastSpeedOfEmotes = currentSpeedOfEmotes
				duration = time.Duration(currentSpeedOfEmotes) * time.Millisecond

				ticker.Stop()
				ticker = time.NewTicker(duration)
			}

		case <-stopChan:
			handler.EmitPreviewConnection(false)
			log.Println("Ending function")
			ticker.Stop()
			return
		}
	}
}
