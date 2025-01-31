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

// export async function loadImage(config: Config) {
//   try {
//     const response = await fetch(`http://localhost:${config.Port}/images`);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const yamlText = await response.text();
//     config = yaml.load(yamlText) as Config;
//     // console.log('Configuration loaded:', config);

//     // Now you can use the config object as needed in your application
//   } catch (error) {
//     console.error("Error fetching config:", error);
//   }
// }
