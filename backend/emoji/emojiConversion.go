package emoji

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"strings"
	"unicode/utf16"
)

type Emoji struct {
	Slug        string    `json:"slug"`
	Character   string    `json:"character"`
	UnicodeName string    `json:"unicodeName"`
	CodePoint   string    `json:"codePoint"`
	Group       string    `json:"group"`
	SubGroup    string    `json:"subGroup"`
	Variants    []Variant `json:"variants,omitempty"`
}

type Variant struct {
	Slug      string `json:"slug"`
	Character string `json:"character"`
}

func capitalizeFirstLetter(s string) string {
	if len(s) == 0 {
		return s
	}
	return strings.ToUpper(s[:1]) + s[1:]
}

func characterToCodePoint(s string) string {
	var codePoints string
	for _, r := range s {
		if utf16.IsSurrogate(r) {
			continue
		}
		codePoints += fmt.Sprintf("%X ", r)
	}
	return strings.TrimSpace(codePoints)
}

func formatUnicodeName(slug string) string {
	formatted := strings.Replace(slug, "-", ".", 1)
	formatted = strings.ReplaceAll(formatted, "-", " ")
	return formatted
}

func ConvertJson2Go() {
	jsonFile, err := os.Open("F:\\Programming\\Code\\Visual Studio Code\\Emotes_Display\\backend\\emoji\\emojis.json")
	if err != nil {
		fmt.Println("Error opening JSON file:", err)
		return
	}
	defer jsonFile.Close()

	bytes, err := io.ReadAll(jsonFile)
	if err != nil {
		fmt.Println("Error reading JSON file:", err)
		return
	}

	var emojis []Emoji
	err = json.Unmarshal(bytes, &emojis)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return
	}

	var orderedEmojis []Emoji
	for _, emoji := range emojis {
		orderedEmojis = append(orderedEmojis, emoji)

		if strings.Contains(emoji.Character, "\uFE0F") {
			emojiWithoutFE0F := strings.ReplaceAll(emoji.Character, "\uFE0F", "")
			variantEmojiText := Emoji{
				Slug:        emoji.Slug + "-text",
				Character:   emojiWithoutFE0F, // Text version character
				UnicodeName: emoji.UnicodeName + " (text)",
				CodePoint:   characterToCodePoint(emojiWithoutFE0F),
				Group:       emoji.Group,
				SubGroup:    emoji.SubGroup,
			}
			orderedEmojis = append(orderedEmojis, variantEmojiText)
		}

		for _, variant := range emoji.Variants {
			capitalizedSlug := capitalizeFirstLetter(variant.Slug)
			codePoint := characterToCodePoint(variant.Character)
			formattedUnicodeName := formatUnicodeName(capitalizeFirstLetter((variant.Slug)))
			variantEmoji := Emoji{
				Slug:        capitalizedSlug,
				Character:   variant.Character,
				UnicodeName: formattedUnicodeName,
				CodePoint:   codePoint,
				Group:       emoji.Group,
				SubGroup:    emoji.SubGroup,
			}
			orderedEmojis = append(orderedEmojis, variantEmoji)

			// Add the text/monochrome version if FEOF is present
			if strings.Contains(variant.Character, "\uFE0F") {
				variantWithoutFE0F := strings.ReplaceAll(variant.Character, "\uFE0F", "")
				variantEmojiText := Emoji{
					Slug:        variant.Slug + "-text",
					Character:   variantWithoutFE0F,
					UnicodeName: capitalizedSlug + " (text)",
					CodePoint:   characterToCodePoint(variantWithoutFE0F),
					Group:       emoji.Group,
					SubGroup:    emoji.SubGroup,
				}
				orderedEmojis = append(orderedEmojis, variantEmojiText)
			}
		}
	}
	goFile, err := os.Create("F:\\Programming\\Code\\Visual Studio Code\\Emotes_Display\\backend\\emoji\\emojis.go")
	if err != nil {
		fmt.Println("Error creating Go file:", err)
		return
	}
	defer goFile.Close()

	fmt.Fprintf(goFile, "package emoji\n\n")
	fmt.Fprintf(goFile, "var EmojiMap = map[string]Emoji{\n")
	for _, emoji := range orderedEmojis {
		fmt.Fprintf(goFile, "  \"%s\": {\n", emoji.Character)
		fmt.Fprintf(goFile, "    Slug: \"%s\",\n", emoji.Slug)
		fmt.Fprintf(goFile, "    Character: \"%s\",\n", emoji.Character)
		fmt.Fprintf(goFile, "    UnicodeName: \"%s\",\n", emoji.UnicodeName)
		fmt.Fprintf(goFile, "    CodePoint: \"%s\",\n", emoji.CodePoint)
		fmt.Fprintf(goFile, "    Group: \"%s\",\n", emoji.Group)
		fmt.Fprintf(goFile, "    SubGroup: \"%s\",\n", emoji.SubGroup)
		fmt.Fprintf(goFile, "  },\n")
	}
	fmt.Fprintf(goFile, "}\n")
}
