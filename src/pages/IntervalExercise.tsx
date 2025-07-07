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
import {
  BASIC_INTERVALS,
  ALTERED_INTERVALS,
  EXTENDED_INTERVALS,
} from "../constants/music";
import { Interval, Feedback } from "../types/music";

const getRandomNoteInRange = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const filterNonNull = <T,>(arr: (T | null)[]): T[] =>
  arr.filter((x): x is T => x !== null);

const getFeedbackText = (correct: boolean) =>
  correct ? "Corretto" : "Sbagliato";

const firstNote = MidiNumbers.fromNote("c4");
const lastNote = MidiNumbers.fromNote("c7");

type Difficulty = "basic" | "altered" | "extended";

export default function IntervalExercise() {
  const navigate = useNavigate();

  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [rootNote, setRootNote] = useState<number | null>(null);
  const [interval, setInterval] = useState<Interval | null>(null);
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const getIntervalsForDifficulty = useCallback((level: Difficulty): Interval[] => {
    switch (level) {
      case "basic":
        return BASIC_INTERVALS;
      case "altered":
        return [...BASIC_INTERVALS, ...ALTERED_INTERVALS];
      case "extended":
        return [...BASIC_INTERVALS, ...ALTERED_INTERVALS, ...EXTENDED_INTERVALS];
    }
  }, []);

  const generateRootNote = useCallback((intervalSemitones: number): number => {
    return getRandomNoteInRange(firstNote, lastNote - intervalSemitones);
  }, []);

  const generateExercise = useCallback(() => {
    if (!difficulty) return;

    const availableIntervals = getIntervalsForDifficulty(difficulty);
    const randomInterval =
      availableIntervals[Math.floor(Math.random() * availableIntervals.length)];

    setInterval(randomInterval);

    if (rootNote === null || correctStreak >= 10) {
      const newRoot = generateRootNote(randomInterval.semitones);
      setRootNote(newRoot);
      setCorrectStreak(0);
    }

    setSelectedNote(null);
    setFeedback(null);
  }, [difficulty, correctStreak, getIntervalsForDifficulty, rootNote, generateRootNote]);

  useEffect(() => {
    if (difficulty) {
      generateExercise();
    }
  }, [difficulty, generateExercise]);
  
  const handleNoteClick = useCallback(
    (midiNumber: number) => {
      if (midiNumber === rootNote) return;
      setSelectedNote(midiNumber);

      if (rootNote === null || interval === null) return;

      const expectedNote = rootNote + interval.semitones;
      const correct = midiNumber === expectedNote;

      setFeedback({
        severity: correct ? "success" : "error",
        text: getFeedbackText(correct),
      });

      if (correct) {
        setCorrectCount((c) => c + 1);
        setCorrectStreak((s) => s + 1);
        setTimeout(() => {
          generateExercise();
        }, 1000);
      } else {
        setWrongCount((w) => w + 1);
      }
    },
    [rootNote, interval, generateExercise]
  );

  if (!difficulty) {
    return (
      <Container sx={{ p: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Scegli la difficoltà
          </Typography>
          <Stack spacing={2} direction="column" mt={2}>
            <Button variant="contained" onClick={() => setDifficulty("basic")}>
              Gradi normali
            </Button>
            <Button variant="contained" onClick={() => setDifficulty("altered")}>
              Gradi con alterazione
            </Button>
            <Button variant="contained" onClick={() => setDifficulty("extended")}>
               Gradi con alterazione + Estensioni
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box display="flex" alignItems="center" justifyContent="center" gap={2} flexWrap="wrap">
          {interval && rootNote !== null && (
            <Chip
              label={`${interval.name} di ${MidiNumbers.getAttributes(rootNote).note}`}
              color="default"
              sx={{ fontSize: "1.1rem", fontWeight: "bold", px: 2 }}
            />
          )}
          {selectedNote !== null && (
            <Chip
              label={`${MidiNumbers.getAttributes(selectedNote).note}`}
              color="primary"
              sx={{ fontSize: "1.1rem", px: 2 }}
            />
          )}
        </Box>

        <Box mt={2} justifyContent="center">
          <PianoKeyboard
            noteRange={{ first: firstNote, last: lastNote }}
            onNoteClick={handleNoteClick}
            activeNotes={filterNonNull([rootNote, selectedNote])}
          />
        </Box>

        <Stack direction="row" spacing={2} mt={4} justifyContent="center">
          <Chip label={`Corrette: ${correctCount}`} color="success" />
          <Chip label={`Sbagliate: ${wrongCount}`} color="error" />
        </Stack>

        {feedback && (
          <Alert severity={feedback.severity} sx={{ mt: 3, textAlign: "center" }}>
            {feedback.text}
          </Alert>
        )}

        <Box sx={{ mt: 4, alignSelf: "flex-start" }}>
          <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
            Torna indietro
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
