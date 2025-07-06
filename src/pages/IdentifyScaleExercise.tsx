import React from "react";
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
import { generateMajorScale } from "../utils/music";
import { ALL_KEYS } from "../constants/music";

interface MajorScaleExerciseProps {
  onBack: () => void;
}

interface Feedback {
  severity: "success" | "error";
  text: string;
}

interface MajorScaleExerciseState {
  rootNote: string | null;
  userInput: string[];
  feedback: Feedback | null;
  correctCount: number;
  wrongCount: number;
}

export default class MajorScaleExercise extends React.Component<
  MajorScaleExerciseProps,
  MajorScaleExerciseState
> {
  firstNote = MidiNumbers.fromNote("C4");
  lastNote = MidiNumbers.fromNote("B5");
  timeoutId?: ReturnType<typeof setTimeout>;

  constructor(props: MajorScaleExerciseProps) {
    super(props);
    this.state = {
      rootNote: null,
      userInput: [],
      feedback: null,
      correctCount: 0,
      wrongCount: 0,
    };
  }

  componentDidMount() {
    this.resetExercise();
  }

  componentWillUnmount() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  noteNameFromMidi = (midiNumber: number): string => {
    return MidiNumbers.getAttributes(midiNumber).note;
  };

  generateScale = (): string[] => {
    const { rootNote } = this.state;
    return rootNote ? generateMajorScale(rootNote) : [];
  };

  onNoteClick = (midiNumber: number) => {
    const note = this.noteNameFromMidi(midiNumber);
    const { userInput } = this.state;
    const scale = this.generateScale();

    if (userInput.length < scale.length && !userInput.includes(note)) {
      this.setState(
        (prevState) => ({
          userInput: [...prevState.userInput, note],
        }),
        () => {
          // dopo aver aggiornato userInput, controlla la risposta
          this.checkAnswerIfNeeded();
        }
      );
    }
  };

  checkAnswerIfNeeded = () => {
    const { userInput, feedback } = this.state;
    const scale = this.generateScale();

    if (
      userInput.length === scale.length &&
      scale.length > 0 &&
      feedback === null
    ) {
      this.checkAnswer();
    }
  };

  checkAnswer = () => {
    const { userInput, rootNote } = this.state;
    const scale = this.generateScale();
    const isCorrect = scale.every((note, i) => note === userInput[i]);

    this.setState({
      feedback: {
        severity: isCorrect ? "success" : "error",
        text: isCorrect
          ? `Bravo! Scala maggiore di ${rootNote} corretta.`
          : `Errore. Scala corretta: ${scale.join(", ")}`,
      },
      correctCount: isCorrect ? this.state.correctCount + 1 : this.state.correctCount,
      wrongCount: !isCorrect ? this.state.wrongCount + 1 : this.state.wrongCount,
    });

    if (isCorrect) {
      this.timeoutId = setTimeout(() => this.resetExercise(), 1500);
    }
  };

  resetExercise = () => {
    if (this.timeoutId) clearTimeout(this.timeoutId);

    const randomKey = ALL_KEYS[Math.floor(Math.random() * ALL_KEYS.length)];
    this.setState({
      rootNote: randomKey,
      userInput: [],
      feedback: null,
    });
  };

  nextExercise = () => {
    this.resetExercise();
  };

  render() {
    const { rootNote, userInput, feedback, correctCount, wrongCount } = this.state;

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
              noteRange={{ first: this.firstNote, last: this.lastNote }}
              onNoteClick={this.onNoteClick}
              activeNotes={userInput.map((note) => MidiNumbers.fromNote(note))}
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

          <Stack
            direction="row"
            spacing={2}
            mt={3}
            flexWrap="wrap"
            alignItems="center"
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={this.nextExercise}
              disabled={!feedback || feedback.severity !== "success"}
            >
              Reset selezione
            </Button>
            <Button variant="outlined" color="secondary" onClick={this.props.onBack}>
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
}
