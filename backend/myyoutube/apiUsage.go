package myyoutube

import (
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

const API_QUOTA = 10000

var location *time.Location

// Check if the app starts up past the quota reset time
func StartUpApiCheck(db *gorm.DB) {
	var api database.ApiKey
	db.First(&api)

	var err error
	location, err = time.LoadLocation("America/Los_Angeles")
	if err != nil {
		log.Println("Error loading location:", err)
	}

	now := time.Now().In(location)

	if now.After(api.NextReset) {
		newResetTime := getNextResetTime(now)
		resetApiUsage(db, api.ID, newResetTime)
	}
}

func getNextResetTime(now time.Time) time.Time {
	nextDay := now.AddDate(0, 0, 1)
	_, offset := now.Zone()

	// UTC-7 PDT
	if offset == -7*60*60 {

		/*
			Handle case where the current time is already past the
			 rest time but still in the same day
		*/
		if now.Hour() == 23 {
			return time.Date(nextDay.Year(),
				nextDay.Month(),
				nextDay.Day(),
				23, 0, 0, 0,
				nextDay.Location())
		}

		return time.Date(now.Year(),
			now.Month(),
			now.Day(),
			23, 0, 0, 0,
			now.Location())
	}

	// UTC-8 PST
	return time.Date(nextDay.Year(),
		nextDay.Month(),
		nextDay.Day(),
		0, 0, 0, 0,
		nextDay.Location())
}

func WaitUntilQuotaReset(db *gorm.DB) {

	var api database.ApiKey
	db.First(&api)
	nextReset := api.NextReset

	for {
		duration := time.Until(nextReset)

		log.Printf("Waiting %s until youtube quota reset at %s\n", duration, nextReset)

		timer := time.NewTimer(duration)

		<-timer.C
		var temp database.ApiKey
		db.First(&temp)
		nextRestTime := getNextResetTime(time.Now().In(location))

		resetApiUsage(db, temp.ID, nextRestTime)
		log.Println("Resetting youtube quota usage")
	}
}

func incrementApiUsage(db *gorm.DB, id uint, amount int) error {
	return db.Model(&database.ApiKey{}).
		Where("id = ?", id).
		Updates(map[string]any{
			"ApiUsage": gorm.Expr("api_usage + ?", amount),
			"LastUsed": time.Now(),
		}).Error
}

func resetApiUsage(db *gorm.DB, id uint, resetTime time.Time) error {
	return db.Model(&database.ApiKey{}).
		Where("id = ?", id).
		Updates(map[string]any{
			"ApiUsage":  0,
			"LastUsed":  time.Now(),
			"NextReset": resetTime,
		}).Error
}

func calculateTimeLeftForApi(db *gorm.DB, apiId uint) int {
	var youtube database.Youtube
	db.First(&youtube)

	var apiUsage int
	db.Model(&database.ApiKey{}).Select("ApiUsage").Where("id = ?", apiId).Scan(&apiUsage)

	quotaLeft := API_QUOTA - apiUsage

	return quotaLeft * youtube.MessageDelay
}

func HandleSavingNewKey(db *gorm.DB, apiKey database.ApiKey, newKey *string) error {
	usage := 0
	now := time.Now().In(location)
	nextReset := getNextResetTime(now)
	apiKey.ApiKey = newKey
	apiKey.ApiUsage = &usage
	apiKey.LastUsed = now
	apiKey.NextReset = nextReset

	return db.Save(&apiKey).Error
}
