import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X, ChevronDown, Plus } from 'lucide-react';

interface TagPickerProps {
  selectedTags: string[];
  availableTags: string[];
  language: 'es' | 'en';
  onChange: (tags: string[]) => void;
}

export const TagPicker: React.FC<TagPickerProps> = ({
  selectedTags,
  availableTags,
  language,
  onChange
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter available tags based on language preference and exclude already selected
  const filteredTags = availableTags.filter(tag => 
    !selectedTags.includes(tag) &&
    tag.toLowerCase().includes(inputValue.toLowerCase())
  );

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      onChange([...selectedTags, trimmedTag]);
    }
    setInputValue('');
    setNewTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = newTagInput.trim();
    
    // Handle multiple delimiters: Enter, comma, semicolon
    if ((e.key === 'Enter' || e.key === ',' || e.key === ';') && value) {
      e.preventDefault();
      addTag(value);
    } else if (e.key === 'Backspace' && !newTagInput && selectedTags.length > 0) {
      // Remove last tag if input is empty and backspace is pressed
      removeTag(selectedTags[selectedTags.length - 1]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Check for delimiters in the input and auto-add tags
    if (value.includes(',') || value.includes(';')) {
      const delimiter = value.includes(',') ? ',' : ';';
      const parts = value.split(delimiter);
      const newTags = parts.slice(0, -1).map(part => part.trim()).filter(Boolean);
      
      newTags.forEach(tag => {
        if (!selectedTags.includes(tag)) {
          addTag(tag);
        }
      });
      
      value = parts[parts.length - 1].trim();
    }
    
    setNewTagInput(value);
  };

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        Tags * (Enter, comma, or semicolon to add)
      </label>
      
      {/* Selected tags display */}
      <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[2.5rem] bg-background">
        {selectedTags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:bg-destructive/20 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        
        {/* Inline input for new tags */}
        <input
          ref={inputRef}
          type="text"
          value={newTagInput}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={selectedTags.length === 0 ? "Type a tag..." : ""}
          className="outline-none border-none bg-transparent flex-1 min-w-[120px] text-sm"
        />
      </div>

      {/* Suggestions dropdown */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-muted-foreground"
            size="sm"
          >
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Select from available tags
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search tags..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>
                <div className="p-2 text-center">
                  <p className="text-sm text-muted-foreground mb-2">No tags found</p>
                  {inputValue && (
                    <Button
                      size="sm"
                      onClick={() => {
                        addTag(inputValue);
                        setOpen(false);
                      }}
                    >
                      Create "{inputValue}"
                    </Button>
                  )}
                </div>
              </CommandEmpty>
              <CommandGroup>
                {filteredTags.map((tag) => (
                  <CommandItem
                    key={tag}
                    onSelect={() => {
                      addTag(tag);
                      setOpen(false);
                    }}
                  >
                    {tag}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Help text */}
      <p className="text-xs text-muted-foreground">
        Type tags and press Enter, comma (,) or semicolon (;) to add them. Click on suggested tags below or create new ones.
      </p>
    </div>
  );
};