import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@emotion/react";
import "./index.css";
import App from "./App.jsx";
import theme from "./theme";
import { setAuthToken} from "../src/utils/setAuthToken";

const token = localStorage.getItem("token");
if (token) {
  setAuthToken(token);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>
);
