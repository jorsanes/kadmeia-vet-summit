import { I18nextProvider } from "react-i18next";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { MDXProvider } from '@mdx-js/react';
import mdxComponents from '@/components/mdx/MDXComponents';
import ErrorBoundary from "@/components/ErrorBoundary";
import i18n from "@/i18n/config";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Index";
import Contact from "@/pages/Contact";
import Services from "@/pages/Services";
import Cases from "@/pages/Cases";
import Blog from "@/pages/Blog";
import About from "@/pages/About";
import Privacy from "@/pages/Privacy";
import Legal from "@/pages/Legal";
import Cookies from "@/pages/Cookies";
import BlogPostNew from "@/pages/blog/Post";
import PostDetail from "@/pages/blog/PostDetail";
import CaseDetail from "@/pages/casos/CaseDetail";

import ContentManager from "@/pages/ContentManager";
import NotFound from "./pages/NotFound";
import ServerError from "./pages/ServerError";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <MDXProvider components={mdxComponents}>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <LocaleProvider>
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main id="main-content" tabIndex={-1} className="flex-1">
                      <Routes>
                        {/* Spanish routes (default) */}
                        <Route path="/" element={<Home />} />
                        <Route path="/servicios" element={<Services />} />
                        <Route path="/casos" element={<Cases />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<PostDetail />} />
                        <Route path="/casos/:slug" element={<CaseDetail />} />
                        <Route path="/sobre" element={<About />} />
                        <Route path="/contacto" element={<Contact />} />
                        <Route path="/privacidad" element={<Privacy />} />
                        <Route path="/aviso-legal" element={<Legal />} />
                        <Route path="/cookies" element={<Cookies />} />
                        
                        <Route path="/content" element={<ContentManager />} />
                        
                        {/* English routes */}
                        <Route path="/en" element={<Home />} />
                        <Route path="/en/services" element={<Services />} />
                        <Route path="/en/cases" element={<Cases />} />
                        <Route path="/en/blog" element={<Blog />} />
                        <Route path="/en/blog/:slug" element={<PostDetail />} />
                        <Route path="/en/cases/:slug" element={<CaseDetail />} />
                        <Route path="/en/about" element={<About />} />
                        <Route path="/en/contact" element={<Contact />} />
                        <Route path="/en/privacy" element={<Privacy />} />
                        <Route path="/en/legal" element={<Legal />} />
                        <Route path="/en/cookies" element={<Cookies />} />
                        
                        {/* Error pages */}
                        <Route path="/404" element={<NotFound />} />
                        <Route path="/500" element={<ServerError />} />
                        
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </LocaleProvider>
              </BrowserRouter>
            </MDXProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </ErrorBoundary>
  </HelmetProvider>
);

export default App;
