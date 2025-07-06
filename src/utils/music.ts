import { CHROMATIC } from "../constants/music";

export const getRandomNoteInRange = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export function generateMajorScale(keyWithOctave: string): string[] {
  const intervals = [2, 2, 1, 2, 2, 2, 1];

  const note = keyWithOctave.slice(0, -1);
  let octave = parseInt(keyWithOctave.slice(-1));

  let startIndex = CHROMATIC.indexOf(note);
  if (startIndex === -1) return [];

  const scale = [keyWithOctave];
  let currentIndex = startIndex;

  intervals.forEach((step) => {
    currentIndex += step;
    if (currentIndex >= CHROMATIC.length) {
      currentIndex -= CHROMATIC.length;
      octave += 1;
    }
    scale.push(CHROMATIC[currentIndex] + octave);
  });

  scale.pop(); 
  return scale;
}
