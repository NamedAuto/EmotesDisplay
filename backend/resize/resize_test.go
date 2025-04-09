package resize

import (
	"context"
	"fmt"
	"image/gif"
	"os"
	"testing"

	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"github.com/logica0419/resigif"
	"golang.org/x/image/draw"
)

func TestGifEncoding(t *testing.T) {

	dir := "../../Images/Emotes/RandomEmotes/"
	ctx := context.Background()

	src, err := os.Open(dir + "meimi1.gif")
	if err != nil {
		panic(err)
	}
	defer src.Close()

	srcImg, err := gif.DecodeAll(src)
	if err != nil {
		panic(err)
	}

	width := 100
	height := 100

	dstImg, err := resigif.Resize(ctx, srcImg, width, height, resigif.WithAspectRatio(resigif.Maintain), resigif.WithParallel(3), resigif.WithImageResizeFunc(resigif.FromDrawScaler(draw.BiLinear)))
	if err != nil {
		panic(err)
	}

	dst, err := os.OpenFile(dir+"resized.gif", os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0o644)
	if err != nil {
		panic(err)
	}
	defer dst.Close()

	err = gif.EncodeAll(dst, dstImg)
	if err != nil {
		panic(err)
	}

}

func TestImageEncoding(t *testing.T) {
	dir := "../../Images/Emotes/RandomEmotes/"
	inputFile, err := os.Open(dir + "nami.png")
	if err != nil {
		fmt.Println("Error opening input file:", err)
		return
	}
	defer inputFile.Close()

	fileInfo, err := os.Stat(dir + "nami.png")
	if err != nil {
		fmt.Println("Error getting file info:", err)
		return
	}
	fileSize := fileInfo.Size()
	fmt.Printf("File size: %d bytes (%.2f KB, %.2f MB)\n", fileSize, float64(fileSize)/1024, float64(fileSize)/(1024*1024))

	// Create destination file
	outputFile, err := os.Create(dir + "nami-resized2.png")
	if err != nil {
		fmt.Println("Error creating output file:", err)
		return
	}
	defer outputFile.Close()

	// Call the thumbnail function
	err = resizeImage(inputFile, outputFile, "image/png", 200)
	if err != nil {
		fmt.Println("Error generating thumbnail:", err)
	}

	// thumbnail(src)
}

func TestMimeType(t *testing.T) {
	dir := "../../Images/Emotes/RandomEmotes/"
	inputFile, err := os.Open(dir + "w.png")
	if err != nil {
		fmt.Println("Error opening input file:", err)
		return
	}
	defer inputFile.Close()

	mimeType, err := getMimeType(inputFile)
	if err != nil {
		fmt.Println("Error getting mimetype:", err)
		return
	}

	fmt.Println(mimeType)
}

func TestImages(t *testing.T) {
	// dir := "../../Images/Emotes/RandomEmotes/"

	// mySet := getCurrentImages(dir)

	// for file := range mySet {
	// 	fmt.Println(file)
	// 	fmt.Println(file)
	// }
}

func TestFolders(t *testing.T) {
	dir := "../../Images/Emotes/RandomEmotes/"
	resize := "../../Images/Emotes/Resize/"
	db := database.StartDatabase("../../AppData/emotesDisplay.db")

	GenerateEmoteMap(db, dir, "RandomEmotes", resize, ":", "_")
}
