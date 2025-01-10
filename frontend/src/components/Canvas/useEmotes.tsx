import { RefObject, useState } from "react";
import { Config } from "../Config/ConfigInterface";

interface Emote {
  src: string;
  pos: Position;
  size: number;
}

export interface Position {
  x: number;
  y: number;
}

const useEmotes = (
  config: Config,
  backgroundCanvasRef: React.RefObject<HTMLCanvasElement | null>
) => {
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

  const createEmoteGroup = (
    emoteUrls: string[],
    emoteSize: number,
    posToCenterOn: Position
  ): Emote[] => {
    let newX = 0;
    const emoteGroup: Emote[] = [];

    /*
    Emotes are placed next to each other and the group is centered on
    [posToCenterOn]
    Emote width and height is [emoteSize]
    The [midpoint] is used to center the group on [posToCenter]
    Since the x axis is already being translated,
    Translate the Y by subtracting half of the [emoteSize] from it
    This is down to since images start on their top left corner
    transform: "translate(0%, -50%)"
    */
    const midpoint = (emoteUrls.length * emoteSize) / 2;
    for (let i = 0; i < emoteUrls.length; i++) {
      emoteGroup.push({
        src: `${emoteUrls[i]}?${new Date().getTime()}`,
        pos: {
          x: posToCenterOn.x + newX - midpoint,
          y: posToCenterOn.y - emoteSize / 2,
        },
        size: emoteSize,
      });
      newX += emoteSize;
    }

    return emoteGroup;
  };

  const getRandomPosition = (nonTransparentPositions: Position[]): Position => {
    let x = 0;
    let y = 0;

    const randomIndex = Math.floor(
      Math.random() * nonTransparentPositions.length
    );
    return nonTransparentPositions[randomIndex];

    // if (backgroundCanvasRef.current) {
    //   const ctx = backgroundCanvasRef.current.getContext("2d", {})!;

    //   do {
    //     x = Math.random() * backgroundCanvasRef.current.width;
    //     y = Math.random() * backgroundCanvasRef.current.height;
    //   } while (!isWithinBackground(ctx, x, y));

    //   return {
    //     x,
    //     y,
    //   };
    // }

    // console.log("Background Canvas not available to add emote");
    // return {
    //   x,
    //   y,
    // };
  };

  const getRandomEmoteSizeChange = (): number => {
    return Math.random() < 0.5
      ? config.Emote.Width + config.Emote.RandomSizeIncrease
      : config.Emote.Width - config.Emote.RandomSizeDecrease;
  };

  const placeEmotesGroupInBackground = (
    emoteUrls: string[],
    nonTransparentPositions: RefObject<Position[]>
  ) => {
    const nonArray = nonTransparentPositions.current;
    console.log(nonArray.length)
    const emoteSize = getRandomEmoteSizeChange();
    const randomPos = getRandomPosition(nonArray);
    const newEmoteGroup = createEmoteGroup(emoteUrls, emoteSize, randomPos);

    setEmotesGroups((prevGroups) => {
      const updatedGroups = [...prevGroups, { emotes: newEmoteGroup }];

      if (updatedGroups.length > config.Emote.MaxEmoteCount) {
        updatedGroups.shift();
      }

      return updatedGroups;
    });
  };

  return { emotesGroups, placeEmotesGroupInBackground };
};

export default useEmotes;
