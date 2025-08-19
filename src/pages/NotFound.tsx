import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Home, 
  ArrowRight,
  Search
} from 'lucide-react';

const NotFound = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const suggestedLinks = [
    { path: '/', label: 'Inicio', desc: 'Página principal de KADMEIA' },
    { path: '/servicios', label: 'Servicios', desc: 'Consultoría y tecnología veterinaria' },
    { path: '/casos', label: 'Casos', desc: 'Proyectos y resultados reales' },
    { path: '/blog', label: 'Blog', desc: 'Análisis y artículos especializados' },
    { path: '/contacto', label: 'Contacto', desc: 'Hablemos de su proyecto' }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Error Icon and Message */}
          <motion.div 
            className="mb-12"
            variants={fadeInUp}
          >
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center justify-center w-24 h-24 bg-destructive/10 rounded-2xl">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
            </div>
            
            <h1 className="font-display text-6xl font-semibold text-foreground mb-4">
              404
            </h1>
            <h2 className="font-display text-2xl font-medium text-foreground mb-4">
              Página no encontrada
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Lo sentimos, la página que busca no existe o ha sido movida. 
              Le ayudamos a encontrar lo que necesita.
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="mb-12"
            variants={fadeInUp}
          >
            <Card className="card-premium">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Search className="h-6 w-6 text-secondary" />
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    ¿Qué estaba buscando?
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {suggestedLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.path}
                      className="group p-4 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-muted/30 transition-all focus-ring-kadmeia"
                    >
                      <div className="text-left">
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {link.label}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {link.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="btn-primary">
                    <Link to="/" className="gap-2">
                      <Home className="h-4 w-4" />
                      Volver al inicio
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                    <Link to="/contacto" className="gap-2">
                      ¿Necesita ayuda?
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Technical Info */}
          <motion.div
            variants={fadeInUp}
          >
            <Card className="card-outline">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-3">
                  Si llegó aquí a través de un enlace de nuestro sitio web, por favor{' '}
                  <Link 
                    to="/contacto" 
                    className="text-primary hover:text-primary-hover transition-colors underline"
                  >
                    infórmenos del error
                  </Link>
                  {' '}para que podamos solucionarlo.
                </p>
                <p className="text-xs text-muted-foreground">
                  Error 404 - Página no encontrada • KADMEIA
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;