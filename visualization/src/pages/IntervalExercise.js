import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Stack,
  Alert,
  Chip,
  Paper,
  Divider,
} from "@mui/material";

const ALL_KEYS = [
  "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Ab", "B",
];

function generateMajorScale(key) {
  const chromatic = [
    "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Ab", "B",
  ];
  const intervals = [2, 2, 1, 2, 2, 2, 1];
  let startIndex = chromatic.indexOf(key);
  let scale = [chromatic[startIndex]];
  let currentIndex = startIndex;
  intervals.forEach((step) => {
    currentIndex = (currentIndex + step) % chromatic.length;
    scale.push(chromatic[currentIndex]);
  });
  scale.pop();
  return scale;
}

function generateSequence(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 7) + 1);
}

export default function IntervalExercise({ onBack }) {
  const [settings, setSettings] = useState(null);
  const [currentKey, setCurrentKey] = useState(null);
  const [currentSeries, setCurrentSeries] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (settings) {
      setCurrentKey(settings.key);
      setCurrentSeries(1);
    }
  }, [settings]);

  useEffect(() => {
    if (settings && currentKey) {
      setSequence(generateSequence(settings.length));
      setUserInput([]);
      setFeedback(null);
    }
  }, [currentSeries, currentKey, settings]);

  useEffect(() => {
    if (!settings) return;
    if (
      currentSeries > 1 &&
      settings.changeKeyEvery > 0 &&
      (currentSeries - 1) % settings.changeKeyEvery === 0
    ) {
      const newKey = ALL_KEYS[Math.floor(Math.random() * ALL_KEYS.length)];
      setCurrentKey(newKey);
    } else if (currentSeries === 1) {
      setCurrentKey(settings.key);
    }
  }, [currentSeries, settings]);

  const scale = currentKey ? generateMajorScale(currentKey) : [];

  function checkAnswer() {
    const expected = sequence.map((pos) => scale[pos - 1]);
    const isCorrect = expected.every((note, i) => note === userInput[i]);
    setFeedback({
      severity: isCorrect ? "success" : "error",
      text: isCorrect
        ? "✅ Corretto!"
        : `❌ Errato. Soluzione: ${expected.join(", ")}`,
    });
    if (isCorrect && currentSeries < settings.numSeries) {
      setTimeout(() => setCurrentSeries((prev) => prev + 1), 1000);
    }
  }

  function SettingsForm() {
    const [key, setKey] = useState("C");
    const [length, setLength] = useState(4);
    const [numSeries, setNumSeries] = useState(5);
    const [changeKeyEvery, setChangeKeyEvery] = useState(1);

    function handleSubmit(e) {
      e.preventDefault();
      setSettings({ key, length, numSeries, changeKeyEvery });
    }

    return (
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Configurazione Esercizio
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Tonalità iniziale</InputLabel>
                <Select
                  value={key}
                  label="Tonalità iniziale"
                  onChange={(e) => setKey(e.target.value)}
                >
                  {ALL_KEYS.map((k) => (
                    <MenuItem key={k} value={k}>
                      {k}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Lunghezza serie"
                type="number"
                inputProps={{ min: 1 }}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                fullWidth
              />
              <TextField
                label="Numero di serie"
                type="number"
                inputProps={{ min: 1 }}
                value={numSeries}
                onChange={(e) => setNumSeries(Number(e.target.value))}
                fullWidth
              />
              <TextField
                label="Cambia tonalità ogni N serie (0 = mai)"
                type="number"
                inputProps={{ min: 0 }}
                value={changeKeyEvery}
                onChange={(e) => setChangeKeyEvery(Number(e.target.value))}
                fullWidth
              />

              <Button variant="contained" type="submit" size="large">
                Avvia esercizio
              </Button>
              <Button variant="outlined" color="secondary" onClick={onBack}>
                Torna alla Home
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (!settings) return <SettingsForm />;

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h6">
          Esercizio {currentSeries} di {settings.numSeries}
        </Typography>
        <Typography gutterBottom>
          Tonalità corrente: <strong>{currentKey}</strong>
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" gutterBottom>
          Posizioni intervalli: {sequence.join(" - ")}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Seleziona le note:</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
            {ALL_KEYS.map((note) => (
              <Button
                key={note}
                variant={userInput.includes(note) ? "contained" : "outlined"}
                onClick={() =>
                  userInput.length < sequence.length &&
                  setUserInput([...userInput, note])
                }
              >
                {note}
              </Button>
            ))}
          </Stack>
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
            disabled={userInput.length !== sequence.length}
          >
            Controlla risposta
          </Button>
          <Button variant="outlined" color="warning" onClick={() => {
            setUserInput([]);
            setFeedback(null);
          }}>
            Reset
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setSettings(null)}
          >
            Impostazioni
          </Button>
          <Button variant="outlined" color="secondary" onClick={onBack}>
            Home
          </Button>
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
