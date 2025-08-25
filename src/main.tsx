import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupPWA } from './pwa'
import { Buffer } from 'buffer'
import { MDXProvider } from '@mdx-js/react'
import { enhancedMDXComponents } from './components/mdx'
import { ThemeProvider } from 'next-themes'

// Setup global Buffer for gray-matter
window.Buffer = Buffer;

if (import.meta.env.PROD) {
  setupPWA();
}

createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="light"
    enableSystem={false}
    disableTransitionOnChange
  >
    <MDXProvider components={enhancedMDXComponents}>
      <App />
    </MDXProvider>
  </ThemeProvider>
);
