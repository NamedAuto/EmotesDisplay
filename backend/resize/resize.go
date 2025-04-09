package resize

import (
	"context"
	"fmt"
	"image"
	"image/gif"
	"image/jpeg"
	"image/png"
	"io"
	"log"
	"math"
	"os"

	"github.com/logica0419/resigif"
	"golang.org/x/image/draw"
	"golang.org/x/image/webp"
)

func resizeGif(ctx context.Context, fileName string, rename string, size int) {
	dir := "Images/Emotes/RandomEmotes/"

	src, err := os.Open(dir + fileName)
	if err != nil {
		panic(err)
	}
	defer src.Close()

	srcImg, err := gif.DecodeAll(src)
	if err != nil {
		panic(err)
	}

	width := size
	height := 100

	dstImg, err := resigif.Resize(ctx, srcImg, width, height, resigif.WithAspectRatio(resigif.Maintain), resigif.WithParallel(3), resigif.WithImageResizeFunc(resigif.FromDrawScaler(draw.BiLinear)))
	if err != nil {
		panic(err)
	}

	dst, err := os.OpenFile(dir+rename, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0o644)
	if err != nil {
		panic(err)
	}
	defer dst.Close()

	err = gif.EncodeAll(dst, dstImg)
	if err != nil {
		panic(err)
	}
}

func resizeGIFSimple(r io.Reader, w io.Writer, width int) error {
	g, err := gif.DecodeAll(r)
	if err != nil {
		return err
	}

	// Compute the aspect ratio based on the first frame
	ratio := float64(g.Image[0].Bounds().Dy()) / float64(g.Image[0].Bounds().Dx())
	height := int(math.Round(float64(width) * ratio))

	// Use a global palette to avoid repeated palette conversions
	globalPalette := g.Image[0].Palette

	for i, frame := range g.Image {
		// Create a new RGBA image for the resized frame
		dst := image.NewRGBA(image.Rect(0, 0, width, height))

		// Resize using a faster scaling algorithm
		draw.BiLinear.Scale(dst, dst.Rect, frame, frame.Bounds(), draw.Src, nil)

		// Convert RGBA to Paletted using the global palette
		paletted := image.NewPaletted(dst.Rect, globalPalette)
		for y := 0; y < height; y++ {
			for x := 0; x < width; x++ {
				rgbaColor := dst.At(x, y)
				paletted.Set(x, y, globalPalette.Convert(rgbaColor))
			}
		}

		// Preserve the original frame delay and disposal settings
		originalDelay := g.Delay[i]
		originalDisposal := g.Disposal[i]

		// Replace the frame with the resized version
		g.Image[i] = paletted

		// Restore frame delay and disposal settings
		g.Delay[i] = originalDelay
		g.Disposal[i] = originalDisposal
	}

	// Update the GIF dimensions
	g.Config.Width = width
	g.Config.Height = height

	// Encode the resized GIF
	return gif.EncodeAll(w, g)
}

func resizeImage(r io.Reader, w io.Writer, mimetype string, newWidth int) error {
	var src image.Image
	var err error

	fmt.Println(r)

	switch mimetype {
	case "image/jpeg":
		src, err = jpeg.Decode(r)
	case "image/png":
		src, err = png.Decode(r)
	case "image/webp":
		src, err = webp.Decode(r)
	}
	if err != nil {
		fmt.Println("Error decoding image: ", err)
		return err
	}

	ratio := (float64)(src.Bounds().Max.Y) / (float64)(src.Bounds().Max.X)
	newHeight := int(math.Round(float64(newWidth) * ratio))

	destination := image.NewRGBA(image.Rect(0, 0, newWidth, newHeight))

	draw.BiLinear.Scale(destination, destination.Rect, src, src.Bounds(), draw.Over, nil)

	switch mimetype {
	case "image/jpeg":
		err = jpeg.Encode(w, destination, nil)
	case "image/png":
		err = png.Encode(w, destination)
	case "image/webp":
		err = png.Encode(w, destination)
	}

	if err != nil {
		fmt.Println("Error encoding image: ", err)
		return err
	}

	return nil
}

func GetFileSize(path string) int64 {
	fileInfo, err := os.Stat(path)
	if err != nil {
		log.Println("Error getting file size: ", err)
		return 0
	}
	return fileInfo.Size()
	// log.Printf("File size: %d bytes (%.2f KB, %.2f MB)\n", fileSize, float64(fileSize)/1024, float64(fileSize)/(1024*1024))
}
