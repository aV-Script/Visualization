import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Typography, Button, Paper, Stack } from "@mui/material";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container sx={{ mx: "auto", p: 4 }}>
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Stack spacing={4} alignItems="center">
            <Typography variant="h4" component="h1" align="center">
              Esercizi di Visualizzazione Musicale
            </Typography>

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={() => navigate("/exercise")}
            >
              Riconoscimento Intervalli
            </Button>

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={() => navigate("/identify")}
            >
              Riconoscimento Scale
            </Button>
          </Stack>
        </Paper>
    </Container>
  );
}
