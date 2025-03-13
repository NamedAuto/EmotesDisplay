import { Config } from "./ConfigInterface";

export async function loadBackground(config: Config): Promise<string | null> {
  try {
    const response = await fetch(
      `http://localhost:${config.port.port}/background`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const imageUrl = response.url;
    console.log("Image URL:", imageUrl);

    return imageUrl;
  } catch (error) {
    console.error("Error fetching image:", error);
  }
  return null;
}
