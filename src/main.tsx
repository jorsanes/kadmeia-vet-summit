import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupPWA } from './pwa'
import { Buffer } from 'buffer'
import { MDXProvider } from '@mdx-js/react'
import { enhancedMDXComponents } from './components/mdx'

// Setup global Buffer for gray-matter
window.Buffer = Buffer;

if (import.meta.env.PROD) {
  setupPWA();
}

createRoot(document.getElementById("root")!).render(
  <MDXProvider components={enhancedMDXComponents}>
    <App />
  </MDXProvider>
);
