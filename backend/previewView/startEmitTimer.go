package previewView

import (
	"log"
	"time"

	"github.com/NamedAuto/EmotesDisplay/backend/common"
	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"gorm.io/gorm"
)

var ticker *time.Ticker

func startEmitTimer(handler common.HandlerInterface,
	db *gorm.DB,
	emoteMap config.EmotesMap,
	stopChan chan bool,
	endpoints config.Endpoint) {

	defer wg.Done()

	var preview database.Preview
	var port database.Port
	db.First(&preview)
	db.First(&port)

	lastSpeedOfEmotes := preview.SpeedOfEmotes
	duration := time.Duration(lastSpeedOfEmotes) * time.Millisecond
	ticker = time.NewTicker(duration)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			handler.EmitToAllRandom(port.Port, emoteMap, endpoints, db)

			var currentSpeedOfEmotes int
			db.Model(&database.Preview{}).
				Where("id = ?", preview.ID).
				Select("speed_of_emotes").
				Scan(&currentSpeedOfEmotes)

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
