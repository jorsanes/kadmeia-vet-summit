import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { PageSeo } from '@/components/seo/PageSeo';

const ServerError = () => {
  const { t } = useTranslation();

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <PageSeo 
        title="Error del Servidor - KADMEIA"
        description="Ha ocurrido un error inesperado en el servidor. Nuestro equipo ha sido notificado."
      />
      
      <div className="w-full max-w-md">
        <Card className="card-premium text-center">
          <CardContent className="pt-8 pb-8">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            
            <h1 className="text-2xl font-display font-semibold text-foreground mb-4">
              {t('error.server.title', 'Error del Servidor')}
            </h1>
            
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {t('error.server.description', 'Ha ocurrido un error inesperado. Nuestro equipo técnico ha sido notificado y está trabajando para resolverlo.')}
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={handleRetry}
                className="w-full btn-primary"
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('error.retry', 'Reintentar')}
              </Button>
              
              <Button 
                asChild 
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  {t('error.goHome', 'Volver al Inicio')}
                </Link>
              </Button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {t('error.support', 'Si el problema persiste, contacta con soporte técnico en')}{' '}
                <a 
                  href="mailto:info@kadmeia.com" 
                  className="text-primary hover:underline"
                >
                  info@kadmeia.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServerError;