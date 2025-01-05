import { useState } from "react";
import { getConfig } from "../../config/configureConfigFront";

const useEmotes = (
  backgroundCanvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const [emotes, setEmotes] = useState<
    { src: string; x: number; y: number; size: number }[]
  >([]);

  const isWithinBackground = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
  ): boolean => {
    /*
    TODO: Improve efficiency of canvas
      Store all of the valid points that can be used for an image in a set/map?
      Would need just one call of getImageData
      Then I can randomly choose a value from this object for a point on the image
    */
    if (backgroundCanvasRef.current) {
      const pixelData = ctx.getImageData(x, y, 1, 1).data;
      return pixelData[3] > 0;
    }
    return false;
  };

  const createEmote = (
    emoteUrl: string
  ): { src: string; x: number; y: number; size: number } => {
    let x = 0;
    let y = 0;

    if (backgroundCanvasRef.current) {
      const ctx = backgroundCanvasRef.current.getContext("2d", {
        willReadFrequently: true,
      })!;

      do {
        x = Math.random() * backgroundCanvasRef.current.width;
        y = Math.random() * backgroundCanvasRef.current.height;
      } while (!isWithinBackground(ctx, x, y));

      const randomSize = getRandomEmoteSizeChange();
      const srcAndDate = `${emoteUrl}?${new Date().getTime()}`;

      return {
        src: srcAndDate,
        x,
        y,
        size: randomSize,
      };
    }

    console.log("Background Canvas not available to add emote");
    return {
      src: "",
      x,
      y,
      size: 0,
    };
  };

  const getRandomEmoteSizeChange = (): number => {
    return Math.random() < 0.5
      ? getConfig().Emote.Width + getConfig().Emote.RandomSizeIncrease
      : getConfig().Emote.Height - getConfig().Emote.RandomSizeDecrease;
  };

  const placeEmoteInBackground = (emoteUrl: string) => {
    const newEmote = createEmote(emoteUrl);

    setEmotes((prevEmotes) => {
      const updatedEmotes = [...prevEmotes, newEmote];

      if (updatedEmotes.length > getConfig().Emote.MaxEmoteCount) {
        updatedEmotes.shift();
      }

      return updatedEmotes;
    });
  };

  return { emotes, placeEmoteInBackground };
};

export default useEmotes;