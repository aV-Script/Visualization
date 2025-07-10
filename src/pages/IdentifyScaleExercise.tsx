import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import { MidiNumbers } from "react-piano";
import PianoKeyboard from "../components/PianoKeyboard";
import { generateMajorScale } from "../utils/music";
import { ALL_KEYS } from "../constants/music";

export default function MajorScaleExercise() {
  const navigate = useNavigate();
  const firstNote = MidiNumbers.fromNote("C4");
  const lastNote = MidiNumbers.fromNote("B5");

  const [rootNote, setRootNote] = useState<string | null>(null);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetExercise = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const newRoot = ALL_KEYS[Math.floor(Math.random() * ALL_KEYS.length)];
    setRootNote(newRoot);
    setUserInput([]);
    setIsCorrect(null);
  }, []);

  useEffect(() => {
    resetExercise();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [resetExercise]);

  const clearInput = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setUserInput([]);
    setIsCorrect(null);
  };

  const handleNoteClick = (midiNumber: number) => {
    if (!rootNote || isCorrect !== null) return;

    const note = MidiNumbers.getAttributes(midiNumber).note;
    const scale = generateMajorScale(rootNote);

    if (userInput.length < scale.length && !userInput.includes(note)) {
      const newInput = [...userInput, note];
      setUserInput(newInput);

      if (newInput.length === scale.length) {
        const correct = scale.every((n, i) => n === newInput[i]);
        setIsCorrect(correct);

        if (correct) {
          setCorrectCount((c) => c + 1);
          timeoutRef.current = setTimeout(resetExercise, 2000);
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
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Scala maggiore di <strong>{rootNote}</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, textAlign: "center" }}>
          Seleziona le note della scala maggiore nell'ordine corretto.
        </Typography>

        <Box mt={2} sx={{ display: "flex", justifyContent: "center" }}>
          <PianoKeyboard
            noteRange={{ first: firstNote, last: lastNote }}
            onNoteClick={handleNoteClick}
            activeNotes={userInput.map((note) => MidiNumbers.fromNote(note))}
          />
        </Box>

        <Box mt={4} width="100%" textAlign="center">
          <Typography variant="subtitle1">Note selezionate</Typography>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            mt={1}
            flexWrap="wrap"
          >
            {userInput.length === 0 ? (
              <Typography sx={{ opacity: 0.6 }}>Nessuna nota selezionata</Typography>
            ) : (
              userInput.map((note, i) => (
                <Chip
                  key={i}
                  label={note}
                  color={
                    isCorrect === null
                      ? "default"
                      : isCorrect
                      ? "success"
                      : "error"
                  }
                  sx={{ fontWeight: "bold" }}
                />
              ))
            )}
          </Stack>
        </Box>

        <Stack
          direction="row"
          spacing={2}
          mt={4}
          width="100%"
          justifyContent="space-between"
          flexWrap="wrap"
          alignItems="center"
        >
          <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
            Indietro
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={clearInput}
            disabled={userInput.length === 0 && isCorrect === null}
          >
            Cancella selezione
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
