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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GitHubAPI, GitHubConfig } from '@/lib/github';
import { useToast } from '@/hooks/use-toast';
import { BlogMeta } from '@/content/schemas';
import { enhancedMDXComponents } from '@/components/mdx';
import { MDXProvider } from '@mdx-js/react';
import { MdxPreview } from '@/components/mdx/MdxPreview';
import { BlogHeader } from '@/components/blog/BlogHeader';
import { TagPicker } from './TagPicker';
import matter from 'gray-matter';
import { 
  Calendar, 
  Clock, 
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
  X,
  ChevronDown
} from 'lucide-react';

interface BlogEditorV2Props {
  config: GitHubConfig;
}

interface BlogPostFile {
  path: string;
  slug: string;
  lang: 'es' | 'en';
  meta: BlogMeta;
  content: string;
  sha?: string;
  hasErrors: boolean;
  errors: string[];
}

const BLOG_TEMPLATE = {
  es: {
    title: "Nuevo artículo",
    excerpt: "Descripción breve del artículo que aparecerá en las tarjetas y redes sociales",
    content: `# Nuevo artículo

Escribe aquí el contenido de tu artículo usando Markdown.

## Sección de ejemplo

Puedes usar **texto en negrita**, *cursiva*, [enlaces](https://kadmeia.com) y más elementos de Markdown.

### Lista de ejemplo

- Elemento 1
- Elemento 2
- Elemento 3

> Cita de ejemplo para destacar información importante

## Conclusión

Resumen y call-to-action final.`
  },
  en: {
    title: "New article",
    excerpt: "Brief article description that will appear in cards and social media",
    content: `# New article

Write your article content here using Markdown.

## Example section

You can use **bold text**, *italics*, [links](https://kadmeia.com) and more Markdown elements.

### Example list

- Item 1
- Item 2
- Item 3

> Example quote to highlight important information

## Conclusion

Summary and final call-to-action.`
  }
};

export const BlogEditorV2: React.FC<BlogEditorV2Props> = ({ config }) => {
  const [posts, setPosts] = useState<BlogPostFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPostFile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const { toast } = useToast();

  const api = new GitHubAPI(config);

  useEffect(() => {
    loadBlogFiles();
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const esTagsResponse = await fetch('/src/content/taxonomy/tags.es.json');
      const enTagsResponse = await fetch('/src/content/taxonomy/tags.en.json');
      
      if (esTagsResponse.ok && enTagsResponse.ok) {
        const esTags = await esTagsResponse.json();
        const enTags = await enTagsResponse.json();
        
        // Combine and deduplicate tags
        const allTags = [...new Set([...esTags, ...enTags])];
        setAvailableTags(allTags);
      }
    } catch (error) {
      console.error('Error loading tags:', error);
      // Fallback tags if loading fails
      setAvailableTags(['IA', 'AI', 'Tecnología', 'Technology', 'Veterinaria', 'Veterinary']);
    }
  };

  const loadBlogFiles = async () => {
    if (!api) return;
    setIsLoading(true);
    setIsLoadingFiles(true);
    
    try {
      // Use GitHub API to get the file tree
      const tree = await api.getTree('src/content/blog', true);
      const mdxFiles = tree.filter(item => 
        item.path.endsWith('.mdx') && 
        (item.path.includes('/es/') || item.path.includes('/en/'))
      );

      const loadedPosts: BlogPostFile[] = [];

      for (const file of mdxFiles) {
        try {
          const response = await api.getFile(file.path);
          const parsed = parseAndValidatePost(response.content, file.path);
          
          loadedPosts.push({
            ...parsed,
            sha: response.sha
          });
        } catch (error) {
          console.error(`Error loading ${file.path}:`, error);
          // Add placeholder for failed files
          const slug = file.path.split('/').pop()?.replace('.mdx', '') || '';
          const lang = file.path.includes('/en/') ? 'en' as const : 'es' as const;
          
          loadedPosts.push({
            path: file.path,
            slug,
            lang,
            meta: createDefaultMeta(slug, lang),
            content: '',
            hasErrors: true,
            errors: ['Failed to load file']
          });
        }
      }

      // Remove duplicates by path and sort by date
      const uniquePosts = loadedPosts.reduce((acc, post) => {
        if (!acc.find(p => p.path === post.path)) {
          acc.push(post);
        }
        return acc;
      }, [] as BlogPostFile[]);

      setPosts(uniquePosts.sort((a, b) => 
        new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
      ));
    } catch (error) {
      toast({
        title: "Error loading files",
        description: "Could not load blog files from GitHub",
        variant: "destructive"
      });
    } finally {
      setIsLoadingFiles(false);
      setIsLoading(false);
    }
  };

  const parseAndValidatePost = (content: string, path: string): Omit<BlogPostFile, 'sha'> => {
    const slug = path.split('/').pop()?.replace('.mdx', '') || '';
    const lang = path.includes('/en/') ? 'en' as const : 'es' as const;
    
    try {
      const { data: frontmatter, content: bodyContent } = matter(content);
      
      // Validate with Zod schema
      const validation = BlogMeta.safeParse({
        ...frontmatter,
        lang
      });

      if (!validation.success) {
        return {
          path,
          slug,
          lang,
          meta: createDefaultMeta(slug, lang),
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
        meta: createDefaultMeta(slug, lang),
        content: '',
        hasErrors: true,
        errors: [`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  };

  const createDefaultMeta = (slug: string, lang: 'es' | 'en'): BlogMeta => ({
    title: slug.replace(/-/g, ' '),
    date: new Date(),
    excerpt: '',
    cover: '/images/blog/placeholder.jpg',
    lang,
    tags: [],
    draft: true
  });

  const createNewPost = (lang: 'es' | 'en') => {
    const timestamp = Date.now();
    const slug = `nuevo-post-${timestamp}`;
    const path = `src/content/blog/${lang}/${slug}.mdx`;
    const template = BLOG_TEMPLATE[lang];
    
    const newPost: BlogPostFile = {
      path,
      slug,
      lang,
      meta: {
        title: template.title,
        date: new Date(),
        excerpt: template.excerpt,
        cover: '/images/blog/placeholder.jpg',
        lang,
        tags: ['draft'],
        draft: true
      },
      content: template.content,
      hasErrors: false,
      errors: []
    };
    
    setEditingPost(newPost);
    setPreviewMode(false);
  };

  const duplicatePostToLanguage = async (post: BlogPostFile) => {
    const targetLang = post.lang === 'es' ? 'en' : 'es';
    const targetPath = `src/content/blog/${targetLang}/${post.slug}.mdx`;
    const template = BLOG_TEMPLATE[targetLang];
    
    const duplicatedPost: BlogPostFile = {
      path: targetPath,
      slug: post.slug,
      lang: targetLang,
      meta: {
        ...post.meta,
        title: `${template.title} - ${post.meta.title}`,
        excerpt: template.excerpt,
        lang: targetLang
      },
      content: template.content,
      hasErrors: false,
      errors: []
    };
    
    setEditingPost(duplicatedPost);
    setPreviewMode(false);
  };

  const validatePost = (post: BlogPostFile): string[] => {
    const errors: string[] = [];
    
    if (!post.meta.title.trim()) errors.push('Title is required');
    if (!post.meta.excerpt.trim()) errors.push('Excerpt is required');
    if (!post.meta.cover.trim()) errors.push('Cover image is required');
    if (post.meta.tags.length === 0) errors.push('At least one tag is required');
    if (!post.content.trim()) errors.push('Content is required');
    
    // Validate date
    if (isNaN(new Date(post.meta.date).getTime())) {
      errors.push('Date must be valid ISO format');
    }
    
    return errors;
  };

  const savePost = async (post: BlogPostFile) => {
    const validationErrors = validatePost(post);
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
      const frontmatter = matter.stringify(post.content, {
        ...post.meta,
        date: new Date(post.meta.date).toISOString().split('T')[0]
      });

      if (post.sha) {
        await api.updateFile(post.path, frontmatter, post.sha, `Update blog post: ${post.meta.title}`);
      } else {
        await api.createFile(post.path, frontmatter, `Create blog post: ${post.meta.title}`);
      }

      toast({
        title: "Post saved",
        description: `"${post.meta.title}" has been saved successfully.`,
      });

      await loadBlogFiles();
      setEditingPost(null);
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "Error",
        description: "Could not save post. Check your GitHub connection.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deletePost = async (post: BlogPostFile) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${post.meta.title}"?`)) {
      return;
    }

    setIsSaving(true);
    try {
      await api.deleteFile(post.path, post.sha!, `Delete blog post: ${post.meta.title}`);
      
      toast({
        title: "Post eliminado",
        description: `"${post.meta.title}" ha sido eliminado exitosamente.`,
      });

      await loadBlogFiles();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el post. Verifica tu conexión con GitHub.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateEditingPost = (updates: Partial<BlogPostFile>) => {
    if (editingPost) {
      setEditingPost({ 
        ...editingPost, 
        ...updates,
        hasErrors: false,
        errors: []
      });
    }
  };

  const updateEditingMeta = (updates: Partial<BlogMeta>) => {
    if (editingPost) {
      setEditingPost({ 
        ...editingPost, 
        meta: { ...editingPost.meta, ...updates },
        hasErrors: false,
        errors: []
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        Loading blog posts...
      </div>
    );
  }

  if (editingPost) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {editingPost.sha ? 'Editing Post' : 'Creating New Post'}
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
              onClick={() => setEditingPost(null)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={() => savePost(editingPost)}
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
            {previewMode && <TabsTrigger value="preview">Preview</TabsTrigger>}
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <Input
                  value={editingPost.meta.title}
                  onChange={(e) => updateEditingMeta({ title: e.target.value })}
                  placeholder="Article title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">URL Slug *</label>
                <Input
                  value={editingPost.slug}
                  onChange={(e) => updateEditingPost({ 
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'),
                    path: `src/content/blog/${editingPost.lang}/${e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')}.mdx`
                  })}
                  placeholder="article-url-slug"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  URL: /{editingPost.lang === 'es' ? 'blog' : 'en/blog'}/{editingPost.slug}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content (MDX) *</label>
              <Textarea
                value={editingPost.content}
                onChange={(e) => updateEditingPost({ content: e.target.value })}
                placeholder="# Article Title&#10;&#10;Write your content here..."
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
                  value={new Date(editingPost.meta.date).toISOString().split('T')[0]}
                  onChange={(e) => updateEditingMeta({ date: new Date(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <Select
                  value={editingPost.lang}
                  onValueChange={(value: 'es' | 'en') => {
                    updateEditingPost({ lang: value });
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
              <label className="block text-sm font-medium mb-2">Excerpt *</label>
              <Textarea
                value={editingPost.meta.excerpt || ''}
                onChange={(e) => updateEditingMeta({ excerpt: e.target.value })}
                placeholder="Brief article description for cards and social media"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cover Image *</label>
              <Input
                value={editingPost.meta.cover}
                onChange={(e) => updateEditingMeta({ cover: e.target.value })}
                placeholder="/images/blog/article-cover.jpg"
              />
            </div>

            <TagPicker 
              selectedTags={editingPost.meta.tags}
              availableTags={availableTags}
              language={editingPost.lang}
              onChange={(tags) => updateEditingMeta({ tags })}
            />

            <div className="flex items-center space-x-2">
              <Switch
                checked={editingPost.meta.draft || false}
                onCheckedChange={(checked) => updateEditingMeta({ draft: checked })}
              />
              <label className="text-sm font-medium">Draft (not published)</label>
            </div>
          </TabsContent>

          {previewMode && (
            <TabsContent value="preview">
              <div className="space-y-6">
                {/* Production BlogHeader */}
                <BlogHeader
                  title={editingPost.meta.title}
                  date={editingPost.meta.date.toString()}
                  updatedAt={editingPost.meta.updatedAt?.toString()}
                  readingTime={editingPost.meta.readingTime}
                  tags={editingPost.meta.tags}
                  author={editingPost.meta.author?.name ? {
                    name: editingPost.meta.author.name,
                    bio: editingPost.meta.author.bio,
                    avatar: editingPost.meta.author.avatar
                  } : undefined}
                  cover={editingPost.meta.cover}
                  banner={editingPost.meta.banner}
                  excerpt={editingPost.meta.excerpt}
                  lang={editingPost.lang}
                />
                
                {/* Content Preview */}
                <div className="max-w-none blog-prose">
                  <MdxPreview>
                    <MDXProvider components={{
                      ...enhancedMDXComponents,
                      // Hide first H1 to prevent duplication
                      h1: ({ children, ...props }: React.HTMLProps<HTMLHeadingElement>) => {
                        const [isFirstH1, setIsFirstH1] = React.useState(true);
                        React.useEffect(() => {
                          if (isFirstH1) {
                            setIsFirstH1(false);
                            return;
                          }
                        }, [isFirstH1]);
                        
                        if (isFirstH1) return null;
                        return enhancedMDXComponents.h1({ children, ...props });
                      }
                    }}>
                      <div dangerouslySetInnerHTML={{ __html: editingPost.content }} />
                    </MDXProvider>
                  </MdxPreview>
                </div>
              </div>
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
          <h2 className="text-2xl font-bold">Blog Editor</h2>
          <p className="text-muted-foreground">Manage blog posts with validation and preview</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => loadBlogFiles()}
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
            onClick={() => createNewPost('es')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Post (ES)
          </Button>
          <Button
            onClick={() => createNewPost('en')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Post (EN)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Card key={post.path} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{post.meta.title}</CardTitle>
                <div className="flex items-center gap-1">
                  <Badge variant={post.lang === 'es' ? 'default' : 'secondary'}>
                    {post.lang.toUpperCase()}
                  </Badge>
                  {post.hasErrors && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                  {post.meta.draft && (
                    <Badge variant="outline" className="text-xs">DRAFT</Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.meta.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {post.slug}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {post.hasErrors && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    {post.errors.slice(0, 2).join(', ')}
                    {post.errors.length > 2 && '...'}
                  </AlertDescription>
                </Alert>
              )}
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {post.meta.excerpt}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {post.meta.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {post.meta.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.meta.tags.length - 3}
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-1">
                <Button
                  onClick={() => setEditingPost(post)}
                  className="flex-1 flex items-center gap-2"
                  variant="outline"
                  size="sm"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  onClick={() => duplicatePostToLanguage(post)}
                  variant="outline"
                  size="sm"
                  title={`Duplicate to ${post.lang === 'es' ? 'English' : 'Spanish'}`}
                >
                  <Languages className="h-3 w-3" />
                </Button>
                <Button
                  onClick={() => deletePost(post)}
                  variant="outline"
                  size="sm"
                  title="Eliminar post"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};