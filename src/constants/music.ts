import { Interval } from "../types/music";

export const INTERVALS: Interval[] = [

  { name: "2b", semitones: 1 },
  { name: "2", semitones: 2 },
  { name: "2#", semitones: 3 },

  { name: "3b", semitones: 3 },
  { name: "3", semitones: 4 },
  { name: "3#", semitones: 5 },

  { name: "4b", semitones: 4 },
  { name: "4", semitones: 5 },
  { name: "4#", semitones: 6 },

  { name: "5b", semitones: 6 },
  { name: "5", semitones: 7 },
  { name: "5#", semitones: 8 },

  { name: "6b", semitones: 8 },
  { name: "6", semitones: 9 },
  { name: "6#", semitones: 10 },

  { name: "7b", semitones: 10 },
  { name: "7", semitones: 11 },
  { name: "7#", semitones: 12 },

  { name: "9b", semitones: 13 },
  { name: "9", semitones: 14 },
  { name: "9#", semitones: 15 },

  { name: "11b", semitones: 16 },
  { name: "11", semitones: 17 },
  { name: "11#", semitones: 18 },

  { name: "13b", semitones: 20 },
  { name: "13", semitones: 21 },
  { name: "13#", semitones: 22 },
];


export const CHROMATIC = [
  "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"
];

export const ALL_KEYS = CHROMATIC.map(note => note + "4"); 

export const BASIC_INTERVALS = INTERVALS.filter(i => !i.name.includes("b") && !i.name.includes("#") && parseInt(i.name) <= 7);
export const ALTERED_INTERVALS = INTERVALS.filter(i =>
  (i.name.includes("b") || i.name.includes("#")) && parseInt(i.name) <= 7
);
export const EXTENDED_INTERVALS = INTERVALS.filter(i => parseInt(i.name) > 7);
