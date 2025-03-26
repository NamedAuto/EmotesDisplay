package myyoutube

import (
	"fmt"
	"log"
	"time"

	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"gorm.io/gorm"
)

/*
1) At app start
	Check if the time of day is past the reset time
		If so, set to usage to 0
		Else, do nothing

2) Set timer to run at reset time to set api usage to 0

3) When api key is updated, set api usage to 0

QOL?
4) When starting youtube
	Check if usage is above limit
	If so, do not start youtube

*/

// Youtube API Usage resets at midnight PST (UTC-8)
func getReferenceTime(location *time.Location) time.Time {
	now := time.Now().In(location)
	prevDay := now.AddDate(0, 0, -1)
	_, offset := prevDay.Zone()

	// UTC-7 PDT
	if offset == -7*60*60 {
		return time.Date(prevDay.Year(),
			prevDay.Month(),
			prevDay.Day(),
			23, 0, 0, 0,
			location)
	}

	// UTC-8 PST
	return time.Date(prevDay.Year(),
		prevDay.Month(),
		prevDay.Day(),
		0, 0, 0, 0,
		location)
}

func hasCrossedReferenceTime(lastUsed time.Time) bool {
	location, err := time.LoadLocation("America/Los_Angeles")
	if err != nil {
		log.Println("Error loading location:", err)
		return false
	}

	referenceTime := getReferenceTime(location)

	now := time.Now().In(location)

	return lastUsed.In(location).Before(referenceTime) && now.After(referenceTime)
}

func waitUntilTime() {

}

func WaitUntilQuotaReset() {
	location, err := time.LoadLocation("America/Los_Angeles")
	if err != nil {
		log.Println("Error loading location:", err)
	}

	for {
		now := time.Now().In(location)

		_, offset := now.Zone()
		var referenceHour int
		if offset == -8*60*60 {
			referenceHour = 0
		} else if offset == -7*60*60 {
			referenceHour = 23
		}

		referenceTime := time.Date(now.Year(),
			now.Month(),
			now.Day(),
			referenceHour, 0, 0, 0,
			location)

		if now.After(referenceTime) {
			referenceTime = referenceTime.Add(24 * time.Hour)
		}

		duration := time.Until(referenceTime)

		fmt.Printf("Waiting %v until reference time (%v)...\n", duration, referenceTime)

		timer := time.NewTimer(duration)

		<-timer.C
		fmt.Println("Reference time reached! Taking action.")
	}
}

func incrementApiUsage(db *gorm.DB, id uint, amount int) error {
	return db.Model(&database.ApiKey{}).
		Where("id = ?", id).
		Updates(map[string]any{
			"ApiUsage": gorm.Expr("usage + ?", amount),
			"LastUsed": time.Now(),
		}).Error
}

func resetApiUsage(db *gorm.DB, id uint) error {
	return db.Model(&database.ApiKey{}).
		Where("id = ?", id).
		Updates(map[string]any{
			"ApiUsage": 0,
			"LastUsed": time.Now(),
		}).Error
}

// Check if the app starts up past the quota reset time
func StartUpApiCheck(db *gorm.DB) {
	var api database.ApiKey
	db.First(&api)
	if hasCrossedReferenceTime(api.LastUsed) {
		resetApiUsage(db, api.ID)
	}
}
