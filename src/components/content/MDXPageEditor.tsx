import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GitHubAPI, GitHubConfig } from '@/lib/github';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  RefreshCw, 
  FileText,
  Plus,
  AlertCircle,
  Eye,
  Edit
} from 'lucide-react';

interface MDXPageEditorProps {
  config: GitHubConfig;
}

interface MDXPage {
  path: string;
  name: string;
  lang: 'es' | 'en';
  frontmatter: any;
  content: string;
  sha: string;
}

export function MDXPageEditor({ config }: MDXPageEditorProps) {
  const { toast } = useToast();
  const [pages, setPages] = useState<MDXPage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPage, setEditingPage] = useState<MDXPage | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const api = new GitHubAPI(config);

  // Define the pages that should exist
  const expectedPages = [
    { name: 'About', path: 'src/content/pages/about.es.mdx', lang: 'es' as const },
    { name: 'About', path: 'src/content/pages/about.en.mdx', lang: 'en' as const },
    { name: 'Legal', path: 'src/content/pages/legal.es.mdx', lang: 'es' as const },
    { name: 'Legal', path: 'src/content/pages/legal.en.mdx', lang: 'en' as const },
    { name: 'Privacy', path: 'src/content/pages/privacy.es.mdx', lang: 'es' as const },
    { name: 'Privacy', path: 'src/content/pages/privacy.en.mdx', lang: 'en' as const },
    { name: 'Cookies', path: 'src/content/pages/cookies.es.mdx', lang: 'es' as const },
    { name: 'Cookies', path: 'src/content/pages/cookies.en.mdx', lang: 'en' as const },
  ];

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setIsLoading(true);
    const loadedPages: MDXPage[] = [];

    try {
      for (const expectedPage of expectedPages) {
        try {
          const file = await api.getFile(expectedPage.path);
          const page = parseMDXContent(file.content, expectedPage, file.sha);
          loadedPages.push(page);
        } catch (error) {
          // Page doesn't exist, create a placeholder
          const placeholder = createPlaceholderPage(expectedPage);
          loadedPages.push(placeholder);
        }
      }

      setPages(loadedPages);
      toast({
        title: "Páginas cargadas",
        description: `Se cargaron ${loadedPages.length} páginas`,
      });
    } catch (error) {
      toast({
        title: "Error al cargar",
        description: "No se pudieron cargar las páginas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const parseMDXContent = (content: string, pageInfo: any, sha: string): MDXPage => {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    
    if (frontmatterMatch) {
      try {
        const frontmatterYaml = frontmatterMatch[1];
        const frontmatter: any = {};
        
        // Simple YAML parser for basic frontmatter
        frontmatterYaml.split('\n').forEach(line => {
          const [key, ...valueParts] = line.split(':');
          if (key && valueParts.length > 0) {
            const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
            frontmatter[key.trim()] = value;
          }
        });

        return {
          path: pageInfo.path,
          name: pageInfo.name,
          lang: pageInfo.lang,
          frontmatter,
          content: frontmatterMatch[2].trim(),
          sha
        };
      } catch {
        // Fallback if YAML parsing fails
      }
    }

    return {
      path: pageInfo.path,
      name: pageInfo.name,
      lang: pageInfo.lang,
      frontmatter: { title: `${pageInfo.name} (${pageInfo.lang})` },
      content: content,
      sha
    };
  };

  const createPlaceholderPage = (pageInfo: any): MDXPage => {
    return {
      path: pageInfo.path,
      name: pageInfo.name,
      lang: pageInfo.lang,
      frontmatter: {
        title: `${pageInfo.name} (${pageInfo.lang})`,
        description: `Página ${pageInfo.name} en ${pageInfo.lang === 'es' ? 'español' : 'inglés'}`,
        lang: pageInfo.lang
      },
      content: `# ${pageInfo.name}\n\nContenido de la página ${pageInfo.name} en ${pageInfo.lang === 'es' ? 'español' : 'inglés'}.`,
      sha: ''
    };
  };

  const savePage = async (page: MDXPage) => {
    setIsSaving(true);
    try {
      const frontmatterLines = Object.entries(page.frontmatter)
        .map(([key, value]) => `${key}: "${value}"`)
        .join('\n');
      
      const fullContent = `---\n${frontmatterLines}\n---\n\n${page.content}`;

      if (page.sha) {
        await api.updateFile(
          page.path,
          fullContent,
          page.sha,
          `Update ${page.name} page (${page.lang}) via Content Manager`
        );
      } else {
        await api.createFile(
          page.path,
          fullContent,
          `Create ${page.name} page (${page.lang}) via Content Manager`
        );
      }

      toast({
        title: "Página guardada",
        description: `La página ${page.name} se ha guardado correctamente`,
      });

      setEditingPage(null);
      await loadPages();
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar la página",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateEditingPage = (field: string, value: string) => {
    if (!editingPage) return;

    if (field.startsWith('frontmatter.')) {
      const frontmatterKey = field.replace('frontmatter.', '');
      setEditingPage({
        ...editingPage,
        frontmatter: {
          ...editingPage.frontmatter,
          [frontmatterKey]: value
        }
      });
    } else {
      setEditingPage({
        ...editingPage,
        [field]: value
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Cargando páginas...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (editingPage) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Editando: {editingPage.name} ({editingPage.lang.toUpperCase()})
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setEditingPage(null)}>
                  Cancelar
                </Button>
                <Button onClick={() => savePage(editingPage)} disabled={isSaving}>
                  {isSaving ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Guardar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={editingPage.frontmatter.title || ''}
                  onChange={(e) => updateEditingPage('frontmatter.title', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  value={editingPage.frontmatter.description || ''}
                  onChange={(e) => updateEditingPage('frontmatter.description', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="content">Contenido (Markdown)</Label>
              <Textarea
                id="content"
                value={editingPage.content}
                onChange={(e) => updateEditingPage('content', e.target.value)}
                className="min-h-[400px] font-mono"
                placeholder="Escribe el contenido de la página en Markdown..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Páginas MDX
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Estas páginas se renderizan usando MDX y pueden incluir componentes React.
              Las páginas legales y sobre la empresa son perfectas para este formato.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {pages.map((page) => (
          <Card key={page.path}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {page.frontmatter.title || page.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {page.lang.toUpperCase()}
                    </Badge>
                    {!page.sha && (
                      <Badge variant="outline" className="text-xs">
                        Nueva
                      </Badge>
                    )}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditingPage(page)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {page.frontmatter.description || 'Sin descripción'}
              </p>
              <div className="text-xs text-muted-foreground">
                {page.path}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}