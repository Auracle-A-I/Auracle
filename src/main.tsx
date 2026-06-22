import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

pendo.initialize({
  visitor: {
    id: crypto.randomUUID(),
  },
});

createRoot(document.getElementById("root")!).render(<App />);
