
import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo,
  Image as ImageIcon,
  Link as LinkIcon,
  Palette,
  Heading1,
  Heading2,
  Heading3,
  Table as TableIcon,
  TableCellsMerge,
  TableProperties
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Paleta de colores corporativa KADMEIA
const KADMEIA_COLORS = [
  { name: 'Azul Profundo', value: 'hsl(210 30% 17%)', description: 'Color principal de marca' },
  { name: 'Oro Clásico', value: 'hsl(39 48% 47%)', description: 'Color secundario de marca' },
  { name: 'Marfil Claro', value: 'hsl(38 29% 94%)', description: 'Fondo principal' },
  { name: 'Azul Hover', value: 'hsl(210 30% 22%)', description: 'Estados hover' },
  { name: 'Oro Hover', value: 'hsl(39 48% 42%)', description: 'Estados hover secundario' },
  { name: 'Texto Muted', value: 'hsl(210 15% 40%)', description: 'Texto secundario' },
  { name: 'Éxito', value: 'hsl(140 45% 40%)', description: 'Mensajes de éxito' },
  { name: 'Advertencia', value: 'hsl(35 80% 50%)', description: 'Mensajes de advertencia' },
  { name: 'Error', value: 'hsl(0 65% 50%)', description: 'Mensajes de error' },
  { name: 'Negro', value: '#000000', description: 'Texto negro' },
] as const;

interface WysiwygEditorProps {
  content: any;
  onChange: (content: any) => void;
}

export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({ content, onChange }) => {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      TextStyle,
      Color,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full border border-border',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b border-border',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-border bg-muted/50 px-4 py-2 text-left font-medium',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-border px-4 py-2',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);

      editor?.chain().focus().setImage({ src: publicUrl }).run();
      toast.success('Imagen subida correctamente');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen');
    }
  };

  const addLink = () => {
    const url = window.prompt('URL:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  const setColor = (color: string) => {
    editor?.chain().focus().setColor(color).run();
    setColorPickerOpen(false);
  };

  const insertTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const addColumnBefore = () => {
    editor?.chain().focus().addColumnBefore().run();
  };

  const addColumnAfter = () => {
    editor?.chain().focus().addColumnAfter().run();
  };

  const deleteColumn = () => {
    editor?.chain().focus().deleteColumn().run();
  };

  const addRowBefore = () => {
    editor?.chain().focus().addRowBefore().run();
  };

  const addRowAfter = () => {
    editor?.chain().focus().addRowAfter().run();
  };

  const deleteRow = () => {
    editor?.chain().focus().deleteRow().run();
  };

  const deleteTable = () => {
    editor?.chain().focus().deleteTable().run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="border-b border-border p-2 flex flex-wrap gap-1 bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-accent' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-accent' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-accent' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-accent' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-accent' : ''}
        >
          <Quote className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLink}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        
        <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
            >
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Paleta corporativa KADMEIA</h4>
              <div className="grid grid-cols-2 gap-2">
                {KADMEIA_COLORS.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                    onClick={() => setColor(color.value)}
                  >
                    <div 
                      className="w-4 h-4 rounded border border-border flex-shrink-0"
                      style={{ backgroundColor: color.value }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{color.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{color.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <label className="cursor-pointer">
          <Button type="button" variant="ghost" size="sm" asChild>
            <span>
              <ImageIcon className="h-4 w-4" />
            </span>
          </Button>
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertTable}
          title="Insertar tabla"
        >
          <TableIcon className="h-4 w-4" />
        </Button>

        {editor?.isActive('table') && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addColumnBefore}
              title="Añadir columna antes"
            >
              <TableCellsMerge className="h-4 w-4" />
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addRowBefore}
              title="Añadir fila antes"
            >
              <TableProperties className="h-4 w-4" />
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={deleteColumn}
              title="Eliminar columna"
              className="text-destructive hover:text-destructive"
            >
              ×C
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={deleteRow}
              title="Eliminar fila"
              className="text-destructive hover:text-destructive"
            >
              ×F
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={deleteTable}
              title="Eliminar tabla"
              className="text-destructive hover:text-destructive"
            >
              ×T
            </Button>
          </>
        )}
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      
      <EditorContent 
        editor={editor} 
        className="prose prose-sm max-w-none p-4 min-h-[400px] focus:outline-none [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:font-serif [&_h1]:text-foreground [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:font-serif [&_h2]:text-foreground [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-medium [&_h3]:font-serif [&_h3]:text-foreground [&_h3]:mb-2 [&_table]:my-4 [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-3 [&_th]:py-2 [&_th]:font-semibold"
      />
    </div>
  );
};
