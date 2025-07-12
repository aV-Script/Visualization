import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  Chip,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function IntervalExercise() {
  const navigate = useNavigate();

  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [interval, setInterval] = useState<Interval | null>(null);
  const [rootNote, setRootNote] = useState<number | null>(null);
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState<Set<string>>(new Set());

  const notesForTable = Array.from({ length: 12 }, (_, i) => firstNote + i);

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

  const [shuffledIntervals, setShuffledIntervals] = useState<Interval[]>([]);

  useEffect(() => {
    if (!difficulty) return;
    const intervals = getIntervalsForDifficulty(difficulty).filter(
      (intv) => intv.semitones <= (lastNote - firstNote)
    );
    setShuffledIntervals(shuffleArray(intervals));
    setInterval(null);
    setRootNote(null);
    setSelectedNote(null);
    setFeedback(null);
    setCorrectStreak(0);
    setDisabled(false);
    setCorrectAnswers(new Set());
  }, [difficulty, getIntervalsForDifficulty]);

  const handleSelectQuestion = (note: number, intv: Interval) => {
    setRootNote(note);
    setInterval(intv);
    setSelectedNote(null);
    setFeedback(null);
    setDisabled(false);
  };

  const [playCorrect] = useSound("/Visualization/sounds/correct.mp3");
  const [playWrong] = useSound("/Visualization/sounds/wrong.mp3");

  const handleNoteClick = useCallback(
    (midiNumber: number) => {
      if (disabled || rootNote === null || interval === null || midiNumber === rootNote) return;

      setDisabled(true);
      setSelectedNote(midiNumber);

      const expectedNote = rootNote + interval.semitones;
      const correct = midiNumber === expectedNote;

      setFeedback({
        severity: correct ? "success" : "error",
        text: correct ? "Corretto!" : "Sbagliato",
      });

      if (correct) {
        playCorrect();
        setCorrectStreak((s) => s + 1);
        setCorrectAnswers((prev) => new Set(prev).add(`${rootNote}_${interval.name}`));
      } else {
        playWrong();
        setCorrectStreak(0);
      }

      setTimeout(() => {
        setSelectedNote(null);
        setFeedback(null);
        setInterval(null);
        setRootNote(null);
        setDisabled(false);
      }, 2000);
    },
    [interval, rootNote, disabled, playCorrect, playWrong]
  );

  if (!difficulty) {
    return (
      <Container sx={{ p: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Allenamento Intervalli – Memoria e Rapidità
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Seleziona un livello di difficoltà per allenare la tua capacità di
            calcolare velocemente la distanza tra due note.
          </Typography>
          <Stack spacing={2}>
            <Button variant="contained" onClick={() => setDifficulty("basic")}>
              Intervalli di base (semplici)
            </Button>
            <Button variant="contained" onClick={() => setDifficulty("altered")}>
              Intervalli con alterazioni (maggiore difficoltà)
            </Button>
            <Button variant="contained" onClick={() => setDifficulty("extended")}>
              Tutti gli intervalli (inclusi quelli estesi)
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h6" mb={2}>
          Seleziona una nota (colonna) e un intervallo (riga) per iniziare l’esercizio
        </Typography>

        <TableContainer sx={{ overflowX: "auto", maxHeight: 500 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#424242", color: "white" }}>
                  I - N
                </TableCell>
                {notesForTable.map((note) => (
                  <TableCell
                    key={note}
                    align="center"
                    sx={{
                      backgroundColor: "#616161",
                      color: "white",
                      userSelect: "none",
                      fontWeight: "medium",
                    }}
                  >
                    {MidiNumbers.getAttributes(note).note}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {shuffledIntervals.map((intv) => (
                <TableRow key={intv.name}>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#757575",
                      color: "white",
                      userSelect: "none",
                    }}
                  >
                    {intv.name}
                  </TableCell>
                  {notesForTable.map((note) => {
                    const valid = note + intv.semitones <= lastNote;
                    const key = `${note}_${intv.name}`;
                    const isCorrect = correctAnswers.has(key);
                    const isSelected = rootNote === note && interval?.name === intv.name;

                    return (
                      <TableCell
                        key={note}
                        align="center"
                        onClick={() => valid && handleSelectQuestion(note, intv)}
                        sx={{
                          cursor: valid ? "pointer" : "not-allowed",
                          backgroundColor: isSelected
                            ? "#0288d1"
                            : isCorrect
                            ? "#388e3c"
                            : valid
                            ? "#bbdefb"
                            : "#e0e0e0",
                          color: isCorrect || isSelected ? "white" : "black",
                          userSelect: "none",
                          fontWeight: isCorrect ? "bold" : "normal",
                          transition: "background-color 0.3s",
                        }}
                        title={
                          valid
                            ? isCorrect
                              ? "Già risposto correttamente"
                              : "Clicca per selezionare"
                            : "Intervallo fuori range"
                        }
                      >
                        {valid ? (isCorrect ? "✓" : "") : "✖"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={4}>
          {interval && rootNote !== null && (
            <Box
              display="flex"
              gap={2}
              flexWrap="wrap"
              justifyContent="center"
              alignItems="center"
              mb={2}
            >
              <Chip
                label={`${interval.name} da ${MidiNumbers.getAttributes(rootNote).note}`}
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
              {selectedNote !== null && (
                <Chip
                  label={`${MidiNumbers.getAttributes(selectedNote).note}`}
                  color="primary"
                  sx={{ fontSize: "1.1rem", px: 2 }}
                />
              )}
            </Box>
          )}

          <Box mt={2}>
            <PianoKeyboard
              noteRange={{ first: firstNote, last: lastNote }}
              onNoteClick={handleNoteClick}
              activeNotes={[rootNote, selectedNote].filter((n): n is number => n !== null)}
            />
          </Box>

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
              Indietro
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => setDifficulty(null)}>
              Cambia difficoltà
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
