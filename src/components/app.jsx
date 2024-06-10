import { Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";

import { Navigate } from "react-router-dom";

import ShortenUrl from "./shorten-url";

const App = () => {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<ShortenUrl />} />
        <Route path="/:redirectShortUrl" element={<ShortenUrl />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
