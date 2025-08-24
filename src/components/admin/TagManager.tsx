
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TagManagerProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  lang: 'es' | 'en';
}

// Lista predefinida de tags comunes para empezar
const commonTags = {
  es: [
    'IA Veterinaria',
    'Diagnóstico',
    'Radiología',
    'Clínica Veterinaria',
    'Tecnología',
    'Automatización',
    'PACS',
    'Workflow',
    'Innovación',
    'Casos Clínicos'
  ],
  en: [
    'Veterinary AI',
    'Diagnosis',
    'Radiology',
    'Veterinary Clinic',
    'Technology',
    'Automation',
    'PACS',
    'Workflow',
    'Innovation',
    'Clinical Cases'
  ]
};

export const TagManager: React.FC<TagManagerProps> = ({ selectedTags, onTagsChange, lang }) => {
  const [open, setOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const availableTags = commonTags[lang] || commonTags.es;

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagsChange(selectedTags.filter(t => t !== tagName));
    } else {
      onTagsChange([...selectedTags, tagName]);
    }
  };

  const removeTag = (tagName: string) => {
    onTagsChange(selectedTags.filter(t => t !== tagName));
  };

  const addNewTag = () => {
    if (!newTagName.trim()) return;
    
    const trimmedTag = newTagName.trim();
    if (!selectedTags.includes(trimmedTag)) {
      onTagsChange([...selectedTags, trimmedTag]);
    }
    setNewTagName('');
    toast.success('Tag añadido correctamente');
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between"
            >
              Seleccionar tags...
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Buscar tags..." />
              <CommandList>
                <CommandEmpty>No se encontraron tags.</CommandEmpty>
                <CommandGroup>
                  {availableTags.map((tag) => (
                    <CommandItem
                      key={tag}
                      value={tag}
                      onSelect={() => {
                        toggleTag(tag);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedTags.includes(tag) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {tag}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="flex gap-2">
          <Input
            placeholder="Nuevo tag"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addNewTag()}
          />
          <Button
            type="button"
            variant="outline"
            onClick={addNewTag}
            disabled={!newTagName.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
