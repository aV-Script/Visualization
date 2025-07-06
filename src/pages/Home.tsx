import React from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Stack,
} from "@mui/material";

type HomeProps = {
  onStartInterval: () => void;
  onStartIdentify: () => void;
};

export default function Home({ onStartInterval, onStartIdentify }: HomeProps) {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
              onClick={onStartInterval}
            >
              Riconoscimento Intervalli
            </Button>

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={onStartIdentify}
            >
              Riconoscimento Scale
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}