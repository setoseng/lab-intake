import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import IntakePage from "./pages/IntakePage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <IntakePage />
  </StrictMode>,
);
