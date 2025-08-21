import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { GitHubAPI, GitHubConfig } from '@/lib/github';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  FileText, 
  Globe, 
  Save, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  LogOut
} from 'lucide-react';
import { I18nEditor } from '@/components/content/I18nEditor';
import { MDXPageEditor } from '@/components/content/MDXPageEditor';
import { BlogEditor } from '@/components/content/BlogEditor';
import { CasesEditor } from '@/components/content/CasesEditor';
import { PageSeo } from '@/components/seo/PageSeo';

export default function ContentManager() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [config, setConfig] = useState<GitHubConfig | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [activeTab, setActiveTab] = useState('i18n');

  // Form state for GitHub authentication
  const [formData, setFormData] = useState({
    token: '',
    owner: 'jorsanes',
    repo: 'kadmeia-vet-summit',
    branch: 'main'
  });

  useEffect(() => {
    const storedConfig = GitHubAPI.getStoredConfig();
    if (storedConfig) {
      setConfig(storedConfig);
    }
  }, []);

  const handleAuthenticate = async () => {
    setIsAuthenticating(true);
    try {
      // Test the configuration by attempting to fetch a file
      const testConfig = { ...formData };
      const api = new GitHubAPI(testConfig);
      
      // Try to fetch the main i18n file to validate access
      await api.getFile('src/i18n/locales/es.json');
      
      // If successful, store the config
      GitHubAPI.storeConfig(testConfig);
      setConfig(testConfig);
      
      toast({
        title: "Autenticación exitosa",
        description: "Conectado correctamente al repositorio de GitHub",
      });
      
    } catch (error) {
      toast({
        title: "Error de autenticación",
        description: "No se pudo conectar al repositorio. Verifica tu token y permisos.",
        variant: "destructive",
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    GitHubAPI.clearConfig();
    setConfig(null);
    setFormData({ ...formData, token: '' });
    toast({
      title: "Sesión cerrada",
      description: "Configuración de GitHub eliminada",
    });
  };

  if (!config) {
    return (
      <div className="min-h-screen bg-background p-6">
        <PageSeo 
          title="Gestor de Contenido - KADMEIA"
          description="Panel de administración de contenido para KADMEIA"
          noindex={true}
        />
        
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-semibold text-foreground mb-4">
              Gestor de Contenido KADMEIA
            </h1>
            <p className="text-muted-foreground">
              Conecta con GitHub para editar el contenido de la web
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración de GitHub
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Necesitas un token de acceso personal (PAT) de GitHub con permisos de repositorio.
                  <a 
                    href="https://github.com/settings/tokens" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline ml-1"
                  >
                    Crear token aquí
                  </a>
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="owner">Propietario</Label>
                  <Input
                    id="owner"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    placeholder="jorsanes"
                  />
                </div>
                <div>
                  <Label htmlFor="repo">Repositorio</Label>
                  <Input
                    id="repo"
                    value={formData.repo}
                    onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
                    placeholder="kadmeia-vet-summit"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="branch">Rama</Label>
                <Input
                  id="branch"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  placeholder="main"
                />
              </div>

              <div>
                <Label htmlFor="token">Token de Acceso Personal</Label>
                <Input
                  id="token"
                  type="password"
                  value={formData.token}
                  onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                />
              </div>

              <Button 
                onClick={handleAuthenticate}
                disabled={!formData.token || isAuthenticating}
                className="w-full"
              >
                {isAuthenticating && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                Conectar con GitHub
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
                <Badge variant="secondary" className="text-xs">
                  {config.owner}/{config.repo}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {config.branch}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Desconectar
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="i18n" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Textos de Interfaz
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Páginas MDX
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="cases" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Casos
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              SEO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="i18n">
            <I18nEditor config={config} />
          </TabsContent>

          <TabsContent value="pages">
            <MDXPageEditor config={config} />
          </TabsContent>

          <TabsContent value="blog">
            <BlogEditor config={config} />
          </TabsContent>

          <TabsContent value="cases">
            <CasesEditor config={config} />
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