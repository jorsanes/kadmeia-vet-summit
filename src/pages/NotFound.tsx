import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { PageSeo } from '@/components/seo/PageSeo';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <PageSeo 
        title="Página no encontrada - KADMEIA"
        description="La página que buscas no existe o ha sido movida. Regresa al inicio para encontrar lo que necesitas."
      />
      
      <div className="w-full max-w-md">
        <Card className="card-premium text-center">
          <CardContent className="pt-8 pb-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <FileQuestion className="w-8 h-8 text-primary" />
            </div>
            
            <h1 className="text-4xl font-display font-bold text-primary mb-2">
              404
            </h1>
            
            <h2 className="text-xl font-display font-semibold text-foreground mb-4">
              {t('error.notFound.title', 'Página no encontrada')}
            </h2>
            
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {t('error.notFound.description', 'La página que buscas no existe o ha sido movida. Verifica la URL o regresa al inicio para encontrar lo que necesitas.')}
            </p>
            
            <div className="space-y-3">
              <Button 
                asChild 
                className="w-full btn-primary"
                size="lg"
              >
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  {t('error.goHome', 'Ir al Inicio')}
                </Link>
              </Button>
              
              <Button 
                onClick={() => window.history.back()}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('error.goBack', 'Volver atrás')}
              </Button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                {t('error.suggestions', '¿Buscas algo específico? Prueba con:')}
              </p>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Link 
                  to="/servicios" 
                  className="text-primary hover:underline"
                >
                  {t('nav.services', 'Servicios')}
                </Link>
                <Link 
                  to="/casos" 
                  className="text-primary hover:underline"
                >
                  {t('nav.cases', 'Casos')}
                </Link>
                <Link 
                  to="/blog" 
                  className="text-primary hover:underline"
                >
                  {t('nav.blog', 'Blog')}
                </Link>
                <Link 
                  to="/contacto" 
                  className="text-primary hover:underline"
                >
                  {t('nav.contact', 'Contacto')}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;