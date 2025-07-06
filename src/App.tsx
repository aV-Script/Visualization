// App.tsx
import React, { useState } from "react";
import Home from "./pages/Home";
import IntervalExercise from "./pages/IntervalExercise";
import IdentifyScaleExercise from "./pages/IdentifyScaleExercise";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme"; 

export default function App() {
  const [page, setPage] = useState<"home" | "exercise" | "identify">("home");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <>
        {page === "home" && (
          <Home
            onStartInterval={() => setPage("exercise")}
            onStartIdentify={() => setPage("identify")}
          />
        )}
        {page === "exercise" && (
          <IntervalExercise onBack={() => setPage("home")} />
        )}
        {page === "identify" && (
          <IdentifyScaleExercise onBack={() => setPage("home")} />
        )}
      </>
    </ThemeProvider>
  );
}
