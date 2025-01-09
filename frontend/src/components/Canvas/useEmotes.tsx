import { useState } from "react";
import { Config } from "../Config/ConfigInterface";

interface Emote {
  src: string;
  x: number;
  y: number;
  size: number;
}

const useEmotes = (
  config: Config,
  backgroundCanvasRef: React.RefObject<HTMLCanvasElement | null>
) => {
  const [emotes, setEmotes] = useState<Emote[]>([]);
  const [emotesGroups, setEmotesGroups] = useState<{ emotes: Emote[] }[]>([]);

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
      .
      Pootentially allow for modifying transparency
    */
    if (backgroundCanvasRef.current) {
      const pixelData = ctx.getImageData(x, y, 1, 1).data;
      return pixelData[3] > 0;
    }
    return false;
  };

  const createEmote = (emoteUrl: string): Emote => {
    const { x, y } = getRandomPosition();
    const randomSize = getRandomEmoteSizeChange();
    const srcAndDate = `${emoteUrl}?${new Date().getTime()}`;

    return {
      src: srcAndDate,
      x,
      y,
      size: randomSize,
    };
  };

  const createEmoteGroup = (emoteUrls: string[]): Emote[] => {
    let x = 0;
    const emoteGroup: Emote[] = [];

    for (let i = 0; i < emoteUrls.length; i++) {
      const srcAndDate = `${emoteUrls[i]}?${new Date().getTime()}`;
      x += config.Emote.Width;
      emoteGroup.push({
        src: srcAndDate,
        x: x,
        y: 0,
        size: config.Emote.Width,
      });
    }

    return emoteGroup;
  };

  const getRandomPosition = (): { x: number; y: number } => {
    let x = 0;
    let y = 0;

    if (backgroundCanvasRef.current) {
      const ctx = backgroundCanvasRef.current.getContext("2d", {})!;

      do {
        x = Math.random() * backgroundCanvasRef.current.width;
        y = Math.random() * backgroundCanvasRef.current.height;
      } while (!isWithinBackground(ctx, x, y));

      return {
        x,
        y,
      };
    }

    console.log("Background Canvas not available to add emote");
    return {
      x,
      y,
    };
  };

  const getRandomEmoteSizeChange = (): number => {
    return Math.random() < 0.5
      ? config.Emote.Width + config.Emote.RandomSizeIncrease
      : config.Emote.Width - config.Emote.RandomSizeDecrease;
  };

  const giveEmoteGroupPositionAndSize = (
    emoteGroup: Emote[],
    x: number,
    y: number,
    size: number
  ) => {};

  const placeEmoteInBackground = (emoteUrl: string[]) => {
    for (let url of emoteUrl) {
      const newEmote = createEmote(url);

      setEmotes((prevEmotes) => {
        const updatedEmotes = [...prevEmotes, newEmote];

        if (updatedEmotes.length > config.Emote.MaxEmoteCount) {
          updatedEmotes.shift();
        }

        return updatedEmotes;
      });
    }
  };

  const placeEmotesGroupInBackground = (emoteUrls: string[]) => {
    // Create a group of emotes by mapping over the URLs and creating emote objects
    const newEmoteGroup = createEmoteGroup(emoteUrls);

    const { x, y } = getRandomPosition();
    const randomEmoteSizeChange = getRandomEmoteSizeChange();

    console.log("HEY: " + newEmoteGroup[0].src);

    // Add this new group to the state
    setEmotesGroups((prevGroups) => {
      const updatedGroups = [...prevGroups, { emotes: newEmoteGroup }];

      if (updatedGroups.length > config.Emote.MaxEmoteCount) {
        updatedGroups.shift(); // Optionally limit the number of groups
      }

      return updatedGroups;
    });
  };

  return { emotes, emotesGroups, placeEmotesGroupInBackground };
};

export default useEmotes;
