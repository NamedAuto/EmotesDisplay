package main

import (
	"embed"
	"log"
	"myproject/backend/handlers"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	// "github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	log.Println("Starting application...")

	// List embedded files to verify inclusion
	files, err2 := assets.ReadDir("frontend/dist")
	if err2 != nil {
		log.Fatalf("Failed to read embedded files: %v", err2)
	}
	for _, file := range files {
		log.Printf("Embedded file: %s", file.Name())
	}

	// Create an instance of the app structure
	app := NewApp()

	/*
		This is used due to wails needing the /frontend/dist/* embed in this file since
		wails can serve the frontend automatically.
		I will be serving these files as well to allow an external browser to access
		the frontend and therefore need these assets to be used in an endpoint
	*/
	handlers.AssignAssets(assets)

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "Emote Display",
		Width:  1024,
		Height: 768,
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
