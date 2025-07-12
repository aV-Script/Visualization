import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Paper, Stack, Typography, Box } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container sx={{ mx: "auto", p: 4 }}>
      <Paper elevation={4} sx={{ p: 6, borderRadius: 4 }}>
        <Stack spacing={5} alignItems="center">
          <Typography variant="body1" textAlign="center" color="text.primary">
            Allena la tua memoria musicale e la velocità nel riconoscere intervalli e scale.
          </Typography>

          <Box width="100%">
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              startIcon={<GraphicEqIcon />}
              onClick={() => navigate("/exercise")}
              sx={{ mb: 2, py: 2, textTransform: "none", fontWeight: "bold" }}
            >
              Riconoscimento Intervalli
            </Button>

            <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mb: 2 }}>
              Metti alla prova la tua rapidità nel calcolare la distanza tra due note.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              startIcon={<MusicNoteIcon />}
              onClick={() => navigate("/identify")}
              sx={{ py: 2, textTransform: "none", fontWeight: "bold" }}
            >
              Riconoscimento Scale
            </Button>

            <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mt: 1 }}>
              Ricorda le combinazioni di toni e semitoni per identificare rapidamente le scale.
            </Typography>
          </Box>
          <Box>
            <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={<MusicNoteIcon />}
                onClick={() => navigate("/matrix")}
                sx={{ py: 2, textTransform: "none", fontWeight: "bold" }}
              >
              Tavola degli Intervalli
            </Button>

            <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mt: 1 }}>
              Ricorda le combinazioni di toni e semitoni per identificare rapidamente le scale.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
