import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { WysiwygEditor } from "./WysiwygEditor";
import { TiptapRenderer } from "../blog/TiptapRenderer";
import { TagManager } from "./TagManager";
import { GitHubAPI } from "@/lib/github";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus, Edit, RefreshCw, Save, X } from "lucide-react";

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: any;
  cover_image?: string;
  lang: 'es' | 'en';
  tags: string[];
  status: 'draft' | 'published';
  published_at?: string;
  client?: string;
  sector?: string;
  ubicacion?: string;
  servicios: string[];
  created_at: string;
  updated_at: string;
}

interface CaseFormData {
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  lang: 'es' | 'en';
  status: 'draft' | 'published';
  client: string;
  sector: string;
  ubicacion: string;
  servicios: string;
}

export function CasesAdminV2({ config }: { config?: any }) {
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCase, setEditingCase] = useState<CaseStudy | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { user, isAdmin } = useAuth();

  const form = useForm<CaseFormData>({
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      cover_image: '',
      lang: 'es',
      status: 'draft',
      client: '',
      sector: '',
      ubicacion: '',
      servicios: ''
    }
  });

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCases((data || []) as CaseStudy[]);
    } catch (error) {
      console.error('Error loading cases:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los casos de estudio",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startCreating = () => {
    setCreating(true);
    setEditingCase(null);
    form.reset();
    setEditorContent('');
    setSelectedTags([]);
    setPreviewMode(false);
  };

  const startEditing = (caseStudy: CaseStudy) => {
    setEditingCase(caseStudy);
    setCreating(false);
    form.reset({
      title: caseStudy.title,
      slug: caseStudy.slug,
      excerpt: caseStudy.excerpt || '',
      cover_image: caseStudy.cover_image || '',
      lang: caseStudy.lang,
      status: caseStudy.status,
      client: caseStudy.client || '',
      sector: caseStudy.sector || '',
      ubicacion: caseStudy.ubicacion || '',
      servicios: caseStudy.servicios?.join(', ') || ''
    });
    setEditorContent(typeof caseStudy.content === 'string' ? caseStudy.content : JSON.stringify(caseStudy.content || {}));
    setSelectedTags(caseStudy.tags || []);
    setPreviewMode(false);
  };

  const cancelEditing = () => {
    setEditingCase(null);
    setCreating(false);
    form.reset();
    setEditorContent('');
    setSelectedTags([]);
    setPreviewMode(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    const title = form.watch('title');
    if (title && !editingCase) {
      form.setValue('slug', generateSlug(title));
    }
  }, [form.watch('title')]);

  const onSubmit = async (data: CaseFormData) => {
    try {
      setSaving(true);

      const serviciosArray = data.servicios
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const caseData = {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: editorContent ? (typeof editorContent === 'string' && editorContent.startsWith('{') ? JSON.parse(editorContent) : editorContent) : {},
        cover_image: data.cover_image,
        lang: data.lang,
        tags: selectedTags,
        status: data.status,
        client: data.client,
        sector: data.sector,
        ubicacion: data.ubicacion,
        servicios: serviciosArray,
        published_at: data.status === 'published' ? new Date().toISOString() : null
      };

      if (editingCase) {
        const { error } = await supabase
          .from('case_studies')
          .update(caseData)
          .eq('id', editingCase.id);

        if (error) throw error;
        toast({
          title: "Caso actualizado",
          description: "El caso de estudio se ha actualizado correctamente"
        });
      } else {
        const { error } = await supabase
          .from('case_studies')
          .insert([caseData]);

        if (error) throw error;
        toast({
          title: "Caso creado",
          description: "El caso de estudio se ha creado correctamente"
        });
      }

      await loadCases();
      cancelEditing();
    } catch (error) {
      console.error('Error saving case:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el caso de estudio",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteCase = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este caso de estudio?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('case_studies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Caso eliminado",
        description: "El caso de estudio se ha eliminado correctamente"
      });

      await loadCases();
    } catch (error) {
      console.error('Error deleting case:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el caso de estudio",
        variant: "destructive"
      });
    }
  };

  const deleteOldMDXCases = async () => {
    if (!config) {
      toast({
        title: "Error",
        description: "Configuración de GitHub no disponible",
        variant: "destructive"
      });
      return;
    }

    if (!confirm('¿Eliminar todos los archivos MDX de casos? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const github = new GitHubAPI(config);
      const files = await github.getTree('src/content/casos', true);
      
      const mdxFiles = files.filter(file => 
        file.type === 'blob' && file.path.endsWith('.mdx')
      );

      for (const file of mdxFiles) {
        const fileContent = await github.getFile(file.path);
        await github.deleteFile(file.path, fileContent.sha, `Delete old MDX case: ${file.path}`);
      }

      toast({
        title: "MDX eliminados",
        description: `Se eliminaron ${mdxFiles.length} archivos MDX de casos`
      });
    } catch (error) {
      console.error('Error deleting MDX files:', error);
      toast({
        title: "Error",
        description: "No se pudieron eliminar algunos archivos MDX",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando casos de estudio...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Alert>
        <AlertDescription>
          Solo los administradores pueden gestionar casos de estudio.
        </AlertDescription>
      </Alert>
    );
  }

  if (creating || editingCase) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {editingCase ? 'Editar Caso' : 'Crear Nuevo Caso'}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={cancelEditing}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              onClick={form.handleSubmit(onSubmit)} 
              disabled={saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>

        <Tabs value={previewMode ? "preview" : "edit"} className="w-full">
          <TabsList>
            <TabsTrigger 
              value="edit" 
              onClick={() => setPreviewMode(false)}
            >
              Editar
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              onClick={() => setPreviewMode(true)}
            >
              Vista Previa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      {...form.register('title', { required: true })}
                      placeholder="Título del caso de estudio"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      {...form.register('slug', { required: true })}
                      placeholder="url-del-caso"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lang">Idioma</Label>
                    <Select value={form.watch('lang')} onValueChange={(value: 'es' | 'en') => form.setValue('lang', value)}>
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
                    <Select value={form.watch('status')} onValueChange={(value: 'draft' | 'published') => form.setValue('status', value)}>
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
                    {...form.register('excerpt')}
                    placeholder="Breve descripción del caso"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="cover_image">Imagen de Portada (URL)</Label>
                  <Input
                    id="cover_image"
                    {...form.register('cover_image')}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información del Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="client">Cliente</Label>
                    <Input
                      id="client"
                      {...form.register('client')}
                      placeholder="Nombre del cliente"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sector">Sector</Label>
                    <Input
                      id="sector"
                      {...form.register('sector')}
                      placeholder="Sector de actividad"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ubicacion">Ubicación</Label>
                    <Input
                      id="ubicacion"
                      {...form.register('ubicacion')}
                      placeholder="Ciudad, País"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="servicios">Servicios (separados por comas)</Label>
                  <Input
                    id="servicios"
                    {...form.register('servicios')}
                    placeholder="Consultoría, IA, Automatización"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <TagManager
                  selectedTags={selectedTags}
                  onTagsChange={setSelectedTags}
                  lang={form.watch('lang')}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contenido</CardTitle>
              </CardHeader>
              <CardContent>
                <WysiwygEditor
                  content={editorContent}
                  onChange={setEditorContent}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">{form.watch('title')}</h1>
                  {form.watch('excerpt') && (
                    <p className="text-lg text-muted-foreground">{form.watch('excerpt')}</p>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {selectedTags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {form.watch('client') && <p><strong>Cliente:</strong> {form.watch('client')}</p>}
                    {form.watch('sector') && <p><strong>Sector:</strong> {form.watch('sector')}</p>}
                    {form.watch('ubicacion') && <p><strong>Ubicación:</strong> {form.watch('ubicacion')}</p>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TiptapRenderer content={editorContent} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión de Casos</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadCases}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          {config && (
            <Button variant="outline" onClick={deleteOldMDXCases}>
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar MDX
            </Button>
          )}
          <Button onClick={startCreating}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Caso
          </Button>
        </div>
      </div>

      {cases.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No hay casos de estudio creados aún.
            </p>
            <Button onClick={startCreating}>
              <Plus className="w-4 h-4 mr-2" />
              Crear el primer caso
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {cases.map((caseStudy) => (
            <Card key={caseStudy.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      {caseStudy.title}
                      <Badge variant={caseStudy.status === 'published' ? 'default' : 'secondary'}>
                        {caseStudy.status === 'published' ? 'Publicado' : 'Borrador'}
                      </Badge>
                      <Badge variant="outline">{caseStudy.lang.toUpperCase()}</Badge>
                    </CardTitle>
                    <CardDescription>{caseStudy.excerpt}</CardDescription>
                    {caseStudy.client && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Cliente:</strong> {caseStudy.client}
                      </p>
                    )}
                    <div className="flex gap-1 flex-wrap">
                      {caseStudy.tags?.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditing(caseStudy)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteCase(caseStudy.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}