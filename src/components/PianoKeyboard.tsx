import React from "react";
import { Piano } from "react-piano";
import "react-piano/dist/styles.css";

type PianoKeyboardProps = {
  noteRange: {
    first: number;
    last: number;
  };
  activeNotes: number[];
  onNoteClick: (midiNumber: number) => void;
};

export default function PianoKeyboard({
  noteRange,
  activeNotes,
  onNoteClick,
}: PianoKeyboardProps) {
  return (
    <Piano
      noteRange={noteRange}
      playNote={onNoteClick}
      stopNote={() => {}}
      activeNotes={activeNotes}
      width={600}
      disabled={false}
    />
  );
}
