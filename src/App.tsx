import { I18nextProvider } from "react-i18next";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import i18n from "@/i18n/config";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <I18nextProvider i18n={i18n}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/servicios" element={<Services />} />
                <Route path="/casos" element={<Cases />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/sobre" element={<About />} />
                <Route path="/contacto" element={<Contact />} />
                <Route path="/privacidad" element={<Privacy />} />
                <Route path="/aviso-legal" element={<Legal />} />
                <Route path="/cookies" element={<Cookies />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </I18nextProvider>
);

export default App;
