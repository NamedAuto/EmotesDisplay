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

	err = resizeGIFTransparent(input, output, 300)
	check(err)

	err = output.Close()
	check(err)
}

func thumbnail(r io.Reader, w io.Writer, mimetype string, newWidth int) error {
	var src image.Image
	var err error

	switch mimetype {
	case "image/jpeg":
		src, err = jpeg.Decode(r)
	case "image/png":
		src, err = png.Decode(r)
	case "image/webp":
		src, err = webp.Decode(r)
	}

	if err != nil {
		return err
	}

	ratio := (float64)(src.Bounds().Max.Y) / (float64)(src.Bounds().Max.X)
	newHeight := int(math.Round(float64(newWidth) * ratio))

	destination := image.NewRGBA(image.Rect(0, 0, newWidth, newHeight))

	draw.NearestNeighbor.Scale(destination, destination.Rect, src, src.Bounds(), draw.Over, nil)

	switch mimetype {
	case "image/jpeg":
		err = jpeg.Encode(w, destination, nil)
	case "image/png":
	case "image/webp":
		err = png.Encode(w, destination)
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

func resizeGIFTransparent(r io.Reader, w io.Writer, width int) error {
	g, err := gif.DecodeAll(r)
	if err != nil {
		return err
	}

	for i, frame := range g.Image {
		ratio := float64(frame.Bounds().Dy()) / float64(frame.Bounds().Dx())
		height := int(math.Round(float64(width) * ratio))

		destination := image.NewRGBA(image.Rect(0, 0, width, height))

		draw.NearestNeighbor.Scale(destination, destination.Rect, frame, frame.Bounds(), draw.Src, nil)

		transparencyIndex := -1
		for idx, color := range frame.Palette {
			if _, _, _, alpha := color.RGBA(); alpha == 0 {
				transparencyIndex = idx
				break
			}
		}

		paletted := image.NewPaletted(destination.Rect, frame.Palette)

		for y := range height {
			for x := range width {
				originalX := x * frame.Bounds().Dx() / width
				originalY := y * frame.Bounds().Dy() / height
				originalIndex := frame.ColorIndexAt(originalX, originalY)

				if originalIndex == uint8(transparencyIndex) {
					paletted.SetColorIndex(x, y, uint8(transparencyIndex))
				} else {
					rgbaColor := destination.At(x, y)
					palettedColorIndex := frame.Palette.Index(rgbaColor)
					paletted.SetColorIndex(x, y, uint8(palettedColorIndex))
				}
			}
		}

		g.Image[i] = paletted
		g.Config.Width = width
		g.Config.Height = height
	}

	return gif.EncodeAll(w, g)
}
