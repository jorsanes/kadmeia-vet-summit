import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  ExternalLink,
  AlertTriangle,
  Info
} from 'lucide-react';

interface QAResults {
  routes: string[];
  links: string[];
  brokenLinks: string[];
  orphanedRoutes: string[];
}

export const QAPanel: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<QAResults | null>(null);
  const { toast } = useToast();

  const runAudit = async () => {
    setIsRunning(true);
    try {
      // Import and run the audit script
      const { auditOrphanPages } = await import('../../../scripts/find-orphans.mjs');
      const auditResults = await auditOrphanPages();
      setResults(auditResults);
      
      toast({
        title: "Auditoría completada",
        description: `Encontrados ${auditResults.brokenLinks.length} enlaces rotos y ${auditResults.orphanedRoutes.length} rutas huérfanas.`,
      });
    } catch (error) {
      console.error('Error running audit:', error);
      toast({
        title: "Error en auditoría",
        description: "No se pudo completar la auditoría de páginas.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Auditoría de Páginas Muertas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-muted-foreground mb-4">
              Esta herramienta detecta enlaces rotos y páginas huérfanas en tu sitio web.
            </p>
            
            <Button 
              onClick={runAudit} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {isRunning ? 'Ejecutando auditoría...' : 'Ejecutar auditoría'}
            </Button>
          </div>

          {results && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{results.routes.length}</div>
                  <div className="text-sm text-muted-foreground">Rutas totales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{results.links.length}</div>
                  <div className="text-sm text-muted-foreground">Enlaces totales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">{results.brokenLinks.length}</div>
                  <div className="text-sm text-muted-foreground">Enlaces rotos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{results.orphanedRoutes.length}</div>
                  <div className="text-sm text-muted-foreground">Rutas huérfanas</div>
                </div>
              </div>

              {results.brokenLinks.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-2">Enlaces rotos encontrados:</div>
                    <div className="space-y-1">
                      {results.brokenLinks.map((link, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <ExternalLink className="h-3 w-3" />
                          <code className="text-xs bg-background px-1 rounded">{link}</code>
                        </div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {results.orphanedRoutes.length > 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-2">Rutas huérfanas (sin enlaces entrantes):</div>
                    <div className="space-y-1">
                      {results.orphanedRoutes.map((route, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{route}</Badge>
                        </div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {results.brokenLinks.length === 0 && results.orphanedRoutes.length === 0 && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    ✅ No se encontraron enlaces rotos ni rutas huérfanas. Tu sitio web está bien estructurado.
                  </AlertDescription>
                </Alert>
              )}

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">Problemas conocidos a revisar:</div>
                  <ul className="text-sm space-y-1">
                    <li>• Verifica que el Header use rutas que coincidan con App.tsx</li>
                    <li>• Comprueba si hay rutas en español (/servicios, /sobre) vs inglés (/services, /about)</li>
                    <li>• Las rutas dinámicas (:slug) no se detectan en esta auditoría</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};