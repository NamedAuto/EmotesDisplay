import { useState, useRef } from 'react';
import { getConfig } from '../config/configureConfigFront';

const useEmotes = (backgroundCanvasRef: React.RefObject<HTMLCanvasElement>) => {
  const [emotes, setEmotes] = useState<HTMLImageElement[]>([]);
  const backgroundContainerRef = useRef<HTMLDivElement>(null);

  const isWithinBackground = (x: number, y: number): boolean => {
    if (backgroundCanvasRef.current) {
      const ctx = backgroundCanvasRef.current.getContext('2d', { willReadFrequently: true })!;
      const pixelData = ctx.getImageData(x, y, 1, 1).data;
      return pixelData[3] > 0;
    }
    return false;
  };

  const createEmote = (emoteUrl: string): HTMLImageElement => {
    const emote = document.createElement('img');
    emote.crossOrigin = 'anonymous';
    emote.className = 'emote';
    emote.src = `${emoteUrl}?${new Date().getTime()}`;
    changeEmoteSizeRandom(emote);
    emote.style.borderRadius = `${getConfig().Emote.Roundness}%`;
    emote.style.backgroundColor = getConfig().Emote.BackgroundColor;
    return emote;
  };

  const changeEmoteSizeRandom = (emote: HTMLImageElement) => {
    const randomBinary = Math.random() < 0.5 ? 0 : 1;
    let sizeChange;
    if (randomBinary) {
      sizeChange = getConfig().Emote.RandomSizeIncrease;
    } else {
      sizeChange = -getConfig().Emote.RandomSizeDecrease;
    }

    const newWidth = getConfig().Emote.Width + sizeChange;
    const newHeight = getConfig().Emote.Height + sizeChange;
    emote.style.width = `${newWidth}px`;
    emote.style.height = `${newHeight}px`;
  };

  const setPosition = (emote: HTMLImageElement, x: number, y: number) => {
    emote.style.left = `${x}px`;
    emote.style.top = `${y}px`;
  };

  const placeEmoteInBackground = (emoteUrl: string) => {
    const emote = createEmote(emoteUrl);
    let x: number;
    let y: number;

    do {
      x = Math.random() * (backgroundCanvasRef.current?.width || 0);
      y = Math.random() * (backgroundCanvasRef.current?.height || 0);
    } while (!isWithinBackground(x, y));

    setPosition(emote, x, y);
    emote.style.transform = 'translate(-50%, -50%)';
    if (backgroundContainerRef.current) {
      backgroundContainerRef.current.appendChild(emote);
    }

    setEmotes((prevEmotes) => {
      const newEmotes = [...prevEmotes, emote];
      if (newEmotes.length > getConfig().Emote.MaxEmoteCount) {
        const oldestEmote = newEmotes.shift();
        if (oldestEmote && backgroundContainerRef.current) {
          backgroundContainerRef.current.removeChild(oldestEmote);
        }
      }
      return newEmotes;
    });
  };

  return { emotes, placeEmoteInBackground, backgroundContainerRef };
};

export default useEmotes;
