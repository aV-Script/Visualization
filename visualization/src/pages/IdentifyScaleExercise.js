import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Alert,
} from "@mui/material";

const ALL_KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const generateMajorScale = (key, direction = "asc") => {
  const chromatic = [...ALL_KEYS];
  const intervals = [2, 2, 1, 2, 2, 2, 1];
  let scale = [key];
  let index = chromatic.indexOf(key);

  if (direction === "asc") {
    for (let i = 0; i < intervals.length - 1; i++) {
      index = (index + intervals[i]) % chromatic.length;
      scale.push(chromatic[index]);
    }
  } else {
    for (let i = 0; i < intervals.length - 1; i++) {
      index = (index - intervals[i] + chromatic.length) % chromatic.length;
      scale.push(chromatic[index]);
    }
    scale = scale.reverse();
  }

  return scale;
};

export default function IdentifyScaleExercise({ onBack }) {
  const [correctKey, setCorrectKey] = useState("");
  const [scaleNotes, setScaleNotes] = useState([]);
  const [userNotes, setUserNotes] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [direction, setDirection] = useState("asc");

  useEffect(() => {
    generateNewScale();
  }, [direction]);

  const generateNewScale = () => {
    const randomKey = ALL_KEYS[Math.floor(Math.random() * ALL_KEYS.length)];
    const realDirection =
      direction === "alt"
        ? Math.random() < 0.5
          ? "asc"
          : "desc"
        : direction;

    setCorrectKey(randomKey);
    setScaleNotes(generateMajorScale(randomKey, realDirection));
    setUserNotes([]);
    setFeedback(null);
  };

  const handleNoteClick = (note) => {
    if (userNotes.length < scaleNotes.length) {
      setUserNotes([...userNotes, note]);
    }
  };

  const handleReset = () => {
    setUserNotes([]);
    setFeedback(null);
  };

  const handleSubmit = () => {
    const isCorrect =
      userNotes.length === scaleNotes.length &&
      userNotes.every((note, i) => note === scaleNotes[i]);

    setFeedback(
      isCorrect
        ? { severity: "success", text: "✅ Corretto! Hai inserito la scala giusta." }
        : { severity: "error", text: `❌ Errato. La scala corretta era: ${scaleNotes.join(" - ")}` }
    );
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 4 }}>
      <Paper elevation={6} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Inserisci le note della scala maggiore
        </Typography>

        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Direzione scala:
          </Typography>
          <ToggleButtonGroup
            value={direction}
            exclusive
            onChange={(e, val) => val && setDirection(val)}
            color="primary"
          >
            <ToggleButton value="asc">Ascendente</ToggleButton>
            <ToggleButton value="desc">Discendente</ToggleButton>
            <ToggleButton value="alt">Alternata</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Typography sx={{ mb: 2 }}>
          Tonalità da indovinare: <strong>{correctKey}</strong>
        </Typography>

        <Typography variant="subtitle1">Seleziona le note (clicca i bottoni):</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
          {ALL_KEYS.map((note) => (
            <Button
              key={note}
              variant={userNotes.includes(note) ? "contained" : "outlined"}
              onClick={() => handleNoteClick(note)}
              disabled={userNotes.length >= scaleNotes.length}
            >
              {note}
            </Button>
          ))}
        </Stack>

        <Box mt={2}>
          <Typography>Note selezionate:</Typography>
          <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" minHeight={40}>
            {userNotes.length === 0 ? (
              <Typography color="text.secondary">-</Typography>
            ) : (
              userNotes.map((note, i) => <Button key={i} size="small" onClick={() => {
                // Permetti di togliere la nota cliccata (optional)
                setUserNotes(userNotes.filter((_, idx) => idx !== i));
                setFeedback(null);
              }}>{note} ×</Button>)
            )}
          </Stack>
        </Box>

        <Stack direction="row" spacing={2} mt={3} flexWrap="wrap">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={userNotes.length !== scaleNotes.length}
          >
            Verifica
          </Button>
          <Button variant="outlined" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="outlined" color="secondary" onClick={onBack}>
            Torna alla home
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
