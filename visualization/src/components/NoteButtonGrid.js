import React from "react";

const NOTES = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];

export default function NoteButtonGrid({ onSelect }) {
  return (
    <div className="grid grid-cols-6 gap-2 mb-4">
      {NOTES.map((note) => (
        <button
          key={note}
          className="bg-blue-200 text-black py-2 rounded hover:bg-blue-300"
          onClick={() => onSelect(note)}
        >
          {note}
        </button>
      ))}
    </div>
  );
}
