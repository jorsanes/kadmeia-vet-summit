import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { WysiwygEditor } from './WysiwygEditor';
import { 
  getEditablePageContent, 
  saveEditablePageContent, 
  getAllEditablePages,
  getDefaultPageContent,
  type EditablePage 
} from '@/lib/editable-pages';
import { toast } from 'sonner';
import { Save, Eye, Edit, Trash2, Plus, RefreshCw } from 'lucide-react';

const AVAILABLE_PAGES = [
  { key: 'home', name: 'Inicio / Home' },
  { key: 'services', name: 'Servicios / Services' },
  { key: 'about', name: 'Sobre / About' }
] as const;

const LANGUAGES = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' }
] as const;

export const PageEditor: React.FC = () => {
  const [editablePages, setEditablePages] = useState<EditablePage[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [selectedLang, setSelectedLang] = useState<string>('es');
  const [currentContent, setCurrentContent] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load all editable pages on mount
  useEffect(() => {
    loadAllPages();
  }, []);

  // Load specific page content when selection changes
  useEffect(() => {
    if (selectedPage && selectedLang) {
      loadPageContent(selectedPage, selectedLang);
    }
  }, [selectedPage, selectedLang]);

  const loadAllPages = async () => {
    setIsLoading(true);
    try {
      const pages = await getAllEditablePages();
      setEditablePages(pages);
    } catch (error) {
      console.error('Error loading pages:', error);
      toast.error('Error al cargar las páginas');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPageContent = async (pageKey: string, lang: string) => {
    setIsLoading(true);
    try {
      const pageData = await getEditablePageContent(pageKey, lang);
      
      if (pageData) {
        setCurrentContent(pageData.content);
      } else {
        // Load default content if no custom content exists
        const defaultContent = getDefaultPageContent(pageKey, lang);
        setCurrentContent(defaultContent);
      }
    } catch (error) {
      console.error('Error loading page content:', error);
      toast.error('Error al cargar el contenido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedPage || !selectedLang) {
      toast.error('Selecciona una página e idioma');
      return;
    }

    setIsSaving(true);
    try {
      const success = await saveEditablePageContent(selectedPage, selectedLang, currentContent);
      
      if (success) {
        toast.success('Contenido guardado correctamente');
        await loadAllPages(); // Refresh the list
      } else {
        toast.error('Error al guardar el contenido');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Error al guardar el contenido');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNew = async () => {
    if (!selectedPage || !selectedLang) {
      toast.error('Selecciona una página e idioma');
      return;
    }

    const defaultContent = getDefaultPageContent(selectedPage, selectedLang);
    setCurrentContent(defaultContent);
    toast.info('Contenido por defecto cargado. Haz click en Guardar para crear la página.');
  };

  const currentPageData = editablePages.find(
    p => p.page_key === selectedPage && p.lang === selectedLang
  );

  const existingPages = editablePages.filter(p => p.page_key === selectedPage);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Editor de Páginas</h1>
          <p className="text-muted-foreground">
            Edita el contenido de las páginas principales con formato WYSIWYG
          </p>
        </div>
        <Button onClick={loadAllPages} variant="outline" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Page and Language Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Selección de Página
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="page-select">Página</Label>
              <Select value={selectedPage} onValueChange={setSelectedPage}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una página" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_PAGES.map(page => (
                    <SelectItem key={page.key} value={page.key}>
                      {page.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lang-select">Idioma</Label>
              <Select value={selectedLang} onValueChange={setSelectedLang}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un idioma" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Show existing variants for selected page */}
          {existingPages.length > 0 && (
            <div className="space-y-2">
              <Label>Variantes existentes:</Label>
              <div className="flex gap-2 flex-wrap">
                {existingPages.map(page => (
                  <Badge 
                    key={`${page.page_key}-${page.lang}`}
                    variant={page.lang === selectedLang ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => setSelectedLang(page.lang)}
                  >
                    {page.lang.toUpperCase()} 
                    <span className="ml-1 text-xs">
                      ({new Date(page.last_modified).toLocaleDateString()})
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Editor */}
      {selectedPage && selectedLang && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Editor de Contenido: {selectedPage} ({selectedLang.toUpperCase()})
              </CardTitle>
              <div className="flex gap-2">
                {!currentPageData && (
                  <Button onClick={handleCreateNew} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Nueva
                  </Button>
                )}
                <Button onClick={handleSave} disabled={isSaving} className="btn-primary">
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </div>
            {currentPageData && (
              <p className="text-sm text-muted-foreground">
                Última modificación: {new Date(currentPageData.last_modified).toLocaleString()}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground">Cargando contenido...</p>
              </div>
            ) : (
              <ContentEditor 
                content={currentContent}
                onChange={setCurrentContent}
                pageKey={selectedPage}
                lang={selectedLang}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface ContentEditorProps {
  content: any;
  onChange: (content: any) => void;
  pageKey: string;
  lang: string;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ content, onChange, pageKey, lang }) => {
  const updateSection = (sectionKey: string, newContent: any) => {
    onChange({
      ...content,
      [sectionKey]: newContent
    });
  };

  const renderSectionEditor = (sectionKey: string, sectionData: any) => {
    if (!sectionData) return null;

    return (
      <Card key={sectionKey} className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg capitalize">
            {sectionKey.replace(/([A-Z])/g, ' $1').trim()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title field */}
          {sectionData.title !== undefined && (
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                value={sectionData.title || ''}
                onChange={(e) => updateSection(sectionKey, {
                  ...sectionData,
                  title: e.target.value
                })}
                placeholder="Título de la sección"
              />
            </div>
          )}

          {/* Subtitle field */}
          {sectionData.subtitle !== undefined && (
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Input
                value={sectionData.subtitle || ''}
                onChange={(e) => updateSection(sectionKey, {
                  ...sectionData,
                  subtitle: e.target.value
                })}
                placeholder="Subtítulo de la sección"
              />
            </div>
          )}

          {/* Content field with WYSIWYG */}
          {sectionData.content !== undefined && (
            <div className="space-y-2">
              <Label>Contenido</Label>
              <WysiwygEditor
                content={sectionData.content || {}}
                onChange={(newContent) => updateSection(sectionKey, {
                  ...sectionData,
                  content: newContent
                })}
              />
            </div>
          )}

          {/* CTAs for hero sections */}
          {sectionData.cta_primary !== undefined && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CTA Primario</Label>
                <Input
                  value={sectionData.cta_primary || ''}
                  onChange={(e) => updateSection(sectionKey, {
                    ...sectionData,
                    cta_primary: e.target.value
                  })}
                  placeholder="Texto del botón principal"
                />
              </div>
              {sectionData.cta_secondary !== undefined && (
                <div className="space-y-2">
                  <Label>CTA Secundario</Label>
                  <Input
                    value={sectionData.cta_secondary || ''}
                    onChange={(e) => updateSection(sectionKey, {
                      ...sectionData,
                      cta_secondary: e.target.value
                    })}
                    placeholder="Texto del botón secundario"
                  />
                </div>
              )}
            </div>
          )}

          {/* Services array for home page */}
          {sectionData.services && Array.isArray(sectionData.services) && (
            <div className="space-y-4">
              <Label>Servicios</Label>
              {sectionData.services.map((service: any, index: number) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    <Input
                      value={service.title || ''}
                      onChange={(e) => {
                        const updatedServices = [...sectionData.services];
                        updatedServices[index] = { ...service, title: e.target.value };
                        updateSection(sectionKey, {
                          ...sectionData,
                          services: updatedServices
                        });
                      }}
                      placeholder="Título del servicio"
                    />
                    <Input
                      value={service.description || ''}
                      onChange={(e) => {
                        const updatedServices = [...sectionData.services];
                        updatedServices[index] = { ...service, description: e.target.value };
                        updateSection(sectionKey, {
                          ...sectionData,
                          services: updatedServices
                        });
                      }}
                      placeholder="Descripción del servicio"
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (!content || Object.keys(content).length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No hay contenido para editar. Haz click en "Crear Nueva" para cargar el contenido por defecto.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(content).map(([sectionKey, sectionData]) => 
        renderSectionEditor(sectionKey, sectionData)
      )}
    </div>
  );
};