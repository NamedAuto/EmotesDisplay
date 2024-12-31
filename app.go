package main

import (
	"context"
	"fmt"
	"myproject/backend/config"
	"myproject/backend/filepaths"
	"myproject/backend/server"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"gopkg.in/yaml.v2"
)

// App struct
type App struct {
	ctx      context.Context
	MyConfig config.AppConfig
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	filepaths.SetupFilePaths()
	a.LoadConfig()
	// a.EmitBackendPort()

	runtime.EventsOn(a.ctx, "frontend-ready", func(optionalData ...interface{}) {
		if len(optionalData) > 0 {
			// Step 2: Emit the backend port once the frontend is ready
			message := optionalData[0].(string)
			fmt.Println("Received event from frontend:", message)
			a.EmitBackendPort()
		}
	})

	server.StartServer(ctx)
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// Function to get the port
func (a *App) EmitBackendPort() {
	println("I AM EMITTING")
	println(a.MyConfig.Port.App)
	runtime.EventsEmit(a.ctx, "backend-port", a.MyConfig.Port.App)
	// config := a.GetConfig() // Assume this is the method that loads the config from the file
	// return fmt.Sprintf("http://localhost:%d", a.MyConfig.Port.Browser)
}

func (a *App) LoadConfig() error {
	file, err := os.Open(filepath.Join(filepaths.YamlPath, "config.yaml"))
	if err != nil {
		return err
	}
	defer file.Close()

	decoder := yaml.NewDecoder(file)
	err = decoder.Decode(&a.MyConfig)
	if err != nil {
		return err
	}
	return nil
}
