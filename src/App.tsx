import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import IntervalExercise from "./pages/IntervalExercise";
import IdentifyScaleExercise from "./pages/IdentifyScaleExercise";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import theme from "./theme";  

const basename = process.env.PUBLIC_URL || "";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="exercise" element={<IntervalExercise />} />
            <Route path="identify" element={<IdentifyScaleExercise />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
