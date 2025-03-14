package resize

import (
	"image"
	"image/color/palette"
	"image/gif"
	"image/jpeg"
	"image/png"
	"io"
	"math"
	"os"

	"golang.org/x/image/draw"
	"golang.org/x/image/webp"
)

func T() {
	input, err := os.Open("Images/Emotes/RandomEmotes/2.gif")
	check(err)
	defer input.Close()

	output, err := os.Create("Images/Emotes/RandomEmotes/2-resized.gif")
	check(err)

	// err = thumbnail(input, output, "image/gif", 300)
	// check(err)

	err = resizeGIF(input, output, 300)
	check(err)

	err = output.Close()
	check(err)
}

func thumbnail(r io.Reader, w io.Writer, mimetype string, width int) error {
	var src image.Image
	var err error

	switch mimetype {
	case "image/jpeg":
		src, err = jpeg.Decode(r)
	case "image/png":
		src, err = png.Decode(r)
	case "image/webp":
		src, err = webp.Decode(r)
	case "image/gif":
		src, err = gif.Decode(r)
	}

	if err != nil {
		return err
	}

	ratio := (float64)(src.Bounds().Max.Y) / (float64)(src.Bounds().Max.X)
	height := int(math.Round(float64(width) * ratio))

	dst := image.NewRGBA(image.Rect(0, 0, width, height))

	draw.NearestNeighbor.Scale(dst, dst.Rect, src, src.Bounds(), draw.Over, nil)

	switch mimetype {
	case "image/jpeg":
		err = jpeg.Encode(w, dst, nil)
	case "image/png":
		err = png.Encode(w, dst)
	case "image/gif":
		err = gif.Encode(w, dst, nil)
	}

	if err != nil {
		return err
	}

	return nil
}

func check(err error) {
	if err != nil {
		panic(err)
	}
}

func resizeGIF(r io.Reader, w io.Writer, width int) error {
	g, err := gif.DecodeAll(r)
	if err != nil {
		return err
	}

	for i, frame := range g.Image {
		// Calculate the new height while preserving the aspect ratio.
		ratio := float64(frame.Bounds().Dy()) / float64(frame.Bounds().Dx())
		height := int(math.Round(float64(width) * ratio))

		// Create a new RGBA image for the resized frame.
		dst := image.NewRGBA(image.Rect(0, 0, width, height))

		// Resize the frame using NearestNeighbor scaling.
		draw.NearestNeighbor.Scale(dst, dst.Rect, frame, frame.Bounds(), draw.Over, nil)

		// Convert RGBA to Paletted for GIF compatibility.
		paletted := image.NewPaletted(dst.Rect, palette.Plan9)
		draw.FloydSteinberg.Draw(paletted, dst.Rect, dst, image.Point{})

		// Replace the original frame with the resized one.
		g.Image[i] = paletted
		g.Config.Width = width
		g.Config.Height = height
	}

	// Encode the resized GIF.
	return gif.EncodeAll(w, g)
}
