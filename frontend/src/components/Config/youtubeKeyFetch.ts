export async function getYoutubeApiKey(): Promise<string | null> {
  try {
    const response = await fetch(`/youtube-api-key`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const key = await response.json();
    return key.apiKey;
  } catch (error) {
    console.error("Error fetching youtube api key:", error);
  }
  return null;
}
