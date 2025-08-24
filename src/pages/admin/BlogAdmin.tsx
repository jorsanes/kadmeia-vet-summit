import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WysiwygEditor } from '@/components/admin/WysiwygEditor';
import { TiptapRenderer } from '@/components/blog/TiptapRenderer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2, Eye, Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { PageSeo } from '@/components/seo/PageSeo';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: any;
  cover_image?: string | null;
  lang: string;
  tags: string[];
  status: string;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  lang: 'es' | 'en';
  tags: string;
  status: 'draft' | 'published';
}

export const BlogAdmin: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [editorContent, setEditorContent] = useState<any>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<BlogFormData>();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Error al cargar los posts');
    } finally {
      setLoading(false);
    }
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingPost(null);
    setEditorContent(null);
    setPreviewMode(false);
    reset({
      title: '',
      slug: '',
      excerpt: '',
      cover_image: '',
      lang: 'es',
      tags: '',
      status: 'draft',
    });
  };

  const startEditing = (post: BlogPost) => {
    setEditingPost(post);
    setIsCreating(false);
    setEditorContent(post.content);
    setPreviewMode(false);
    reset({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      cover_image: post.cover_image || '',
      lang: post.lang as 'es' | 'en',
      tags: post.tags.join(', '),
      status: post.status as 'draft' | 'published',
    });
  };

  const cancelEditing = () => {
    setEditingPost(null);
    setIsCreating(false);
    setEditorContent(null);
    setPreviewMode(false);
    reset();
  };

  const onSubmit = async (data: BlogFormData) => {
    try {
      const postData = {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: editorContent,
        cover_image: data.cover_image || null,
        lang: data.lang,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        status: data.status,
        published_at: data.status === 'published' ? new Date().toISOString() : null,
      };

      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);

        if (error) throw error;
        toast.success('Post actualizado correctamente');
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;
        toast.success('Post creado correctamente');
      }

      await loadPosts();
      cancelEditing();
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Error al guardar el post');
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Post eliminado correctamente');
      await loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Error al eliminar el post');
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const watchedTitle = watch('title');
  useEffect(() => {
    if (watchedTitle && (isCreating || !editingPost)) {
      setValue('slug', generateSlug(watchedTitle));
    }
  }, [watchedTitle, setValue, isCreating, editingPost]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (isCreating || editingPost) {
    return (
      <div className="container mx-auto py-8">
        <PageSeo
          title="Admin Blog - KADMEIA"
          description="Gestión de contenido del blog"
          noindex
        />
        
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">
              {isCreating ? 'Crear Nuevo Post' : 'Editar Post'}
            </h1>
            <Button variant="outline" onClick={cancelEditing}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={previewMode ? "preview" : "edit"} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit" onClick={() => setPreviewMode(false)}>
                  Editar
                </TabsTrigger>
                <TabsTrigger value="preview" onClick={() => setPreviewMode(true)}>
                  Vista Previa
                </TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      {...register('title', { required: true })}
                      placeholder="Título del post"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      {...register('slug', { required: true })}
                      placeholder="url-del-post"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lang">Idioma</Label>
                    <Select 
                      value={watch('lang')} 
                      onValueChange={(value) => setValue('lang', value as 'es' | 'en')}
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
                  
                  <div>
                    <Label htmlFor="status">Estado</Label>
                    <Select 
                      value={watch('status')} 
                      onValueChange={(value) => setValue('status', value as 'draft' | 'published')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Borrador</SelectItem>
                        <SelectItem value="published">Publicado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="excerpt">Resumen</Label>
                  <Textarea
                    id="excerpt"
                    {...register('excerpt')}
                    placeholder="Breve descripción del post"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="cover_image">Imagen de portada (URL)</Label>
                  <Input
                    id="cover_image"
                    {...register('cover_image')}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (separados por comas)</Label>
                  <Input
                    id="tags"
                    {...register('tags')}
                    placeholder="ia, veterinaria, tecnología"
                  />
                </div>

                <div>
                  <Label>Contenido</Label>
                  <WysiwygEditor
                    content={editorContent}
                    onChange={setEditorContent}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  {isCreating ? 'Crear Post' : 'Actualizar Post'}
                </Button>
              </TabsContent>

              <TabsContent value="preview">
                <Card>
                  <CardHeader>
                    <CardTitle>{watch('title') || 'Título del post'}</CardTitle>
                    <CardDescription>
                      <Badge variant="secondary">{watch('lang')}</Badge>
                      <Badge variant={watch('status') === 'published' ? 'default' : 'outline'} className="ml-2">
                        {watch('status') === 'published' ? 'Publicado' : 'Borrador'}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {watch('cover_image') && (
                      <img 
                        src={watch('cover_image')} 
                        alt="Portada" 
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <p className="text-muted-foreground mb-4">{watch('excerpt')}</p>
                    <TiptapRenderer content={editorContent} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <PageSeo
        title="Admin Blog - KADMEIA"
        description="Gestión de contenido del blog"
        noindex
      />
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gestión del Blog</h1>
        <Button onClick={startCreating}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Nuevo Post
        </Button>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {post.title}
                    <Badge variant="secondary">{post.lang}</Badge>
                    <Badge variant={post.status === 'published' ? 'default' : 'outline'}>
                      {post.status === 'published' ? 'Publicado' : 'Borrador'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    /{post.lang === 'en' ? 'en/' : ''}blog/{post.slug}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => startEditing(post)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deletePost(post.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">{post.excerpt}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Creado: {new Date(post.created_at).toLocaleDateString('es-ES')} | 
                Actualizado: {new Date(post.updated_at).toLocaleDateString('es-ES')}
              </p>
            </CardContent>
          </Card>
        ))}

        {posts.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No hay posts creados aún.</p>
              <Button onClick={startCreating} className="mt-4">
                <PlusCircle className="w-4 h-4 mr-2" />
                Crear tu primer post
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};