package defaultView

import "log"

func StopDefault() {
	mu.Lock()
	defer mu.Unlock()

	if stopChan != nil {
		close(stopChan)
		stopChan = nil
		if ticker != nil {
			ticker.Stop()
		}
		log.Println("Goroutine stopped.")

	} else {
		log.Println("No goroutine to stop")
	}

	wg.Wait()
}
