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
import {generateMajorScale} from "../utils/music";
import {ALL_KEYS} from "../constants/music";

// --- Types ---
interface MajorScaleExerciseProps {
  onBack: () => void;
}

interface Feedback {
  severity: "success" | "error";
  text: string;
}

export default function MajorScaleExercise({ onBack }: MajorScaleExerciseProps) {
  const firstNote = MidiNumbers.fromNote("C4");
  const lastNote = MidiNumbers.fromNote("B5");

  const [rootNote, setRootNote] = useState<string | null>(null);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  useEffect(() => {
    resetExercise();
  }, []);

  const scale = rootNote ? generateMajorScale(rootNote) : [];

  function noteNameFromMidi(midiNumber: number): string {
    return MidiNumbers.getAttributes(midiNumber).note;
  }

  function onNoteClick(midiNumber: number) {
    const note = noteNameFromMidi(midiNumber);
    if (userInput.length < scale.length && !userInput.includes(note)) {
      setUserInput([...userInput, note]);
    }
  }

       const checkAnswer = React.useCallback(() => {
      const isCorrect = scale.every((note, i) => note === userInput[i]);
      setFeedback({
        severity: isCorrect ? "success" : "error",
        text: isCorrect
          ? `Bravo! Scala maggiore di ${rootNote} corretta.`
          : `Errore. Scala corretta: ${scale.join(", ")}`,
      });

      if (isCorrect) {
        setCorrectCount(c => c + 1);
        setTimeout(() => resetExercise(), 1500);
      } else {
        setWrongCount(w => w + 1);
      }
    }, [scale, userInput, rootNote]);


    useEffect(() => {
      if (
        userInput.length === scale.length &&
        scale.length > 0 &&
        feedback === null 
      ) {
        checkAnswer();
      }
    }, [userInput, scale, feedback, checkAnswer]);


  function resetExercise() {
    const randomKey = ALL_KEYS[Math.floor(Math.random() * ALL_KEYS.length)];
    setRootNote(randomKey);
    setUserInput([]);
    setFeedback(null);
  }

  function nextExercise() {
    resetExercise();
  }

  return (
    <Box sx={{ mx: "auto", p: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Inserisci la scala maggiore di: <strong>{rootNote}</strong>
        </Typography>
        <Typography variant="body2" gutterBottom>
          Seleziona le note della scala maggiore in ordine corretto.
        </Typography>

        <Box mt={2}>
          <PianoKeyboard
            noteRange={{ first: firstNote, last: lastNote }}
            onNoteClick={onNoteClick}
            activeNotes={userInput.map(note => MidiNumbers.fromNote(note))}
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

        <Stack direction="row" spacing={2} mt={3} flexWrap="wrap" alignItems="center">
          <Button
            variant="outlined"
            color="primary"
            onClick={nextExercise}
            disabled={!feedback || feedback.severity !== "success"}
          >
            Reset selezione
          </Button>
          <Button variant="outlined" color="secondary" onClick={onBack}>
            Torna indietro
          </Button>
          <Box sx={{ ml: "auto", display: "flex", gap: 2 }}>
            <Chip label={`Corrette: ${correctCount}`} color="success" />
            <Chip label={`Sbagliate: ${wrongCount}`} color="error" />
          </Box>
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
