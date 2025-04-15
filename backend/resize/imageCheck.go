package resize

import (
	"context"
	"crypto/sha256"
	"fmt"
	"image"
	"image/gif"
	"image/jpeg"
	"image/png"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"golang.org/x/image/webp"
	"gorm.io/gorm"
)

var RESIZE = 200
var GIF_RESIZE = 100
var GIF_RESIZE_SMALL = 48

func getImagesInFolder(folderPath string) map[string]struct{} {
	imageSet := make(map[string]struct{})

	files, err := os.ReadDir(folderPath)
	if err != nil {
		log.Printf("Error reading directory %s for images: %s", folderPath, err)
		return imageSet
	}

	for _, file := range files {
		imageSet[file.Name()] = struct{}{}
	}
	return imageSet
}

func getHashOfImage(imagePath string) (string, error) {
	data, err := os.ReadFile(imagePath)
	if err != nil {
		return "", err
	}

	hash := sha256.Sum256(data)
	return fmt.Sprintf("%x", hash), nil
}

func GenerateEmoteMap(ctx context.Context,
	db *gorm.DB,
	originalDir string,
	folderName string,
	resizeDir string,
	prefix string,
	suffix string) (map[string]config.EmotePathInfo, error) {

	resultMap := make(map[string]config.EmotePathInfo)
	folderImageSet := getImagesInFolder(originalDir)

	err := compareDbWithFolder(ctx,
		folderImageSet,
		db,
		resultMap,
		folderName,
		originalDir,
		resizeDir,
		prefix,
		suffix)

	if err != nil {
		return resultMap, err
	}

	for img := range folderImageSet {
		fileSize := GetFileSize(filepath.Join(originalDir, img))
		var hash string
		if fileSize > 100000 {
			// Check image size and if too big
			// Resize image
			// Place in resize folder
			// Place key and path into map

			inputFile, err := os.Open(filepath.Join(originalDir, img))
			if err != nil {
				fmt.Println("Error opening input file:", err)
				// return
			}
			defer inputFile.Close()

			mimetype, err := getMimeType(inputFile)

			if err != nil {
				fmt.Printf("Error getting the mimetype of: %s %s", img, err)
			}
			if mimetype == "image/gif" {

				// Skip resiziing gifs for now

				x, y, _ := getWidthAndHeightFileOpened(inputFile, img)
				ratio := float32(y) / float32(x)

				sizeToResize := GIF_RESIZE
				if fileSize >= 6000000 {
					sizeToResize = GIF_RESIZE_SMALL
				}
				resizeGif(ctx, originalDir, resizeDir, img, sizeToResize, ratio)
				// updateResultMap(resultMap, img, resizeDir, prefix, suffix, true)

				// updateResultMap(resultMap, img, originalDir, prefix, suffix, false)
			} else {
				createAndSaveResizedImage(inputFile, mimetype, resizeDir, img, RESIZE)
			}

			hash, err = getHashOfImage(filepath.Join(originalDir, img))
			if err != nil {

			}

			tempImg := database.Image{
				Name:        img,
				ResizedName: img,
				Folder:      folderName,
				Hash:        hash,
			}

			result := db.Save(&tempImg)
			if result.Error != nil {
				fmt.Println("Error saving image info from db:", result.Error)
			} else {
				fmt.Println("Image saved to db ", tempImg.Name)
			}

			updateResultMap(resultMap, img, resizeDir, prefix, suffix, true)

		} else {
			fmt.Println("File smaller than criteria. Not resizing ", img)
			updateResultMap(resultMap, img, originalDir, prefix, suffix, false)
		}
	}

	// loop through remaining set
	// save to resultMap

	return resultMap, nil
}

func deleteImgFromDbAndFolder(db *gorm.DB, img database.Image, folderPath string) error {
	result := db.Delete(&img)
	if result.Error != nil {
		fmt.Println("Error deleting image info from db:", result.Error)
		return result.Error
	} else {
		fmt.Println("Image deleted ", img.Name)
	}

	err := os.Remove(folderPath)
	if err != nil {
		return err
	}

	return nil
}

func createAndSaveResizedImage(inputFile *os.File,
	mimetype string,
	resizedDir string,
	file string,
	newSize int,
) {
	if mimetype == "image/jpeg" || mimetype == "image/png" || mimetype == "image/webp" {

		outputFile, err := os.Create(filepath.Join(resizedDir, file))
		if err != nil {
			fmt.Println("Error creating output file:", err)
			return
		}
		defer outputFile.Close()

		err = resizeImage(inputFile, outputFile, mimetype, newSize)
		if err != nil {
			fmt.Println("Error generating resized image:", err)
		}
	} else {
		fmt.Println("Skipping file: ", mimetype)
	}
}

func createAndSaveResizedImageUseDir(originalDir string,
	resizedDir string,
	file string,
	newSize int,
) {
	// fmt.Println(originalDir)
	// fmt.Println(resizedDir)
	// fmt.Println(file)

	inputFile, err := os.Open(filepath.Join(originalDir, file))
	if err != nil {
		fmt.Println("Error opening input file:", err)
		return
	}
	defer inputFile.Close()

	mimetype, err := getMimeType(inputFile)

	if err != nil {
		fmt.Printf("Error getting the mimetype of: %s %s", file, err)
	}
	// fmt.Println(mimetype)

	createAndSaveResizedImage(inputFile, mimetype, resizedDir, file, newSize)
}

func getMimeType(file *os.File) (string, error) {
	var err error

	buffer := make([]byte, 512)
	_, err = file.Read(buffer)
	if err != nil {
		return "", err
	}

	// Reset to start of file after reading
	_, err = file.Seek(0, 0)
	if err != nil {
		return "", err
	}

	mimeType := http.DetectContentType(buffer)
	return mimeType, nil
}

func compareDbWithFolder(ctx context.Context,
	imageSet map[string]struct{},
	db *gorm.DB,
	resultMap map[string]config.EmotePathInfo,
	originalFolderName string,
	originalDir string,
	resizeDir string,
	prefix string,
	suffix string,
) error {

	var images []database.Image
	result := db.Where("folder = ?", originalFolderName).Find(&images)

	if result.Error != nil {
		fmt.Println("Error retrieving db info for images: ", result.Error)
		return result.Error

	} else if result.RowsAffected == 0 {
		fmt.Println("No matches in db to the images in: ", originalFolderName)
		return nil
	}

	// Loop through Images and check if the names match the ones in the folder set
	for _, img := range images {

		if _, exists := imageSet[img.Name]; exists {
			fmt.Println(img.Name, "exists in the set!")

			hash, err := getHashOfImage(filepath.Join(originalDir, img.Name))
			if err != nil {
				fmt.Println("Error getting hash of image ", err)
				return err
			}

			/*
				Check if the hash matches
				If yes
					the image is unchanged
					skip over
				If no
					The image has been modified
					Check if it should be resized
						If yes
							Resize image, save it and update Image with the new hash
						If no
							Skip over image
							Delete Image from db and resized image from folder
			*/
			if hash != img.Hash {

				fileSize := GetFileSize(filepath.Join(originalDir, img.Name))
				if fileSize > 100000 {
					fmt.Println("Resizing image")
					img.Hash = hash

					result := db.Save(&img)
					if result.Error != nil {
						fmt.Println("Error saving image info from db:", result.Error)
						return result.Error
					} else {
						fmt.Println("Image saved successfully!")
					}

					inputFile, err := os.Open(filepath.Join(originalDir, img.Name))
					if err != nil {
						fmt.Println("Error opening input file:", err)
						// return
					}
					defer inputFile.Close()

					mimetype, err := getMimeType(inputFile)

					if err != nil {
						fmt.Printf("Error getting the mimetype of: %s %s", img.Name, err)
					}
					if mimetype == "image/gif" {

						// Skip resiziing gifs for now

						x, y, _ := getWidthAndHeightFileOpened(inputFile, img.Name)
						ratio := float32(y) / float32(x)

						sizeToResize := GIF_RESIZE
						if fileSize >= 10000000 {
							sizeToResize = GIF_RESIZE_SMALL
						}
						resizeGif(ctx, originalDir, resizeDir, img.Name, sizeToResize, ratio)
						updateResultMap(resultMap, img.Name, resizeDir, prefix, suffix, true)

						// updateResultMap(resultMap, img, originalDir, prefix, suffix, false)
					} else {
						createAndSaveResizedImageUseDir(originalDir, resizeDir, img.Name, RESIZE)
						updateResultMap(resultMap, img.Name, resizeDir, prefix, suffix, true)
					}

				} else {
					fmt.Println("Db image no longer should be resized ", img.Name)
					deleteImgFromDbAndFolder(db, img, filepath.Join(resizeDir, img.Name))
					updateResultMap(resultMap, img.Name, originalDir, prefix, suffix, false)

				}
			} else {
				updateResultMap(resultMap, img.Name, resizeDir, prefix, suffix, true)
			}

			delete(imageSet, img.Name)

			/*
			 The image the db Image was based on is no longer in the folder
			 Delete Image from db and the resized image
			*/
		} else {
			fmt.Println(img.Name, "is not in the set.")
			result := db.Delete(&img)
			if result.Error != nil {
				fmt.Println("Error deleting image:", result.Error)
			} else {
				fmt.Println("Image deleted ", img.Name)
			}

			err := os.Remove(filepath.Join(resizeDir, img.Name))
			if err != nil {
				// error deleting file
			}
		}
	}

	return nil
}

func getWidthAndHeight(dir string, file string) (int, int, error) {
	inputFile, err := os.Open(filepath.Join(dir, file))
	if err != nil {
		fmt.Println("Error opening input file:", err)
		return 0, 0, err
	}
	defer inputFile.Close()

	return getWidthAndHeightFileOpened(inputFile, file)
}

func getWidthAndHeightFileOpened(inputFile *os.File, fileName string) (int, int, error) {
	mimetype, err := getMimeType(inputFile)

	if err != nil {
		fmt.Printf("Error getting the mimetype of: %s %s", fileName, err)
		return 0, 0, err
	}

	var cfg image.Config

	switch mimetype {
	case "image/jpeg":
		cfg, err = jpeg.DecodeConfig(inputFile)
	case "image/png":
		cfg, err = png.DecodeConfig(inputFile)
	case "image/webp":
		cfg, err = webp.DecodeConfig(inputFile)
	case "image/gif":
		/*
			NOTE: Some gif files have the wrong Geometry vs Logical Screen Descriptor
			Can get the actual geometry using gif.Decode()
			Not using it since it doesn't play nice with resigif and the resized file is incorrect
		*/
		cfg, err = gif.DecodeConfig(inputFile)
	}
	if err != nil {
		fmt.Println("Error decoding image: ", err)
		return 0, 0, err
	}

	x := cfg.Width
	y := cfg.Height
	return x, y, nil
}

func updateResultMap(resultMap map[string]config.EmotePathInfo,
	imageName string,
	dir string,
	prefix string,
	suffix string,
	isResized bool) {
	cleanName := strings.TrimSuffix(imageName, filepath.Ext(imageName))
	key := fmt.Sprintf("%s%s%s", prefix, strings.ToLower(cleanName), suffix)

	x, y, _ := getWidthAndHeight(dir, imageName)
	ratio := float32(y) / float32(x)

	path := filepath.Join(dir, imageName)
	resultMap[key] = config.EmotePathInfo{Path: path, IsResized: isResized, Ratio: ratio}
}
