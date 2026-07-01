import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { setToken } from "../../logging-middleware/log.js";
import { AllNotificationsPage } from "./pages/AllNotificationsPage";
import { PriorityInboxPage } from "./pages/PriorityInboxPage";

setToken(import.meta.env.VITE_AUTH_TOKEN);

const theme = createTheme();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AllNotificationsPage />} />
          <Route path="/priority" element={<PriorityInboxPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
