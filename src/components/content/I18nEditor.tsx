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
import { useTranslation } from 'react-i18next';
import { 
  Save, 
  RefreshCw, 
  Search, 
  Globe,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface I18nEditorProps {
  config: GitHubConfig;
}

interface TranslationData {
  [key: string]: any;
}

export function I18nEditor({ config }: I18nEditorProps) {
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const [esData, setEsData] = useState<TranslationData>({});
  const [enData, setEnData] = useState<TranslationData>({});
  const [esSha, setEsSha] = useState('');
  const [enSha, setEnSha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocale, setSelectedLocale] = useState<'es' | 'en'>('es');

  const api = new GitHubAPI(config);

  useEffect(() => {
    loadTranslations();
  }, []);

  const loadTranslations = async () => {
    setIsLoading(true);
    try {
      const [esFile, enFile] = await Promise.all([
        api.getFile('src/i18n/locales/es.json'),
        api.getFile('src/i18n/locales/en.json')
      ]);

      setEsData(JSON.parse(esFile.content));
      setEnData(JSON.parse(enFile.content));
      setEsSha(esFile.sha);
      setEnSha(enFile.sha);

      toast({
        title: "Traducciones cargadas",
        description: "Los archivos de traducción se han cargado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error al cargar",
        description: "No se pudieron cargar los archivos de traducción",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveTranslations = async () => {
    setIsSaving(true);
    try {
      const esContent = JSON.stringify(esData, null, 2);
      const enContent = JSON.stringify(enData, null, 2);

      await Promise.all([
        api.updateFile(
          'src/i18n/locales/es.json',
          esContent,
          esSha,
          'Update Spanish translations via Content Manager'
        ),
        api.updateFile(
          'src/i18n/locales/en.json',
          enContent,
          enSha,
          'Update English translations via Content Manager'
        )
      ]);

      // Update i18n in runtime for preview
      i18n.addResourceBundle('es', 'translation', esData, true, true);
      i18n.addResourceBundle('en', 'translation', enData, true, true);

      toast({
        title: "Cambios guardados",
        description: "Las traducciones se han actualizado correctamente",
      });

      // Reload to get new SHAs
      await loadTranslations();
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const currentData = selectedLocale === 'es' ? esData : enData;
  const setCurrentData = selectedLocale === 'es' ? setEsData : setEnData;

  const flattenObject = (obj: any, prefix = ''): Array<{ key: string; value: string }> => {
    const result: Array<{ key: string; value: string }> = [];
    
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result.push(...flattenObject(obj[key], fullKey));
      } else {
        result.push({ key: fullKey, value: String(obj[key]) });
      }
    }
    
    return result;
  };

  const updateNestedValue = (obj: any, path: string, value: string) => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  };

  const flattenedData = flattenObject(currentData);
  const filteredData = flattenedData.filter(item =>
    item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateValue = (key: string, value: string) => {
    const newData = { ...currentData };
    updateNestedValue(newData, key, value);
    setCurrentData(newData);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Cargando traducciones...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Editor de Traducciones
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={selectedLocale === 'es' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLocale('es')}
              >
                Español
              </Button>
              <Button
                variant={selectedLocale === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLocale('en')}
              >
                English
              </Button>
              <Button onClick={saveTranslations} disabled={isSaving}>
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
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar clave o texto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Badge variant="secondary">
              {filteredData.length} de {flattenedData.length} elementos
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Translation items */}
      <div className="grid gap-4">
        {filteredData.map(({ key, value }) => (
          <Card key={key}>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Clave
                  </Label>
                  <Badge variant="outline" className="font-mono text-xs">
                    {key}
                  </Badge>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor={key} className="text-sm font-medium">
                    Texto ({selectedLocale.toUpperCase()})
                  </Label>
                  {value.length > 60 ? (
                    <Textarea
                      id={key}
                      value={value}
                      onChange={(e) => updateValue(key, e.target.value)}
                      className="min-h-[80px]"
                    />
                  ) : (
                    <Input
                      id={key}
                      value={value}
                      onChange={(e) => updateValue(key, e.target.value)}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-muted-foreground">
              Intenta con otros términos de búsqueda
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}