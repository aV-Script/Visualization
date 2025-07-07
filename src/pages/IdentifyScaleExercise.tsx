import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  Paper,
  Stack,
  Chip,
  Alert,
  Container,
} from "@mui/material";
import { MidiNumbers } from "react-piano";
import PianoKeyboard from "../components/PianoKeyboard";
import { generateMajorScale } from "../utils/music";
import { ALL_KEYS } from "../constants/music";

interface Feedback {
  severity: "success" | "error";
  text: string;
}

export default function MajorScaleExercise() {
  const navigate = useNavigate();

  const firstNote = MidiNumbers.fromNote("C4");
  const lastNote = MidiNumbers.fromNote("B5");

  const [rootNote, setRootNote] = useState<string | null>(null);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const generateScale = useCallback((): string[] => {
    return rootNote ? generateMajorScale(rootNote) : [];
  }, [rootNote]);

  const resetExercise = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const randomKey = ALL_KEYS[Math.floor(Math.random() * ALL_KEYS.length)];
    setRootNote(randomKey);
    setUserInput([]);
    setFeedback(null);
  }, []);

  useEffect(() => {
    resetExercise();
  }, [resetExercise]);

  const clearInput = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setUserInput([]);
    setFeedback(null);
  };

  const onNoteClick = (midiNumber: number) => {
    const note = MidiNumbers.getAttributes(midiNumber).note;
    const scale = generateScale();

    if (userInput.length < scale.length && !userInput.includes(note)) {
      const newInput = [...userInput, note];
      setUserInput(newInput);

      if (newInput.length === scale.length) {
        const isCorrect = scale.every((n, i) => n === newInput[i]);
        setFeedback({
          severity: isCorrect ? "success" : "error",
          text: isCorrect
            ? `Bravo! Scala maggiore di ${rootNote} corretta.`
            : `Errore. Scala corretta: ${scale.join(", ")}`,
        });

        if (isCorrect) {
          setCorrectCount((c) => c + 1);
          timeoutRef.current = setTimeout(() => resetExercise(), 1500);
        } else {
          setWrongCount((w) => w + 1);
        }
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography variant="h5" gutterBottom>
          Scala maggiore di <strong>{rootNote}</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Seleziona le note della scala maggiore nell'ordine corretto.
        </Typography>

        <Box mt={2} justifyContent="center">
          <PianoKeyboard
            noteRange={{ first: firstNote, last: lastNote }}
            onNoteClick={onNoteClick}
            activeNotes={userInput.map((note) => MidiNumbers.fromNote(note))}
          />
        </Box>

        <Box mt={4} textAlign="center" width="100%">
          <Typography variant="subtitle1">Note selezionate</Typography>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            mt={1}
            flexWrap="wrap"
          >
            {userInput.length === 0 ? (
              <Typography></Typography>
            ) : (
              userInput.map((n, i) => <Chip key={i} label={n} />)
            )}
          </Stack>
        </Box>

        {feedback && (
          <Alert severity={feedback.severity} sx={{ mt: 4 }}>
            {feedback.text}
          </Alert>
        )}

        <Stack
          direction="row"
          spacing={2}
          mt={4}
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          flexWrap="wrap"
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={clearInput}
            disabled={userInput.length === 0 && !feedback}
          >
            Cancella selezione
          </Button>

          <Box display="flex" gap={2}>
            <Chip label={`Corrette: ${correctCount}`} color="success" />
            <Chip label={`Sbagliate: ${wrongCount}`} color="error" />
          </Box>

          <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
            Torna indietro
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
