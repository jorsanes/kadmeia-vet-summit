import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { GitHubAPI, GitHubConfig } from '@/lib/github';
import { useToast } from '@/hooks/use-toast';
import { CaseMeta } from '@/content/schemas';
import { enhancedMDXComponents } from '@/components/mdx';
import { MDXProvider } from '@mdx-js/react';
import { MdxPreview } from '@/components/mdx/MdxPreview';
import matter from 'gray-matter';
import { 
  Calendar, 
  Building,
  FileText, 
  Plus, 
  Edit, 
  Eye, 
  Copy, 
  AlertCircle,
  CheckCircle,
  Trash2,
  RefreshCw,
  Languages,
  MapPin,
  Users
} from 'lucide-react';

interface CasesEditorV2Props {
  config: GitHubConfig;
}

interface CaseFile {
  path: string;
  slug: string;
  lang: 'es' | 'en';
  meta: CaseMeta;
  content: string;
  sha?: string;
  hasErrors: boolean;
  errors: string[];
}

const CASE_TEMPLATE = {
  es: {
    title: "Nuevo caso de estudio",
    excerpt: "Resumen ejecutivo del caso de estudio y principales resultados obtenidos",
    client: "Cliente de ejemplo",
    sector: "Veterinaria",
    ubicacion: "Madrid, España",
    servicios: ["Consultoría", "Implementación"],
    content: `# Caso de estudio: [Nombre del cliente]

## Situación inicial

Describe aquí la situación inicial del cliente, los retos que enfrentaba y las necesidades identificadas.

### Principales desafíos
- Desafío 1
- Desafío 2
- Desafío 3

## Solución implementada

Explica detalladamente la solución que se implementó para resolver los problemas identificados.

### Tecnologías utilizadas
- Tecnología 1
- Tecnología 2
- Tecnología 3

### Metodología
1. Fase de análisis
2. Diseño de la solución
3. Implementación
4. Seguimiento y optimización

## Resultados obtenidos

Presenta los resultados cuantitativos y cualitativos del proyecto.

### KPIs principales
- Métrica 1: +XX%
- Métrica 2: -XX%
- Métrica 3: XX unidades

## Testimonial

> "Comentario del cliente sobre la experiencia y los resultados obtenidos"
> 
> **[Nombre]**, [Cargo], [Empresa]

## Conclusiones

Resumen de los aprendizajes clave y el impacto del proyecto en el negocio del cliente.`
  },
  en: {
    title: "New case study",
    excerpt: "Executive summary of the case study and main results achieved",
    client: "Example Client",
    sector: "Veterinary",
    ubicacion: "London, UK",
    servicios: ["Consulting", "Implementation"],
    content: `# Case study: [Client Name]

## Initial situation

Describe here the client's initial situation, the challenges they faced and the identified needs.

### Main challenges
- Challenge 1
- Challenge 2
- Challenge 3

## Implemented solution

Explain in detail the solution that was implemented to solve the identified problems.

### Technologies used
- Technology 1
- Technology 2
- Technology 3

### Methodology
1. Analysis phase
2. Solution design
3. Implementation
4. Monitoring and optimization

## Results achieved

Present the quantitative and qualitative results of the project.

### Key KPIs
- Metric 1: +XX%
- Metric 2: -XX%
- Metric 3: XX units

## Testimonial

> "Client comment about the experience and results obtained"
> 
> **[Name]**, [Position], [Company]

## Conclusions

Summary of key learnings and the project's impact on the client's business.`
  }
};

export const CasesEditorV2: React.FC<CasesEditorV2Props> = ({ config }) => {
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCase, setEditingCase] = useState<CaseFile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  const api = new GitHubAPI(config);

  useEffect(() => {
    loadCaseFiles();
  }, []);

  const loadCaseFiles = async () => {
    setIsLoadingFiles(true);
    try {
      // Use GitHub API to get the file tree
      const tree = await api.getTree('src/content/casos', true);
      const mdxFiles = tree.filter(item => 
        item.path.endsWith('.mdx') && 
        (item.path.includes('/es/') || item.path.includes('/en/'))
      );

      const loadedCases: CaseFile[] = [];

      for (const file of mdxFiles) {
        try {
          const response = await api.getFile(file.path);
          const parsed = parseAndValidateCase(response.content, file.path);
          
          loadedCases.push({
            ...parsed,
            sha: response.sha
          });
        } catch (error) {
          console.error(`Error loading ${file.path}:`, error);
          // Add placeholder for failed files
          const slug = file.path.split('/').pop()?.replace('.mdx', '') || '';
          const lang = file.path.includes('/en/') ? 'en' as const : 'es' as const;
          
          loadedCases.push({
            path: file.path,
            slug,
            lang,
            meta: createDefaultCaseMeta(slug, lang),
            content: '',
            hasErrors: true,
            errors: ['Failed to load file']
          });
        }
      }

      setCases(loadedCases.sort((a, b) => 
        new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
      ));
    } catch (error) {
      toast({
        title: "Error loading files",
        description: "Could not load case files from GitHub",
        variant: "destructive"
      });
    } finally {
      setIsLoadingFiles(false);
      setIsLoading(false);
    }
  };

  const parseAndValidateCase = (content: string, path: string): Omit<CaseFile, 'sha'> => {
    const slug = path.split('/').pop()?.replace('.mdx', '') || '';
    const lang = path.includes('/en/') ? 'en' as const : 'es' as const;
    
    try {
      const { data: frontmatter, content: bodyContent } = matter(content);
      
      // Validate with Zod schema
      const validation = CaseMeta.safeParse({
        ...frontmatter,
        lang
      });

      if (!validation.success) {
        return {
          path,
          slug,
          lang,
          meta: createDefaultCaseMeta(slug, lang),
          content: bodyContent,
          hasErrors: true,
          errors: validation.error.errors.map(err => 
            `${err.path.join('.')}: ${err.message}`
          )
        };
      }

      return {
        path,
        slug,
        lang,
        meta: validation.data,
        content: bodyContent,
        hasErrors: false,
        errors: []
      };
    } catch (error) {
      return {
        path,
        slug,
        lang,
        meta: createDefaultCaseMeta(slug, lang),
        content: '',
        hasErrors: true,
        errors: [`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  };

  const createDefaultCaseMeta = (slug: string, lang: 'es' | 'en'): CaseMeta => {
    const template = CASE_TEMPLATE[lang];
    
    return {
      title: template.title,
      date: new Date(),
      excerpt: template.excerpt,
      cover: '/images/cases/placeholder.jpg',
      lang,
      tags: ['implementation'],
      draft: true,
      client: template.client,
      sector: template.sector,
      ubicacion: template.ubicacion,
      servicios: template.servicios
    };
  };

  const createNewCase = (lang: 'es' | 'en') => {
    const timestamp = Date.now();
    const slug = `nuevo-caso-${timestamp}`;
    const path = `src/content/casos/${lang}/${slug}.mdx`;
    const template = CASE_TEMPLATE[lang];
    
    const newCase: CaseFile = {
      path,
      slug,
      lang,
      meta: createDefaultCaseMeta(slug, lang),
      content: template.content,
      hasErrors: false,
      errors: []
    };
    
    setEditingCase(newCase);
    setPreviewMode(false);
  };

  const duplicateCaseToLanguage = async (caseFile: CaseFile) => {
    const targetLang = caseFile.lang === 'es' ? 'en' : 'es';
    const targetPath = `src/content/casos/${targetLang}/${caseFile.slug}.mdx`;
    const template = CASE_TEMPLATE[targetLang];
    
    const duplicatedCase: CaseFile = {
      path: targetPath,
      slug: caseFile.slug,
      lang: targetLang,
      meta: {
        ...caseFile.meta,
        title: `${template.title} - ${caseFile.meta.title}`,
        excerpt: template.excerpt,
        lang: targetLang,
        // Keep client info but update template fields
        client: caseFile.meta.client,
        sector: caseFile.meta.sector,
        ubicacion: template.ubicacion,
        servicios: template.servicios
      },
      content: template.content,
      hasErrors: false,
      errors: []
    };
    
    setEditingCase(duplicatedCase);
    setPreviewMode(false);
  };

  const validateCase = (caseFile: CaseFile): string[] => {
    const errors: string[] = [];
    
    if (!caseFile.meta.title.trim()) errors.push('Title is required');
    if (!caseFile.meta.excerpt.trim()) errors.push('Excerpt is required');
    if (!caseFile.meta.cover.trim()) errors.push('Cover image is required');
    if (!caseFile.meta.client.trim()) errors.push('Client is required');
    if (!caseFile.meta.sector.trim()) errors.push('Sector is required');
    if (!caseFile.meta.ubicacion.trim()) errors.push('Location is required');
    if (caseFile.meta.servicios.length === 0) errors.push('At least one service is required');
    if (caseFile.meta.tags.length === 0) errors.push('At least one tag is required');
    if (!caseFile.content.trim()) errors.push('Content is required');
    
    // Validate date
    if (isNaN(new Date(caseFile.meta.date).getTime())) {
      errors.push('Date must be valid ISO format');
    }
    
    return errors;
  };

  const saveCase = async (caseFile: CaseFile) => {
    const validationErrors = validateCase(caseFile);
    if (validationErrors.length > 0) {
      toast({
        title: "Validation errors",
        description: validationErrors.join(', '),
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const frontmatter = matter.stringify(caseFile.content, {
        ...caseFile.meta,
        date: new Date(caseFile.meta.date).toISOString().split('T')[0]
      });

      if (caseFile.sha) {
        await api.updateFile(caseFile.path, frontmatter, caseFile.sha, `Update case study: ${caseFile.meta.title}`);
      } else {
        await api.createFile(caseFile.path, frontmatter, `Create case study: ${caseFile.meta.title}`);
      }

      toast({
        title: "Case saved",
        description: `"${caseFile.meta.title}" has been saved successfully.`,
      });

      await loadCaseFiles();
      setEditingCase(null);
    } catch (error) {
      console.error('Error saving case:', error);
      toast({
        title: "Error",
        description: "Could not save case. Check your GitHub connection.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateEditingCase = (updates: Partial<CaseFile>) => {
    if (editingCase) {
      setEditingCase({ 
        ...editingCase, 
        ...updates,
        hasErrors: false,
        errors: []
      });
    }
  };

  const updateEditingMeta = (updates: Partial<CaseMeta>) => {
    if (editingCase) {
      setEditingCase({ 
        ...editingCase, 
        meta: { ...editingCase.meta, ...updates },
        hasErrors: false,
        errors: []
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        Loading case studies...
      </div>
    );
  }

  if (editingCase) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {editingCase.sha ? 'Editing Case Study' : 'Creating New Case Study'}
          </h2>
          <div className="flex gap-2">
            <Button
              onClick={() => setPreviewMode(!previewMode)}
              variant="outline"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button
              onClick={() => setEditingCase(null)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={() => saveCase(editingCase)}
              disabled={isSaving}
            >
              {isSaving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Save
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="meta">Metadata</TabsTrigger>
            <TabsTrigger value="client">Client Info</TabsTrigger>
            {previewMode && <TabsTrigger value="preview">Preview</TabsTrigger>}
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={editingCase.meta.title}
                onChange={(e) => updateEditingMeta({ title: e.target.value })}
                placeholder="Case study title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content (MDX) *</label>
              <Textarea
                value={editingCase.content}
                onChange={(e) => updateEditingCase({ content: e.target.value })}
                placeholder="# Case Study&#10;&#10;Write your case study content here..."
                rows={20}
                className="font-mono text-sm"
              />
            </div>
          </TabsContent>

          <TabsContent value="meta" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date *</label>
                <Input
                  type="date"
                  value={new Date(editingCase.meta.date).toISOString().split('T')[0]}
                  onChange={(e) => updateEditingMeta({ date: new Date(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <Select
                  value={editingCase.lang}
                  onValueChange={(value: 'es' | 'en') => {
                    updateEditingCase({ lang: value });
                    updateEditingMeta({ lang: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Executive Summary *</label>
              <Textarea
                value={editingCase.meta.excerpt || ''}
                onChange={(e) => updateEditingMeta({ excerpt: e.target.value })}
                placeholder="Brief case study description highlighting main results"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cover Image *</label>
              <Input
                value={editingCase.meta.cover}
                onChange={(e) => updateEditingMeta({ cover: e.target.value })}
                placeholder="/images/cases/case-cover.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags * (comma separated)</label>
              <Input
                value={editingCase.meta.tags.join(', ')}
                onChange={(e) => updateEditingMeta({ 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                })}
                placeholder="Implementation, AI, Automation"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={editingCase.meta.draft || false}
                onCheckedChange={(checked) => updateEditingMeta({ draft: checked })}
              />
              <label className="text-sm font-medium">Draft (not published)</label>
            </div>
          </TabsContent>

          <TabsContent value="client" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Client Name *</label>
                <Input
                  value={editingCase.meta.client}
                  onChange={(e) => updateEditingMeta({ client: e.target.value })}
                  placeholder="Client company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sector *</label>
                <Input
                  value={editingCase.meta.sector}
                  onChange={(e) => updateEditingMeta({ sector: e.target.value })}
                  placeholder="e.g., Veterinary, Healthcare"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location *</label>
              <Input
                value={editingCase.meta.ubicacion}
                onChange={(e) => updateEditingMeta({ ubicacion: e.target.value })}
                placeholder="e.g., Madrid, Spain"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Services * (comma separated)</label>
              <Input
                value={editingCase.meta.servicios.join(', ')}
                onChange={(e) => updateEditingMeta({ 
                  servicios: e.target.value.split(',').map(service => service.trim()).filter(Boolean)
                })}
                placeholder="Consulting, Implementation, Training"
              />
            </div>
          </TabsContent>

          {previewMode && (
            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>{editingCase.meta.title}</CardTitle>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-muted-foreground">Client</div>
                      <div>{editingCase.meta.client}</div>
                    </div>
                    <div>
                      <div className="font-medium text-muted-foreground">Sector</div>
                      <div>{editingCase.meta.sector}</div>
                    </div>
                    <div>
                      <div className="font-medium text-muted-foreground">Location</div>
                      <div>{editingCase.meta.ubicacion}</div>
                    </div>
                    <div>
                      <div className="font-medium text-muted-foreground">Date</div>
                      <div>{new Date(editingCase.meta.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <MdxPreview>
                      <MDXProvider components={enhancedMDXComponents}>
                        <div dangerouslySetInnerHTML={{ __html: editingCase.content }} />
                      </MDXProvider>
                    </MdxPreview>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cases Editor</h2>
          <p className="text-muted-foreground">Manage case studies with validation and preview</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => loadCaseFiles()}
            variant="outline"
            size="sm"
            disabled={isLoadingFiles}
          >
            {isLoadingFiles ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={() => createNewCase('es')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Case (ES)
          </Button>
          <Button
            onClick={() => createNewCase('en')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Case (EN)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cases.map((caseFile) => (
          <Card key={caseFile.path} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{caseFile.meta.title}</CardTitle>
                <div className="flex items-center gap-1">
                  <Badge variant={caseFile.lang === 'es' ? 'default' : 'secondary'}>
                    {caseFile.lang.toUpperCase()}
                  </Badge>
                  {caseFile.hasErrors && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                  {caseFile.meta.draft && (
                    <Badge variant="outline" className="text-xs">DRAFT</Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  {caseFile.meta.client}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {caseFile.meta.ubicacion}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(caseFile.meta.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {caseFile.meta.sector}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-3">
              {caseFile.hasErrors && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    {caseFile.errors.slice(0, 2).join(', ')}
                    {caseFile.errors.length > 2 && '...'}
                  </AlertDescription>
                </Alert>
              )}
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {caseFile.meta.excerpt}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {caseFile.meta.servicios.slice(0, 2).map((service) => (
                  <Badge key={service} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
                {caseFile.meta.servicios.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{caseFile.meta.servicios.length - 2}
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setEditingCase(caseFile)}
                  className="flex-1 flex items-center gap-2"
                  variant="outline"
                  size="sm"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  onClick={() => duplicateCaseToLanguage(caseFile)}
                  variant="outline"
                  size="sm"
                  title={`Duplicate to ${caseFile.lang === 'es' ? 'English' : 'Spanish'}`}
                >
                  <Languages className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
