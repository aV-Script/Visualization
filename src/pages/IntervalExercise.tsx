import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  Chip,
  Alert,
  Container
} from "@mui/material";
import { MidiNumbers } from "react-piano";
import PianoKeyboard from "../components/PianoKeyboard";
import { INTERVALS } from "../constants/music";
import { Interval, Feedback } from "../types/music";

const getRandomNoteInRange = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const filterNonNull = <T,>(arr: (T | null)[]): T[] => arr.filter((x): x is T => x !== null);

const getFeedbackText = (correct: boolean, interval: Interval) => {
  if (correct) return `Corretto`;
  return `Sbagliato`;
};

const firstNote = MidiNumbers.fromNote("c4");
const lastNote = MidiNumbers.fromNote("c7");

export default function IntervalExercise() {
  const navigate = useNavigate();
  const [rootNote, setRootNote] = useState<number | null>(null);
  const [interval, setInterval] = useState<Interval | null>(null);
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const generateExercise = useCallback(() => {
    const randomInterval = INTERVALS[Math.floor(Math.random() * INTERVALS.length)];
    const root = getRandomNoteInRange(firstNote, lastNote - randomInterval.semitones);
    setRootNote(root);
    setInterval(randomInterval);
    setSelectedNote(null);
    setFeedback(null);
  }, []);

  useEffect(() => {
    generateExercise();
  }, [generateExercise]);

  const handleNoteClick = useCallback(
    (midiNumber: number) => {
      if (midiNumber === rootNote) return;
      setSelectedNote(midiNumber);

      if (rootNote === null || interval === null) return;

      const expectedNote = rootNote + interval.semitones;
      const correct = midiNumber === expectedNote;

      setFeedback({
        severity: correct ? "success" : "error",
        text: getFeedbackText(correct, interval),
      });

      if (correct) {
        setCorrectCount((c) => c + 1);
        setTimeout(() => {
          generateExercise();
        }, 1000);
      } else {
        setWrongCount((w) => w + 1);
      }
    },
    [rootNote, interval, generateExercise]
  );

  return (
    <Container sx={{ mx: "auto", p: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Trova l'intervallo: <strong>{interval?.name}</strong>
        </Typography>
        <Typography variant="body2" gutterBottom>
          Clicca la nota che forma un intervallo di <strong>{interval?.name}</strong> sopra la nota data.
        </Typography>

        <Box mt={2}>
          <PianoKeyboard
            noteRange={{ first: firstNote, last: lastNote }}
            onNoteClick={handleNoteClick}
            activeNotes={filterNonNull([rootNote, selectedNote])}
          />
        </Box>

        <Box mt={2}>
          <Typography>Note selezionate:</Typography>
          <Stack direction="row" spacing={1} mt={1}>
            {rootNote !== null && (
              <Chip label={`Nota iniziale: ${MidiNumbers.getAttributes(rootNote).note}`} />
            )}
            {selectedNote !== null && (
              <Chip
                label={`Nota selezionata: ${MidiNumbers.getAttributes(selectedNote).note}`}
                color="primary"
              />
            )}
          </Stack>
        </Box>

        <Stack direction="row" spacing={2} mt={3} flexWrap="wrap" alignItems="center">
          <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
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
    </Container>
  );
}
