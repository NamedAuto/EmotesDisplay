package defaultView

import (
	"time"

	"github.com/NamedAuto/EmotesDisplay/backend/common"
	"github.com/NamedAuto/EmotesDisplay/backend/service"
)

func StartDefaultView(handler common.HandlerInterface, defaultService *service.DefaultService) {
	duration := time.Duration(defaultService.Config.Testing.SpeedOfEmotes) * time.Millisecond
	go func() {
		stopChan := make(chan bool)
		handler.RunAtFlag(duration, func() { handler.EmitToAllRandom(defaultService.Config.Port, defaultService.EmoteMap) }, stopChan)
		stopChan <- true
	}()
}
