
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { GitHubAPI, GitHubConfig } from '@/lib/github';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  FileText, 
  Globe, 
  LogOut,
  AlertCircle,
  User
} from 'lucide-react';
import { I18nEditor } from '@/components/content/I18nEditor';
import { MDXPageEditor } from '@/components/content/MDXPageEditor';
import { BlogAdminV2 } from '@/components/admin/BlogAdminV2';
import { CasesEditorV2 } from '@/components/content/CasesEditorV2';
import { QAPanel } from '@/components/admin/QAPanel';
import { PageSeo } from '@/components/seo/PageSeo';

export default function ContentManager() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [config, setConfig] = useState<GitHubConfig | null>(null);
  const [activeTab, setActiveTab] = useState('blog');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const storedConfig = GitHubAPI.getStoredConfig();
    if (storedConfig) {
      setConfig(storedConfig);
    }
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (authLoading) {
    return <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      Cargando...
    </div>;
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background p-6">
        <PageSeo 
          title="Gestor de Contenido - KADMEIA"
          description="Panel de administración de contenido para KADMEIA"
          noindex={true}
        />
        
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No tienes permisos de administrador para acceder a esta sección.
                  Si crees que esto es un error, contacta al administrador del sistema.
                </AlertDescription>
              </Alert>
              <Button onClick={handleLogout} className="mt-4">
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageSeo 
        title="Gestor de Contenido - KADMEIA"
        description="Panel de administración de contenido para KADMEIA"
        noindex={true}
      />
      
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-semibold text-foreground">
                Gestor de Contenido
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {user.email}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Admin
                </Badge>
                {config && (
                  <>
                    <Badge variant="secondary" className="text-xs">
                      {config.owner}/{config.repo}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {config.branch}
                    </Badge>
                  </>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Blog WYSIWYG
            </TabsTrigger>
            <TabsTrigger value="i18n" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Textos de Interfaz
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Páginas MDX
            </TabsTrigger>
            <TabsTrigger value="cases" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Casos
            </TabsTrigger>
            <TabsTrigger value="qa" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              QA
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              SEO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blog">
            <BlogAdminV2 />
          </TabsContent>

          <TabsContent value="i18n">
            {config ? (
              <I18nEditor config={config} />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      GitHub no está configurado. La edición de textos de interfaz requiere configuración de GitHub.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pages">
            {config ? (
              <MDXPageEditor config={config} />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      GitHub no está configurado. La edición de páginas MDX requiere configuración de GitHub.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cases">
            {config ? (
              <CasesEditorV2 config={config} />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      GitHub no está configurado. La edición de casos requiere configuración de GitHub.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="qa">
            <QAPanel />
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>Configuración SEO</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    La configuración SEO está integrada en los textos de interfaz. 
                    Usa la pestaña "Textos de Interfaz" para editar títulos y descripciones SEO.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
