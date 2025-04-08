package resize

import (
	// "fmt"

	"crypto/sha256"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	// "path/filepath"
	// "strings"

	// "github.com/NamedAuto/EmotesDisplay/backend/database"
	"github.com/NamedAuto/EmotesDisplay/backend/database"
	"gorm.io/gorm"
)

func checkFolderForImageChanges(folderSuffix string, folderPath string, db *gorm.DB) {
	// currentFiles := getCurrentImages(folderPath)

	// var images []database.Image
	// db.Where("folder = ?", folderSuffix).Find(&images)

	// fileNames := make(map[string]struct{})

	// imageFiles, err := os.ReadDir(folderPath)
	// if err != nil {
	// 	fmt.Printf("Error reading directory %s for emotes: %s", folderPath, err)
	// 	// return emoteMap
	// }

	// for _, file := range imageFiles {
	// 	if !file.IsDir() {
	// 		emoteName := strings.TrimSuffix(file.Name(), filepath.Ext(file.Name()))
	// 		fileNames[emoteName] := struct{}{}
	// 	}
	// }

	var images []database.Image
	result := db.Find(&images)
	if result.Error != nil {
		log.Fatalf("Error retrieving images: %v", result.Error)
	}

	// Loop through all images
	for _, img := range images {
		fmt.Printf("Original: %s, Resized: %s, Hash: %s\n", img.Name, img.ResizedName, img.Hash)
	}

	var image database.Image
	nameToSearch := "example.jpg" // The name of the image
	folderToSearch := "folder1"   // The folder where the image is stored

	result2 := db.Where("name = ? AND folder = ?", nameToSearch, folderToSearch).First(&image)
	if result2.Error != nil {
		fmt.Println("Image not found:", result2.Error)
	} else {
		fmt.Printf("Found image: Name: %s, Folder: %s, Resized: %s, Hash: %s\n",
			image.Name, image.Folder, image.ResizedName, image.Hash)
	}
}

func getCurrentImages(folderPath string) map[string]struct{} {
	imageSet := make(map[string]struct{})

	files, err := os.ReadDir(folderPath)
	if err != nil {
		log.Printf("Error reading directory %s for emotes: %s", folderPath, err)
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

func sss(db *gorm.DB,
	folderDir string,
	folderName string,
	resizeDir string,
	prefix string,
	suffix string) (map[string]string, error) {

	resultMap := make(map[string]string)
	folderImageSet := getCurrentImages(folderDir)

	var images []database.Image
	result := db.Where("folder = ?", folderName).Find(&images)

	if result.Error != nil {
		fmt.Println("Error retrieving images:", result.Error)
		return resultMap, result.Error

	} else if result.RowsAffected == 0 {
		fmt.Println("No images found in folder:", folderName)
		// return resultMap, nil

	} else {
		for _, img := range images {

			if _, exists := folderImageSet[img.Name]; exists {
				fmt.Println(img.Name, "exists in the set!")

				hash, err := getHashOfImage(img.Name)
				if err != nil {
					fmt.Println("Error getting hash of image ", err)
					return resultMap, err
				}

				if hash != img.Hash {

					tempPath := filepath.Join(folderDir, img.Name) //folderDir + img.Name
					fileSize := GetFileSize(tempPath)
					if fileSize > 1 {
						img.Hash = hash

						result := db.Save(&img)
						if result.Error != nil {
							fmt.Println("Error saving image info from db:", result.Error)
							return resultMap, result.Error
						} else {
							fmt.Println("Image saved successfully!")
						}

						createAndSaveResizedImage(folderDir, resizeDir, img.Name, 200)

						key, value := getKeyValue(img.Name, resizeDir, prefix, suffix)
						resultMap[key] = value

					} else {
						fmt.Println("Image no longer in db and is smaller than criteria")
						deleteImgFromDbAndFolder(db, img, resizeDir+img.Name)
						key, value := getKeyValue(img.Name, folderDir, prefix, suffix)
						resultMap[key] = value

					}
				} else {
					key, value := getKeyValue(img.Name, resizeDir, prefix, suffix)
					resultMap[key] = value
				}

				delete(folderImageSet, img.Name)

			} else {
				fmt.Println(img.Name, "is not in the set.")
				result := db.Delete(&img)
				if result.Error != nil {
					fmt.Println("Error deleting image:", result.Error)
				} else {
					fmt.Println("Image deleted successfully!")
				}

				tempPath := filepath.Join(resizeDir, img.Name)
				err := os.Remove(tempPath)
				if err != nil {
					// error deleting file
				}
			}
		}
	}

	// check mimetype
	for img := range folderImageSet {
		// Check image size and skip if already small
		tempPath := filepath.Join(folderDir, img) //folderDir + img
		fileSize := GetFileSize(tempPath)
		if fileSize > 1 {
			fmt.Println("HHHH")
			// Check image size and if too big
			// Resize image
			// Place in resize folder
			// Place key and path into map
			createAndSaveResizedImage(folderDir, resizeDir, img, 200)

		} else {
			fmt.Println("File smaller than criteria. Not resizing")
			key, value := getKeyValue(img, folderDir, prefix, suffix)
			resultMap[key] = value
		}
	}

	// loop through remaining set
	// save to resultMap

	return resultMap, nil
}

func getKeyValue(imageName string, path string, prefix string, suffix string) (string, string) {
	name := strings.TrimSuffix(imageName, filepath.Ext(imageName))
	key := fmt.Sprintf("%s%s%s", prefix, strings.ToLower(name), suffix)
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

	inputFile, err := os.Open(originalDir + file)
	if err != nil {
		fmt.Println("Error opening input file:", err)
		return
	}
	defer inputFile.Close()

	outputFile, err := os.Create(resizedDir + file)
	if err != nil {
		fmt.Println("Error creating output file:", err)
		return
	}
	defer outputFile.Close()

	mimetype, err := getMimeType(inputFile)
	fmt.Println(mimetype)

	err = resizeImage(inputFile, outputFile, mimetype, newSize)
	if err != nil {
		fmt.Println("Error generating resized image:", err)
	}
}

func getMimeType(file *os.File) (string, error) {
	var err error

	buffer := make([]byte, 512)
	_, err = file.Read(buffer)
	if err != nil {
		return "", err
	}

	_, err = file.Seek(0, 0)
	if err != nil {
		return "", err
	}

	mimeType := http.DetectContentType(buffer)
	return mimeType, nil
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
