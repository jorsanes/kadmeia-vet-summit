import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupPWA } from './pwa'
import { Buffer } from 'buffer'

// Setup global Buffer for gray-matter
window.Buffer = Buffer;

setupPWA();

createRoot(document.getElementById("root")!).render(<App />);
