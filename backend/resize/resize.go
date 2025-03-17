package resize

import (
	"fmt"
	"image"
	"image/color"
	"image/gif"
	"image/jpeg"
	"image/png"
	"io"
	"math"
	"os"

	"golang.org/x/image/draw"
	"golang.org/x/image/webp"
)

func MethodNoMask(fileName string, rename string, size int) {
	input, err := os.Open("Images/Emotes/RandomEmotes/" + fileName)
	check(err)
	defer input.Close()

	output, err := os.Create("Images/Emotes/RandomEmotes/" + rename)
	check(err)

	// err = thumbnail(input, output, "image/gif", 300)
	// check(err)

	err = resizeGIFTransparent(input, output, size)
	check(err)

	err = output.Close()
	check(err)
}

func MethodMask(fileName string, rename string, size int) {
	input, err := os.Open("Images/Emotes/RandomEmotes/" + fileName)
	check(err)
	defer input.Close()

	output, err := os.Create("Images/Emotes/RandomEmotes/" + rename)
	check(err)

	// err = thumbnail(input, output, "image/gif", 300)
	// check(err)

	err = resizeGIFTransparentMask(input, output, size)
	check(err)

	err = output.Close()
	check(err)
}

func ResizeGifBasic(fileName string, rename string, size int) {
	input, err := os.Open("Images/Emotes/RandomEmotes/" + fileName)
	check(err)
	defer input.Close()

	output, err := os.Create("Images/Emotes/RandomEmotes/" + rename)
	check(err)

	err = resizeGIF(input, output, size)
	check(err)

	err = output.Close()
	check(err)
}

// func resizeGIF(r io.Reader, w io.Writer, width int) error {
// 	g, err := gif.DecodeAll(r)
// 	if err != nil {
// 		return err
// 	}

// 	for i, frame := range g.Image {
// 		// Calculate the height maintaining the aspect ratio
// 		ratio := float64(frame.Bounds().Dy()) / float64(frame.Bounds().Dx())
// 		height := int(math.Round(float64(width) * ratio))

// 		// Debugging: print the original and target image bounds
// 		fmt.Printf("Frame %d: Original Bounds: %v, Target Bounds: %v\n", i, frame.Bounds(), image.Rect(0, 0, width, height))

// 		// Create a destination image of the resized size
// 		destination := image.NewRGBA(image.Rect(0, 0, width, height))

// 		// Manually scale (simplified copy of pixels)
// 		for y := 0; y < height; y++ {
// 			for x := 0; x < width; x++ {
// 				// Calculate the corresponding pixel in the original frame
// 				originalX := int(float64(x) * float64(frame.Bounds().Dx()) / float64(width))
// 				originalY := int(float64(y) * float64(frame.Bounds().Dy()) / float64(height))

// 				// Ensure that we stay within bounds
// 				if originalX >= 0 && originalX < frame.Bounds().Dx() && originalY >= 0 && originalY < frame.Bounds().Dy() {
// 					rgbaColor := frame.At(originalX, originalY)
// 					destination.Set(x, y, rgbaColor)
// 				}
// 			}
// 		}

// 		// Now that the image is scaled, we can store it
// 		paletted := image.NewPaletted(destination.Rect, frame.Palette)
// 		for y := 0; y < height; y++ {
// 			for x := 0; x < width; x++ {
// 				rgbaColor := destination.At(x, y)
// 				palettedColorIndex := frame.Palette.Index(rgbaColor)
// 				paletted.SetColorIndex(x, y, uint8(palettedColorIndex))
// 			}
// 		}

// 		// Update the GIF with the resized frame
// 		g.Image[i] = paletted
// 		g.Config.Width = width
// 		g.Config.Height = height
// 	}

// 	// Encode the modified GIF
// 	return gif.EncodeAll(w, g)
// }

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

// func resizeGIF(r io.Reader, w io.Writer, width int) error {
// 	g, err := gif.DecodeAll(r)
// 	if err != nil {
// 		return err
// 	}

// 	for i, frame := range g.Image {
// 		// Calculate the new height while preserving the aspect ratio.
// 		ratio := float64(frame.Bounds().Dy()) / float64(frame.Bounds().Dx())
// 		height := int(math.Round(float64(width) * ratio))

// 		// Create a new RGBA image for the resized frame.
// 		dst := image.NewRGBA(image.Rect(0, 0, width, height))

// 		// Resize the frame using NearestNeighbor scaling.
// 		draw.NearestNeighbor.Scale(dst, dst.Rect, frame, frame.Bounds(), draw.Over, nil)

// 		// Convert RGBA to Paletted for GIF compatibility.
// 		paletted := image.NewPaletted(dst.Rect, palette.Plan9)
// 		draw.FloydSteinberg.Draw(paletted, dst.Rect, dst, image.Point{})

// 		// Replace the original frame with the resized one.
// 		g.Image[i] = paletted
// 		g.Config.Width = width
// 		g.Config.Height = height
// 	}

// 	// Encode the resized GIF.
// 	return gif.EncodeAll(w, g)
// }

func resizeGIF(r io.Reader, w io.Writer, width int) error {
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
		draw.ApproxBiLinear.Scale(dst, dst.Rect, frame, frame.Bounds(), draw.Src, nil)

		// Convert RGBA to Paletted using the global palette
		paletted := image.NewPaletted(dst.Rect, globalPalette)
		for y := 0; y < height; y++ {
			for x := 0; x < width; x++ {
				rgbaColor := dst.At(x, y)
				index := globalPalette.Index(rgbaColor)
				paletted.SetColorIndex(x, y, uint8(index))
			}
		}

		// Replace the frame with the resized version
		g.Image[i] = paletted
	}

	// Update the GIF dimensions
	g.Config.Width = width
	g.Config.Height = height

	// Encode the resized GIF
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

		fmt.Println(frame.Bounds())

		draw.NearestNeighbor.Scale(destination, destination.Rect, frame, frame.Bounds(), draw.Src, nil)

		transparencyIndex := -1
		for idx, color := range frame.Palette {
			if _, _, _, alpha := color.RGBA(); alpha == 0 {
				transparencyIndex = idx
				break
			}
		}

		paletted := image.NewPaletted(destination.Rect, frame.Palette)

		for y := 0; y < height; y++ {
			for x := 0; x < width; x++ {
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

func resizeGIFTransparentMask(r io.Reader, w io.Writer, width int) error {
	g, err := gif.DecodeAll(r)
	if err != nil {
		return err
	}

	for i, frame := range g.Image {
		ratio := float64(frame.Bounds().Dy()) / float64(frame.Bounds().Dx())
		height := int(math.Round(float64(width) * ratio))

		// Create a mask for transparency
		mask := image.NewGray(frame.Bounds())
		transparencyIndex := -1
		for idx, color := range frame.Palette {
			if _, _, _, alpha := color.RGBA(); alpha == 0 {
				transparencyIndex = idx
				break
			}
		}
		for y := range frame.Bounds().Dy() {
			for x := range frame.Bounds().Dx() {
				if frame.ColorIndexAt(x, y) == uint8(transparencyIndex) {
					mask.SetGray(x, y, color.Gray{0})
				} else {
					mask.SetGray(x, y, color.Gray{255})
				}
			}
		}

		// Resize the frame and the mask
		destination := image.NewRGBA(image.Rect(0, 0, width, height))
		draw.NearestNeighbor.Scale(destination, destination.Rect, frame, frame.Bounds(), draw.Src, nil)
		resizedMask := image.NewGray(image.Rect(0, 0, width, height))
		draw.NearestNeighbor.Scale(resizedMask, resizedMask.Rect, mask, mask.Bounds(), draw.Src, nil)

		// Apply the resized mask
		paletted := image.NewPaletted(destination.Rect, frame.Palette)
		for y := range height {
			for x := range width {
				if resizedMask.GrayAt(x, y).Y == 0 {
					paletted.SetColorIndex(x, y, uint8(transparencyIndex))
				} else {
					rgbaColor := destination.At(x, y)
					paletted.Set(x, y, rgbaColor)
				}
			}
		}

		g.Image[i] = paletted
		g.Config.Width = width
		g.Config.Height = height
	}
	fmt.Printf("Logical Screen: width=%d, height=%d\n", g.Config.Width, g.Config.Height)

	return gif.EncodeAll(w, g)
}
