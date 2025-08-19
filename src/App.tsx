import { I18nextProvider } from "react-i18next";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import i18n from "@/i18n/config";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HrefLangLinks from "@/components/layout/HrefLangLinks";
import Home from "@/pages/Index";
import Contact from "@/pages/Contact";
import Services from "@/pages/Services";
import Cases from "@/pages/Cases";
import Blog from "@/pages/Blog";
import About from "@/pages/About";
import Privacy from "@/pages/Privacy";
import Legal from "@/pages/Legal";
import Cookies from "@/pages/Cookies";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <LocaleProvider>
              <HrefLangLinks />
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Routes>
                    {/* Spanish routes (default) */}
                    <Route path="/" element={<Home />} />
                    <Route path="/servicios" element={<Services />} />
                    <Route path="/casos" element={<Cases />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/sobre" element={<About />} />
                    <Route path="/contacto" element={<Contact />} />
                    <Route path="/privacidad" element={<Privacy />} />
                    <Route path="/aviso-legal" element={<Legal />} />
                    <Route path="/cookies" element={<Cookies />} />
                    
                    {/* English routes */}
                    <Route path="/en" element={<Home />} />
                    <Route path="/en/services" element={<Services />} />
                    <Route path="/en/cases" element={<Cases />} />
                    <Route path="/en/blog" element={<Blog />} />
                    <Route path="/en/about" element={<About />} />
                    <Route path="/en/contact" element={<Contact />} />
                    <Route path="/en/privacy" element={<Privacy />} />
                    <Route path="/en/legal" element={<Legal />} />
                    <Route path="/en/cookies" element={<Cookies />} />
                    
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </LocaleProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </I18nextProvider>
  </HelmetProvider>
);

export default App;
