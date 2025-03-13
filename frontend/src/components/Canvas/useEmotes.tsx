import { RefObject, useState } from "react";
import { Config } from "../Config/ConfigInterface";
import { Position } from "./positionInterface";
import "../../style.css";

interface Emote {
  src: string;
  pos: Position;
  size: number;
  animation: string;
  roundness: string;
}

export const UseEmotes = (
  config: Config,
  backgroundCanvasRef: React.RefObject<HTMLCanvasElement | null>
) => {
  const animations = ["bounce", "rotate", "scale", "slide"];
  const [emotesGroups, setEmotesGroups] = useState<{ emotes: Emote[] }[]>([]);

  const createEmoteGroup = (
    emoteUrls: string[],
    emoteSize: number,
    posToCenterOn: Position,
    animation: string,
    roundness: string
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
    This is translated down since images start on their top left corner
    transform: "translate(0%, -50%)"
    */
    let d = new Date();
    const midpoint = (emoteUrls.length * emoteSize) / 2;
    for (let i = 0; i < emoteUrls.length; i++) {
      emoteGroup.push({
        src: `${emoteUrls[i]}?${d.getTime()}`,
        pos: {
          x: posToCenterOn.x + newX - midpoint,
          y: posToCenterOn.y - emoteSize / 2,
        },
        size: emoteSize,
        animation: animation,
        roundness: roundness,
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

  const getRandomEmoteSizeChange = (max: number, min: number): number => {
    const sizeChange = Math.floor(Math.random() * (max - min + 1)) + min;
    return config.emote.width + sizeChange;
  };

  const updateEmotesGroups = (emoteGroup: Emote[]) => {
    setEmotesGroups((prevGroups) => {
      const updatedGroups = [...prevGroups, { emotes: emoteGroup }];
      // let totalItems = updatedGroups.reduce(
      //   (sum, group) => sum + group.emotes.length,
      //   0
      // );

      // while (totalItems > config.Emote.MaxEmoteCount) {
      //   let temp = updatedGroups.shift();
      //   if (temp) {
      //     totalItems -= temp.emotes.length;
      //   }
      // }

      /*
      The above code ran fine for groups ranging from 1-3 and 1000 max
      Unable to change .reduce into a counter as setEmotesGroups is called twice
        when calling updateEmotesGroups()
      Using a state or ref did not allow time to update before the second call
        to setEmotesGroups was triggered
      Using a number caused it to be updated twice due to the second call
      */
      if (updatedGroups.length > config.emote.maxEmoteCount) {
        updatedGroups.shift();
      }

      return updatedGroups;
    });
  };

  const getRandomAnimation = () => {
    return animations[Math.floor(Math.random() * animations.length)];
  };

  const getRandomDelay = () => {
    return Math.random() * 10;
  };

  const placeEmotesGroupInBackground = (
    emoteUrls: string[],
    nonTransparentPositions: RefObject<Position[]>
  ) => {
    const randomAnimation = getRandomAnimation();

    if (emoteUrls.length > config.emote.maxEmotesPerMsg) {
      emoteUrls.length = config.emote.maxEmotesPerMsg;
    }

    if (config.emote.groupEmotes) {
      placeEmotes(emoteUrls, nonTransparentPositions, randomAnimation);
    } else {
      for (let emote of emoteUrls) {
        const tempArray = [emote];
        placeEmotes(tempArray, nonTransparentPositions, randomAnimation);
      }
    }
  };

  const placeEmotes = (
    emoteUrls: string[],
    nonTransparentPositions: RefObject<Position[]>,
    randomAnimation: string
  ) => {
    const emoteSize = getRandomEmoteSizeChange(
      config.emote.randomSizeIncrease,
      config.emote.randomSizeDecrease * -1
    );
    const roundness = config.emote.roundness + "";
    const randomPos = getRandomPosition(nonTransparentPositions.current);
    const newEmoteGroup = createEmoteGroup(
      emoteUrls,
      emoteSize,
      randomPos,
      randomAnimation,
      roundness
    );
    updateEmotesGroups(newEmoteGroup);
  };

  return { emotesGroups, placeEmotesGroupInBackground };
};

export default UseEmotes;
