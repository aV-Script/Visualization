import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  Chip,
  Container,
} from "@mui/material";
import { MidiNumbers } from "react-piano";
import PianoKeyboard from "../components/PianoKeyboard";
import {
  BASIC_INTERVALS,
  ALTERED_INTERVALS,
  EXTENDED_INTERVALS,
} from "../constants/music";
import { Interval, Feedback } from "../types/music";
import useSound from "use-sound";

const firstNote = MidiNumbers.fromNote("c4");
const lastNote = MidiNumbers.fromNote("c6");

type Difficulty = "basic" | "altered" | "extended";

export default function IntervalExercise() {
  const navigate = useNavigate();

  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [interval, setInterval] = useState<Interval | null>(null);
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [disabled, setDisabled] = useState(false);

  const rootNoteRef = useRef<number | null>(null);
  const correctStreakRef = useRef(0);

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

  const getRandomNoteInRange = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const generateRootNote = useCallback((intervalSemitones: number): number => {
    const maxRoot = lastNote - intervalSemitones;
    return getRandomNoteInRange(firstNote, maxRoot);
  }, []);

  const generateExercise = useCallback(() => {
    if (!difficulty) return;

    const intervals = getIntervalsForDifficulty(difficulty).filter(
      (intv) => intv.semitones <= (lastNote - firstNote)
    );

    const randomInterval = intervals[Math.floor(Math.random() * intervals.length)];

    if (rootNoteRef.current === null || correctStreakRef.current >= 10) {
      rootNoteRef.current = generateRootNote(randomInterval.semitones);
      correctStreakRef.current = 0;
    }

    setInterval(randomInterval);
    setSelectedNote(null);
    setFeedback(null);
  }, [difficulty, getIntervalsForDifficulty, generateRootNote]);

  useEffect(() => {
    if (difficulty) generateExercise();
  }, [difficulty, generateExercise]);

  const [playCorrect] = useSound("/Visualization/sounds/correct.mp3");
  const [playWrong] = useSound("/Visualization/sounds/wrong.mp3");

  const handleNoteClick = useCallback(
    (midiNumber: number) => {
      if (disabled || midiNumber === rootNoteRef.current) return;
      if (rootNoteRef.current === null || interval === null) return;

      setDisabled(true);
      setSelectedNote(midiNumber);

      const expectedNote = rootNoteRef.current + interval.semitones;
      const correct = midiNumber === expectedNote;

      setFeedback({
        severity: correct ? "success" : "error",
        text: correct ? "Corretto" : "Sbagliato",
      });

      if (correct) {
        playCorrect();
        setCorrectCount((c) => c + 1);
        correctStreakRef.current += 1;

        setTimeout(() => {
          setSelectedNote(null);
          setFeedback(null);
          generateExercise();
          setDisabled(false);
        }, 2000);
      } else {
        playWrong();
        setWrongCount((w) => w + 1);
        correctStreakRef.current = 0;

        setTimeout(() => {
          setSelectedNote(null);
          setFeedback(null);
          setDisabled(false);
        }, 2000);
      }
    },
    [interval, disabled, generateExercise, playCorrect, playWrong]
  );

  if (!difficulty) {
    return (
      <Container sx={{ p: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Scegli la difficoltà
          </Typography>
          <Stack spacing={2} mt={2}>
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
        <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center" alignItems="center">
          {interval && rootNoteRef.current !== null && (
            <Chip
              label={`${interval.name} di ${MidiNumbers.getAttributes(rootNoteRef.current).note}`}
              sx={{
                fontSize: "1.1rem",
                fontWeight: "bold",
                px: 2,
                bgcolor:
                  feedback?.severity === "success"
                    ? "success.main"
                    : feedback?.severity === "error"
                    ? "error.main"
                    : "default",
                color: feedback ? "white" : "default",
              }}
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

        <Box mt={2}>
          <PianoKeyboard
            noteRange={{ first: firstNote, last: lastNote }}
            onNoteClick={handleNoteClick}
            activeNotes={[rootNoteRef.current, selectedNote].filter((n): n is number => n !== null)}
          />
        </Box>

        <Stack direction="row" spacing={2} mt={4} flexWrap="wrap" justifyContent="center">
          <Chip label={`Corrette: ${correctCount}`} color="success" />
          <Chip label={`Sbagliate: ${wrongCount}`} color="error" />
          <Chip
            label={`Serie Corretta: ${correctStreakRef.current}`}
            color={correctStreakRef.current >= 10 ? "success" : "info"}
          />
        </Stack>

        <Box mt={4} alignSelf="flex-start">
          <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
            Torna indietro
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
