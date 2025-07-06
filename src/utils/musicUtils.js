export const ALL_KEYS = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

export function generateMajorScale(key, direction = "asc") {
  const intervals = [2, 2, 1, 2, 2, 2, 1];
  let scale = [key];
  let index = ALL_KEYS.indexOf(key);

  for (let interval of intervals) {
    index = (index + interval) % ALL_KEYS.length;
    scale.push(ALL_KEYS[index]);
  }

  return direction === "desc" ? [...scale].reverse() : scale;
}

export function normalizeNote(note) {
  return note.replace("♯", "#").replace("♭", "b");
}
