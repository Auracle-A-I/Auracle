import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function getOrCreateVisitorId(): string {
  const STORAGE_KEY = 'auracle_visitor_id';
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

pendo.initialize({
  visitor: {
    id: getOrCreateVisitorId()
  }
});

createRoot(document.getElementById("root")!).render(<App />);
