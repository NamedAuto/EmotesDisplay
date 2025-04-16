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
	emoteMap *config.EmotesMap,
	stopChan chan bool,
	endpoints *config.Endpoint) {

	defer wg.Done()

	var preview database.Preview
	var port database.Port
	db.First(&preview)
	db.First(&port)

	cacheSpeedOfEmotes := preview.SpeedOfEmotes
	duration := time.Duration(cacheSpeedOfEmotes) * time.Millisecond
	ticker = time.NewTicker(duration)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			handler.EmitRandom(port.Port, *emoteMap, *endpoints, db)

			var dbSpeedOfEmotes int
			db.Model(&database.Preview{}).
				Where("id = ?", preview.ID).
				Select("speed_of_emotes").
				Scan(&dbSpeedOfEmotes)

			if dbSpeedOfEmotes != cacheSpeedOfEmotes {
				cacheSpeedOfEmotes = dbSpeedOfEmotes
				duration = time.Duration(dbSpeedOfEmotes) * time.Millisecond

				ticker.Stop()
				ticker = time.NewTicker(duration)
			}

		case <-stopChan:
			handler.EmitPreviewConnection(false)
			log.Println("Ending Preview View")
			ticker.Stop()
			return
		}
	}
}
