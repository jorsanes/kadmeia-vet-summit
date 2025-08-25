
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
import Layout from "@/components/layout/Layout";

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
            <Router>
              <LangProvider>
                <SkipLink />
                <Routes>
                  <Route path="/" element={<Layout><Index /></Layout>} />
                  
                  {/* Spanish routes */}
                  <Route path="/sobre" element={<Layout><About /></Layout>} />
                  <Route path="/servicios" element={<Layout><Services /></Layout>} />
                  <Route path="/blog" element={<Layout><Blog /></Layout>} />
                  <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
                  <Route path="/casos" element={<Layout><Cases /></Layout>} />
                  <Route path="/casos/:slug" element={<Layout><CaseDetailEs /></Layout>} />
                  <Route path="/contacto" element={<Layout><Contact /></Layout>} />
                  <Route path="/privacidad" element={<Layout><Privacy /></Layout>} />
                  <Route path="/aviso-legal" element={<Layout><Legal /></Layout>} />
                  <Route path="/cookies" element={<Layout><Cookies /></Layout>} />
                  
                  {/* English routes */}
                  <Route path="/en" element={<Layout><Index /></Layout>} />
                  <Route path="/en/about" element={<Layout><About /></Layout>} />
                  <Route path="/en/services" element={<Layout><Services /></Layout>} />
                  <Route path="/en/blog" element={<Layout><Blog /></Layout>} />
                  <Route path="/en/blog/:slug" element={<Layout><BlogPost /></Layout>} />
                  <Route path="/en/cases" element={<Layout><Cases /></Layout>} />
                  <Route path="/en/cases/:slug" element={<Layout><CaseDetail /></Layout>} />
                  <Route path="/en/contact" element={<Layout><Contact /></Layout>} />
                  <Route path="/en/privacy" element={<Layout><Privacy /></Layout>} />
                  <Route path="/en/legal" element={<Layout><Legal /></Layout>} />
                  <Route path="/en/cookies" element={<Layout><Cookies /></Layout>} />
                  
                  {/* Admin routes */}
                  <Route path="/admin/login" element={<Login />} />
                  <Route path="/content-manager" element={<ContentManager />} />
                  
                  {/* Error routes */}
                  <Route path="/500" element={<ServerError />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </LangProvider>
            </Router>
          </AuthProvider>
        </ErrorBoundary>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
