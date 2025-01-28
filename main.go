package main

import (
	"embed"
	"fmt"
	"log"
	"os"

	"github.com/NamedAuto/EmotesDisplay/backend/httpserver"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {

	logFile, logErr := os.OpenFile("server.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if logErr != nil {
		fmt.Println("Failed to open log file:", logErr)
	}

	log.SetOutput(logFile)
	defer logFile.Close()

	// Create an instance of the app structure
	app := NewApp()
	/*
		This is used due to wails needing the /frontend/dist/* embed in this file since
		wails can serve the frontend automatically.
		I will be serving these files as well to allow an external browser to access
		the frontend and therefore need these assets to be used in an endpoint
	*/
	httpserver.AssignAssets(assets)

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "Emotes Display",
		Width:  800,
		Height: 500,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 0, G: 0, B: 0, A: 0},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}

// List embedded files to verify inclusion
func logEmbed() {
	files, err2 := assets.ReadDir("frontend/dist")
	if err2 != nil {
		log.Fatalf("Failed to read embedded files: %v", err2)
	}
	for _, file := range files {
		log.Printf("Embedded file: %s", file.Name())
	}
}
