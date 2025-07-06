import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Paper,
  Stack,
  Chip,
  Alert,
} from "@mui/material";
import { MidiNumbers } from "react-piano";
import PianoKeyboard from "../components/PianoKeyboard";

const ALL_KEYS = [
  "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B",
];

function generateMajorScale(key) {
  const chromatic = [
    "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B",
  ];
  const intervals = [2, 2, 1, 2, 2, 2, 1];
  let startIndex = chromatic.indexOf(key);
  let scale = [chromatic[startIndex]];
  let currentIndex = startIndex;
  intervals.forEach((step) => {
    currentIndex = (currentIndex + step) % chromatic.length;
    scale.push(chromatic[currentIndex]);
  });
  scale.pop(); // rimuovi ultima perché è ottava
  return scale;
}

export default function MajorScaleExercise({ onBack }) {
  const firstNote = MidiNumbers.fromNote("c4");
  const lastNote = MidiNumbers.fromNote("b5");

  // Nota base random
  const [rootNote, setRootNote] = useState(null);
  const [userInput, setUserInput] = useState([]);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    // Genera nota casuale all'inizio o al reset
    const randomKey =
      ALL_KEYS[Math.floor(Math.random() * ALL_KEYS.length)];
    setRootNote(randomKey);
    setUserInput([]);
    setFeedback(null);
  }, []);

  const scale = rootNote ? generateMajorScale(rootNote) : [];

  function noteNameFromMidi(midiNumber) {
    return MidiNumbers.getAttributes(midiNumber).note;
  }

  function onNoteClick(midiNumber) {
    const note = noteNameFromMidi(midiNumber);
    // Permetti solo fino a 7 note e nessun duplicato
    if (userInput.length < scale.length && !userInput.includes(note)) {
      setUserInput([...userInput, note]);
    }
  }

  function checkAnswer() {
    const isCorrect = scale.every((note, i) => note === userInput[i]);
    setFeedback({
      severity: isCorrect ? "success" : "error",
      text: isCorrect
        ? `Bravo! Scala maggiore di ${rootNote} corretta.`
        : `Errore. Scala corretta: ${scale.join(", ")}`,
    });
  }

  function resetExercise() {
    const randomKey =
      ALL_KEYS[Math.floor(Math.random() * ALL_KEYS.length)];
    setRootNote(randomKey);
    setUserInput([]);
    setFeedback(null);
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Inserisci la scala maggiore di:
          <strong> {rootNote}</strong>
        </Typography>
        <Typography variant="body2" gutterBottom>
          Seleziona le note della scala maggiore in ordine corretto.
        </Typography>

        <Box mt={2}>
          <PianoKeyboard
            noteRange={{ first: firstNote, last: lastNote }}
            onNoteClick={onNoteClick}
            activeNotes={userInput.map((note) =>
              MidiNumbers.fromNote(note)
            )}
          />
        </Box>

        <Box mt={2}>
          <Typography>Note selezionate:</Typography>
          <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
            {userInput.length === 0 ? (
              <Typography>-</Typography>
            ) : (
              userInput.map((n, i) => <Chip key={i} label={n} />)
            )}
          </Stack>
        </Box>

        <Stack direction="row" spacing={2} mt={3} flexWrap="wrap">
          <Button
            variant="contained"
            color="success"
            onClick={checkAnswer}
            disabled={userInput.length !== scale.length}
          >
            Controlla risposta
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => {
              setUserInput([]);
              setFeedback(null);
            }}
          >
            Reset selezione
          </Button>
          <Button variant="outlined" color="primary" onClick={resetExercise}>
            Nuova scala
          </Button>
          <Button variant="outlined" color="secondary" onClick={onBack}>
            Torna indietro
          </Button>
        </Stack>

        {feedback && (
          <Alert severity={feedback.severity} sx={{ mt: 3 }}>
            {feedback.text}
          </Alert>
        )}
      </Paper>
    </Box>
  );
}