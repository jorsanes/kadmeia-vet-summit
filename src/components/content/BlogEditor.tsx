import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitHubAPI, GitHubConfig } from '@/lib/github';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, Plus, Edit } from 'lucide-react';

interface BlogEditorProps {
  config: GitHubConfig;
}

interface BlogPost {
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

export const BlogEditor: React.FC<BlogEditorProps> = ({ config }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const api = new GitHubAPI(config);

  const expectedPosts = [
    { path: 'src/content/blog/es/errores-implementacion-software.mdx', lang: 'es' as const },
    { path: 'src/content/blog/es/ia-veterinaria-2024.mdx', lang: 'es' as const },
    { path: 'src/content/blog/es/automatizacion-procesos-clinicos.mdx', lang: 'es' as const },
    { path: 'src/content/blog/en/ai-veterinary-diagnostics.mdx', lang: 'en' as const },
    { path: 'src/content/blog/en/market-entry-strategies.mdx', lang: 'en' as const },
  ];

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    const loadedPosts: BlogPost[] = [];

    for (const expectedPost of expectedPosts) {
      try {
        const response = await api.getFile(expectedPost.path);
        const parsed = parseMDXContent(response.content);
        loadedPosts.push({
          path: expectedPost.path,
          slug: expectedPost.path.split('/').pop()?.replace('.mdx', '') || '',
          ...parsed,
          sha: response.sha
        });
      } catch (error) {
        // If file doesn't exist, create a placeholder
        const slug = expectedPost.path.split('/').pop()?.replace('.mdx', '') || '';
        loadedPosts.push(createPlaceholderPost(expectedPost.path, slug, expectedPost.lang));
      }
    }

    setPosts(loadedPosts);
    setIsLoading(false);
  };

  const parseMDXContent = (content: string) => {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatterMatch) {
      return {
        title: 'Untitled',
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
      title: frontmatterObj.title || 'Untitled',
      date: frontmatterObj.date || new Date().toISOString().split('T')[0],
      excerpt: frontmatterObj.excerpt || '',
      cover: frontmatterObj.cover || '',
      lang: frontmatterObj.lang || 'es',
      tags: Array.isArray(frontmatterObj.tags) ? frontmatterObj.tags : [],
      content: bodyContent
    };
  };

  const createPlaceholderPost = (path: string, slug: string, lang: 'es' | 'en'): BlogPost => {
    const isSpanish = lang === 'es';
    return {
      path,
      slug,
      title: isSpanish ? 'Nuevo Post' : 'New Post',
      date: new Date().toISOString().split('T')[0],
      excerpt: isSpanish ? 'Descripción del post' : 'Post description',
      cover: '/images/blog/placeholder.jpg',
      lang,
      tags: [],
      content: isSpanish 
        ? `# ${slug.replace(/-/g, ' ')}\n\nContenido del post aquí...`
        : `# ${slug.replace(/-/g, ' ')}\n\nPost content here...`
    };
  };

  const savePost = async (post: BlogPost) => {
    setIsSaving(true);
    try {
      const tagsString = post.tags.length > 0 
        ? `[${post.tags.map(tag => `"${tag}"`).join(', ')}]`
        : '[]';

      const frontmatter = `---
title: "${post.title}"
date: "${post.date}"
excerpt: "${post.excerpt}"
cover: "${post.cover}"
lang: "${post.lang}"
tags: ${tagsString}
---`;

      const fullContent = `${frontmatter}\n\n${post.content}`;

      if (post.sha) {
        await api.updateFile(post.path, fullContent, post.sha, `Update blog post: ${post.title}`);
      } else {
        await api.createFile(post.path, fullContent, `Create blog post: ${post.title}`);
      }

      toast({
        title: "Post guardado",
        description: `El post "${post.title}" se ha guardado correctamente.`,
      });

      await loadPosts();
      setEditingPost(null);
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el post. Verifica tu conexión a GitHub.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateEditingPost = (updates: Partial<BlogPost>) => {
    if (editingPost) {
      setEditingPost({ ...editingPost, ...updates });
    }
  };

  const createNewPost = (lang: 'es' | 'en') => {
    const timestamp = Date.now();
    const slug = `nuevo-post-${timestamp}`;
    const path = `src/content/blog/${lang}/${slug}.mdx`;
    
    const newPost = createPlaceholderPost(path, slug, lang);
    setEditingPost(newPost);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Cargando posts...</div>;
  }

  if (editingPost) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Editando Post</h2>
          <div className="flex gap-2">
            <Button
              onClick={() => setEditingPost(null)}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => savePost(editingPost)}
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
              value={editingPost.title}
              onChange={(e) => updateEditingPost({ title: e.target.value })}
              placeholder="Título del post"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Fecha</label>
            <Input
              type="date"
              value={editingPost.date}
              onChange={(e) => updateEditingPost({ date: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Excerpt</label>
          <Textarea
            value={editingPost.excerpt}
            onChange={(e) => updateEditingPost({ excerpt: e.target.value })}
            placeholder="Breve descripción del post"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Imagen de portada</label>
            <Input
              value={editingPost.cover}
              onChange={(e) => updateEditingPost({ cover: e.target.value })}
              placeholder="/images/blog/post-cover.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tags (separados por coma)</label>
            <Input
              value={editingPost.tags.join(', ')}
              onChange={(e) => updateEditingPost({ 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
              })}
              placeholder="IA, Diagnóstico, Tecnología"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Contenido (MDX)</label>
          <Textarea
            value={editingPost.content}
            onChange={(e) => updateEditingPost({ content: e.target.value })}
            placeholder="# Título del post&#10;&#10;Contenido del post en MDX..."
            rows={20}
            className="font-mono text-sm"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Editor de Blog</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => createNewPost('es')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo Post (ES)
          </Button>
          <Button
            onClick={() => createNewPost('en')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo Post (EN)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Card key={post.path} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                <Badge variant={post.lang === 'es' ? 'default' : 'secondary'}>
                  {post.lang.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {post.date}
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {post.slug}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {post.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.tags.length - 3}
                  </Badge>
                )}
              </div>
              <Button
                onClick={() => setEditingPost(post)}
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