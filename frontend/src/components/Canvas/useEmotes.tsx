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
    const randomIndex = Math.floor(
      Math.random() * nonTransparentPositions.length
    );
    return nonTransparentPositions[randomIndex];
  };

  const getRandomEmoteSizeChange = (): number => {
    return Math.random() < 0.5
      ? config.Emote.Width + config.Emote.RandomSizeIncrease
      : config.Emote.Width - config.Emote.RandomSizeDecrease;
  };

  const updateEmotesGroups = (emoteGroup: Emote[]) => {
    setEmotesGroups((prevGroups) => {
      const updatedGroups = [...prevGroups, { emotes: emoteGroup }];

      if (updatedGroups.length > config.Emote.MaxEmoteCount) {
        updatedGroups.shift();
      }

      return updatedGroups;
    });
  };

  const placeEmotesGroupInBackground = (
    emoteUrls: string[],
    nonTransparentPositions: RefObject<Position[]>
  ) => {
    if (config.Emote.GroupEmotes) {
      const emoteSize = getRandomEmoteSizeChange();
      const randomPos = getRandomPosition(nonTransparentPositions.current);
      const newEmoteGroup = createEmoteGroup(emoteUrls, emoteSize, randomPos);
      updateEmotesGroups(newEmoteGroup);
    } else {
      for (let emote of emoteUrls) {
        const tempArray = [emote];
        const emoteSize = getRandomEmoteSizeChange();
        const randomPos = getRandomPosition(nonTransparentPositions.current);
        const newEmoteGroup = createEmoteGroup(tempArray, emoteSize, randomPos);
        updateEmotesGroups(newEmoteGroup);
      }
    }
  };

  return { emotesGroups, placeEmotesGroupInBackground };
};

export default useEmotes;
