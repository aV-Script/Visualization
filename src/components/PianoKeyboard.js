import React from "react";
import { Piano } from "react-piano";
import "react-piano/dist/styles.css";

export default function PianoKeyboard({ noteRange, activeNotes, onNoteClick }) {
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
