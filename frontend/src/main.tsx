import { scan } from "react-scan";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
scan({
  enabled: true,
});

createRoot(document.getElementById('root')!).render(
  
  <StrictMode>
    <div className="dark:bg-dark">
        <App />
    </div>
  </StrictMode>,
)

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}
