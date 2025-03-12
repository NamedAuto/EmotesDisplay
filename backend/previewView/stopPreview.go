package previewView

import "log"

func StopPreview() {
	mu.Lock()
	defer mu.Unlock()

	if stopChan != nil {
		close(stopChan)
		stopChan = nil
		if ticker != nil {
			ticker.Stop()
		}
		log.Println("Preview view goroutine stopped.")

	} else {
		log.Println("No goroutine to stop for the Preview view")
	}

	wg.Wait()
}
