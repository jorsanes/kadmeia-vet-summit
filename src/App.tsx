
import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { LangProvider } from "@/components/accessibility/LangProvider";
import SkipLink from "@/components/accessibility/SkipLink";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/blog/Post";
import Cases from "@/pages/Cases";
import CaseDetail from "@/pages/cases/CaseDetail";
import CaseDetailEs from "@/pages/casos/CaseDetail";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Legal from "@/pages/Legal";
import Cookies from "@/pages/Cookies";
import NotFound from "@/pages/NotFound";
import ServerError from "@/pages/ServerError";
import ContentManager from "@/pages/ContentManager";
import { Login } from "@/pages/admin/Login";

import "@/i18n/config";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ErrorBoundary>
          <AuthProvider>
            <LangProvider>
              <Router>
                <SkipLink />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/cases" element={<Cases />} />
                  <Route path="/cases/:slug" element={<CaseDetail />} />
                  <Route path="/casos/:slug" element={<CaseDetailEs />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/legal" element={<Legal />} />
                  <Route path="/cookies" element={<Cookies />} />
                  
                  {/* English routes */}
                  <Route path="/en" element={<Index />} />
                  <Route path="/en/about" element={<About />} />
                  <Route path="/en/services" element={<Services />} />
                  <Route path="/en/blog" element={<Blog />} />
                  <Route path="/en/blog/:slug" element={<BlogPost />} />
                  <Route path="/en/cases" element={<Cases />} />
                  <Route path="/en/cases/:slug" element={<CaseDetail />} />
                  <Route path="/en/contact" element={<Contact />} />
                  <Route path="/en/privacy" element={<Privacy />} />
                  <Route path="/en/legal" element={<Legal />} />
                  <Route path="/en/cookies" element={<Cookies />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin/login" element={<Login />} />
                  <Route path="/content-manager" element={<ContentManager />} />
                  
                  {/* Error routes */}
                  <Route path="/500" element={<ServerError />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </Router>
            </LangProvider>
          </AuthProvider>
        </ErrorBoundary>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
