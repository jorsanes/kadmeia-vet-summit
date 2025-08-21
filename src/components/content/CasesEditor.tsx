import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitHubAPI, GitHubConfig } from '@/lib/github';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, Plus, Edit, Building } from 'lucide-react';

interface CasesEditorProps {
  config: GitHubConfig;
}

interface CaseStudy {
  path: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  cover: string;
  lang: 'es' | 'en';
  tags: string[];
  content: string;
  sha?: string;
}

export const CasesEditor: React.FC<CasesEditorProps> = ({ config }) => {
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCase, setEditingCase] = useState<CaseStudy | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const api = new GitHubAPI(config);

  const expectedCases = [
    { path: 'src/content/casos/es/automatizacion-madrid-sur.mdx', lang: 'es' as const },
    { path: 'src/content/casos/es/clinica-barcelona-ia.mdx', lang: 'es' as const },
    { path: 'src/content/casos/en/amsterdam-automation.mdx', lang: 'en' as const },
    { path: 'src/content/casos/en/london-ai-implementation.mdx', lang: 'en' as const },
  ];

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    setIsLoading(true);
    const loadedCases: CaseStudy[] = [];

    for (const expectedCase of expectedCases) {
      try {
        const response = await api.getFile(expectedCase.path);
        const parsed = parseMDXContent(response.content);
        loadedCases.push({
          path: expectedCase.path,
          slug: expectedCase.path.split('/').pop()?.replace('.mdx', '') || '',
          ...parsed,
          sha: response.sha
        });
      } catch (error) {
        // If file doesn't exist, create a placeholder
        const slug = expectedCase.path.split('/').pop()?.replace('.mdx', '') || '';
        loadedCases.push(createPlaceholderCase(expectedCase.path, slug, expectedCase.lang));
      }
    }

    setCases(loadedCases);
    setIsLoading(false);
  };

  const parseMDXContent = (content: string) => {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatterMatch) {
      return {
        title: 'Untitled Case',
        date: new Date().toISOString().split('T')[0],
        excerpt: '',
        cover: '',
        lang: 'es' as const,
        tags: [],
        content: content
      };
    }

    const frontmatter = frontmatterMatch[1];
    const bodyContent = frontmatterMatch[2];

    // Simple YAML parser for frontmatter
    const frontmatterObj: any = {};
    const lines = frontmatter.split('\n');
    
    for (const line of lines) {
      const match = line.match(/^(\w+):\s*(.*)$/);
      if (match) {
        const key = match[1];
        let value = match[2].trim();
        
        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        // Handle arrays
        if (value.startsWith('[') && value.endsWith(']')) {
          const arrayValue = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
          frontmatterObj[key] = arrayValue;
          continue;
        }
        
        frontmatterObj[key] = value;
      }
    }

    return {
      title: frontmatterObj.title || 'Untitled Case',
      date: frontmatterObj.date || new Date().toISOString().split('T')[0],
      excerpt: frontmatterObj.excerpt || '',
      cover: frontmatterObj.cover || '',
      lang: frontmatterObj.lang || 'es',
      tags: Array.isArray(frontmatterObj.tags) ? frontmatterObj.tags : [],
      content: bodyContent
    };
  };

  const createPlaceholderCase = (path: string, slug: string, lang: 'es' | 'en'): CaseStudy => {
    const isSpanish = lang === 'es';
    return {
      path,
      slug,
      title: isSpanish ? 'Nuevo Caso de Estudio' : 'New Case Study',
      date: new Date().toISOString().split('T')[0],
      excerpt: isSpanish ? 'Descripción del caso de estudio' : 'Case study description',
      cover: '/images/cases/placeholder.jpg',
      lang,
      tags: isSpanish ? ['Implementación'] : ['Implementation'],
      content: isSpanish 
        ? `# ${slug.replace(/-/g, ' ')}\n\n## Situación inicial\n\nDescripción del problema...\n\n## Solución implementada\n\nDetalles de la solución...\n\n## Resultados\n\nMétricas y resultados obtenidos...`
        : `# ${slug.replace(/-/g, ' ')}\n\n## Initial Situation\n\nProblem description...\n\n## Implemented Solution\n\nSolution details...\n\n## Results\n\nMetrics and achieved results...`
    };
  };

  const saveCase = async (caseStudy: CaseStudy) => {
    setIsSaving(true);
    try {
      const tagsString = caseStudy.tags.length > 0 
        ? `[${caseStudy.tags.map(tag => `"${tag}"`).join(', ')}]`
        : '[]';

      const frontmatter = `---
title: "${caseStudy.title}"
date: "${caseStudy.date}"
excerpt: "${caseStudy.excerpt}"
cover: "${caseStudy.cover}"
lang: "${caseStudy.lang}"
tags: ${tagsString}
---`;

      const fullContent = `${frontmatter}\n\n${caseStudy.content}`;

      if (caseStudy.sha) {
        await api.updateFile(caseStudy.path, fullContent, caseStudy.sha, `Update case study: ${caseStudy.title}`);
      } else {
        await api.createFile(caseStudy.path, fullContent, `Create case study: ${caseStudy.title}`);
      }

      toast({
        title: "Caso guardado",
        description: `El caso "${caseStudy.title}" se ha guardado correctamente.`,
      });

      await loadCases();
      setEditingCase(null);
    } catch (error) {
      console.error('Error saving case:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el caso. Verifica tu conexión a GitHub.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateEditingCase = (updates: Partial<CaseStudy>) => {
    if (editingCase) {
      setEditingCase({ ...editingCase, ...updates });
    }
  };

  const createNewCase = (lang: 'es' | 'en') => {
    const timestamp = Date.now();
    const slug = `nuevo-caso-${timestamp}`;
    const path = `src/content/casos/${lang}/${slug}.mdx`;
    
    const newCase = createPlaceholderCase(path, slug, lang);
    setEditingCase(newCase);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Cargando casos...</div>;
  }

  if (editingCase) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Editando Caso de Estudio</h2>
          <div className="flex gap-2">
            <Button
              onClick={() => setEditingCase(null)}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => saveCase(editingCase)}
              disabled={isSaving}
            >
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Título</label>
            <Input
              value={editingCase.title}
              onChange={(e) => updateEditingCase({ title: e.target.value })}
              placeholder="Título del caso de estudio"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Fecha</label>
            <Input
              type="date"
              value={editingCase.date}
              onChange={(e) => updateEditingCase({ date: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Resumen ejecutivo</label>
          <Textarea
            value={editingCase.excerpt}
            onChange={(e) => updateEditingCase({ excerpt: e.target.value })}
            placeholder="Breve descripción del caso y resultados principales"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Imagen de portada</label>
            <Input
              value={editingCase.cover}
              onChange={(e) => updateEditingCase({ cover: e.target.value })}
              placeholder="/images/cases/case-cover.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tags (separados por coma)</label>
            <Input
              value={editingCase.tags.join(', ')}
              onChange={(e) => updateEditingCase({ 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
              })}
              placeholder="Automatización, IA, Clínica"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Contenido del caso (MDX)</label>
          <Textarea
            value={editingCase.content}
            onChange={(e) => updateEditingCase({ content: e.target.value })}
            placeholder="# Caso de Estudio&#10;&#10;## Situación inicial&#10;&#10;## Solución implementada&#10;&#10;## Resultados"
            rows={25}
            className="font-mono text-sm"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Editor de Casos de Estudio</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => createNewCase('es')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo Caso (ES)
          </Button>
          <Button
            onClick={() => createNewCase('en')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo Caso (EN)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cases.map((caseStudy) => (
          <Card key={caseStudy.path} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{caseStudy.title}</CardTitle>
                <Badge variant={caseStudy.lang === 'es' ? 'default' : 'secondary'}>
                  {caseStudy.lang.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {caseStudy.date}
                </div>
                <div className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  {caseStudy.slug}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                {caseStudy.excerpt}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {caseStudy.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {caseStudy.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{caseStudy.tags.length - 3}
                  </Badge>
                )}
              </div>
              <Button
                onClick={() => setEditingCase(caseStudy)}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};