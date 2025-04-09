package resize

import (
	// "fmt"

	"crypto/sha256"
	"fmt"
	"image"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	// "path/filepath"
	// "strings"

	// "github.com/NamedAuto/EmotesDisplay/backend/database"
	"github.com/NamedAuto/EmotesDisplay/backend/config"
	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"gorm.io/gorm"
)

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

func GenerateEmoteMap(db *gorm.DB,
	originalDir string,
	originalFolderName string,
	resizeDir string,
	prefix string,
	suffix string) (map[string]config.EmotePathInfo, map[string]string, error) {

	resultMap := make(map[string]config.EmotePathInfo)
	basicMap := make(map[string]string)
	folderImageSet := getImagesInFolder(originalDir)

	var err error
	resultMap, folderImageSet, err = compareDbWithFolder(folderImageSet,
		db,
		resultMap,
		basicMap,
		originalFolderName,
		originalDir,
		resizeDir,
		prefix,
		suffix)

	if err != nil {
		return resultMap, basicMap, err
	}

	for img := range folderImageSet {
		fileSize := GetFileSize(filepath.Join(originalDir, img))
		if fileSize > 100000 {
			// Check image size and if too big
			// Resize image
			// Place in resize folder
			// Place key and path into map
			createAndSaveResizedImage(originalDir, resizeDir, img, 200)
			hash, err := getHashOfImage(filepath.Join(originalDir, img))
			if err != nil {

			}

			tempImg := database.Image{Name: img, ResizedName: img, Folder: originalFolderName, Hash: hash}

			result := db.Save(&tempImg)
			if result.Error != nil {
				fmt.Println("Error saving image info from db:", result.Error)
			} else {
				fmt.Println("Image saved to db successfully!")
			}

			updateMaps(resultMap, basicMap, img, resizeDir, prefix, suffix, true)

		} else {
			fmt.Println("File smaller than criteria. Not resizing")
			updateMaps(resultMap, basicMap, img, originalDir, prefix, suffix, false)
		}
	}

	// loop through remaining set
	// save to resultMap

	return resultMap, basicMap, nil
}

func removeExtFromName(name string) string {
	temp := strings.TrimSuffix(name, filepath.Ext(name))
	return strings.ToLower(temp)
}

func getKeyValue(imageName string, path string, prefix string, suffix string) (string, string) {
	// name := strings.TrimSuffix(imageName, filepath.Ext(imageName))
	key := fmt.Sprintf("%s%s%s", prefix, imageName, suffix)
	newPath := filepath.Join(path, imageName)

	return key, newPath
}

func saveImgToDbAndFolder(db *gorm.DB, img database.Image, folderPath string, image string) error {
	result := db.Save(&img)
	if result.Error != nil {
		fmt.Println("Error saving image info from db:", result.Error)
		return result.Error
	} else {
		fmt.Println("Image saved successfully!")
	}

	// TODO: Save image to resizedDir folder

	return nil
}

func deleteImgFromDbAndFolder(db *gorm.DB, img database.Image, folderPath string) error {
	result := db.Delete(&img)
	if result.Error != nil {
		fmt.Println("Error deleting image info from db:", result.Error)
		return result.Error
	} else {
		fmt.Println("Image deleted successfully!")
	}

	err := os.Remove(folderPath)
	if err != nil {
		return err
	}

	return nil
}

func createAndSaveResizedImage(originalDir string,
	resizedDir string,
	file string,
	newSize int,
) {
	fmt.Println(originalDir)
	fmt.Println(resizedDir)
	fmt.Println(file)

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
	fmt.Println(mimetype)

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
		fmt.Println("Skipping non static images")
	}
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

func getWidthAndHeight(imagePath string) (width int, height int) {
	file, err := os.Open(imagePath)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return 0, 0
	}
	defer file.Close()

	img, _, err := image.DecodeConfig(file)
	if err != nil {
		fmt.Println("Error decoding image:", err)
		return 0, 0
	}

	return img.Width, img.Height
}

func compareDbWithFolder(imageSet map[string]struct{},
	db *gorm.DB,
	resultMap map[string]config.EmotePathInfo,
	basicMap map[string]string,
	originalFolderName string,
	originalDir string,
	resizeDir string,
	prefix string,
	suffix string,
) (map[string]config.EmotePathInfo, map[string]struct{}, error) {

	var images []database.Image
	result := db.Where("folder = ?", originalFolderName).Find(&images)

	if result.Error != nil {
		fmt.Println("Error retrieving db info for images: ", result.Error)
		return resultMap, imageSet, result.Error

	} else if result.RowsAffected == 0 {
		fmt.Println("No matches in db to the folder images in: ", originalFolderName)
		return resultMap, imageSet, nil

	}

	// Loop through Images and check if the names match the ones in the folder set
	for _, img := range images {

		if _, exists := imageSet[img.Name]; exists {
			fmt.Println(img.Name, "exists in the set!")

			hash, err := getHashOfImage(filepath.Join(originalDir, img.Name))
			if err != nil {
				fmt.Println("Error getting hash of image ", err)
				return resultMap, imageSet, err
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
						return resultMap, imageSet, result.Error
					} else {
						fmt.Println("Image saved successfully!")
					}

					createAndSaveResizedImage(originalDir, resizeDir, img.Name, 200)
					updateMaps(resultMap, basicMap, img.Name, resizeDir, prefix, suffix, true)

				} else {
					fmt.Println("Db image hash no longer matches and is smaller than criteria")
					deleteImgFromDbAndFolder(db, img, resizeDir+img.Name)
					updateMaps(resultMap, basicMap, img.Name, originalDir, prefix, suffix, false)

				}
			} else {
				updateMaps(resultMap, basicMap, img.Name, resizeDir, prefix, suffix, true)
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
				fmt.Println("Image deleted successfully!")
			}

			err := os.Remove(filepath.Join(resizeDir, img.Name))
			if err != nil {
				// error deleting file
			}
		}
	}

	return resultMap, imageSet, nil
}

func updateMaps(resultMap map[string]config.EmotePathInfo,
	basicMap map[string]string,
	imageName string,
	dir string,
	prefix string,
	suffix string,
	isResized bool) {
	cleanName := removeExtFromName(imageName)
	key, value := getKeyValue(imageName, dir, prefix, suffix)
	basicMap[cleanName] = imageName
	resultMap[key] = config.EmotePathInfo{Path: value, IsResized: isResized}
}

/*
	var image database.Image
	for img := range folderImageSet {
		result := db.Where("name = ? AND folder = ?", img, folderName).First(&image)
		if result.Error != nil {
			if result.Error == gorm.ErrRecordNotFound {
				fmt.Println("No image found!")
				path := folderDir + img
				fileSize := GetFileSize(path)
				if fileSize > 1 {
					// Check image size and if too big
					// Resize image
					// Place in resize folder
					// Place key and path into map
				} else {
					fmt.Println("File smaller than criteria. Not resizing")
					key, value := getKeyValue(image.Name, folderDir, prefix, suffix)
					resultMap[key] = value
				}

			} else {
				fmt.Println("Database error:", result.Error)
			}
		} else {

			hash, err := getHashOfImage(img)
			if err != nil {
				fmt.Println("Error getting hash of image ", err)
				return resultMap, err
			}
			// Can actually just update the hash in db and overwrite the old image since it's the same name
			if hash != image.Hash {
				// Delete row from db
				// result := db.Delete(&image)
				// if result.Error != nil {
				// 	fmt.Println("Error deleting image:", result.Error)
				// } else {
				// 	fmt.Println("Image deleted successfully!")
				// }

				// Delete from folder
				// tempPath := filepath.Join(resizeDir, img)
				// err := os.Remove(tempPath)
				// if err != nil {
				// 	// return err // Return the error if deletion fails
				// }
				// return nil

				// Resize Image

				// Store in db

				key, value := getKeyValue(image.Name, resizeDir, prefix, suffix)
				resultMap[key] = value

			} else {
				key, value := getKeyValue(image.Name, resizeDir, prefix, suffix)
				resultMap[key] = value
			}
		}
	}
*/
