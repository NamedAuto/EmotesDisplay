package myyoutube

import (
	"fmt"
	"testing"
	"time"
)

// func loadLocation(loc string) (*time.Location, error) {
// 	location, err := time.LoadLocation(loc)
// 	if err != nil {
// 		fmt.Println("Error loading America/Los_Angeles location for the time:", err)
// 		return nil, err
// 	}

// 	return location, nil
// }

func TestGetNextResetTime(t *testing.T) {
	location, err := time.LoadLocation("America/Los_Angeles")
	if err != nil {
		fmt.Println("Error loading America/Los_Angeles location for the time:", err)
		return
	}
	time := time.Date(2025, time.March, 28, 23, 1, 0, 0, location)

	nextReset := getNextResetTime(time)
	fmt.Println("Next Reset At: ", nextReset)
}
