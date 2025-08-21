import React, { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TagFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagFilter({ availableTags, selectedTags, onChange }: TagFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Sincronizar con query params al montar
  useEffect(() => {
    const tagsFromUrl = searchParams.get('tags');
    if (tagsFromUrl) {
      const urlTags = tagsFromUrl.split(',').filter(tag => 
        availableTags.includes(tag)
      );
      if (urlTags.length > 0) {
        onChange(urlTags);
      }
    }
  }, [searchParams, availableTags, onChange]);

  // Actualizar URL cuando cambian los tags
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (selectedTags.length > 0) {
      newSearchParams.set('tags', selectedTags.join(','));
    } else {
      newSearchParams.delete('tags');
    }
    
    setSearchParams(newSearchParams, { replace: true });
  }, [selectedTags, searchParams, setSearchParams]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter(t => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  if (availableTags.length === 0) return null;

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          Filtrar por:
        </span>
        
        <motion.div 
          className="flex flex-wrap items-center gap-2"
          layout
        >
          <AnimatePresence mode="popLayout">
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <motion.button
                  key={tag}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 30,
                    layout: { duration: 0.2 }
                  }}
                  onClick={() => toggleTag(tag)}
                  className={`
                    inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium
                    transition-all duration-200 border-2
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2
                    ${isSelected 
                      ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90' 
                      : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                    }
                  `}
                  aria-pressed={isSelected}
                  aria-label={`${isSelected ? 'Quitar' : 'Agregar'} filtro ${tag}`}
                >
                  {tag}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      <X className="h-3 w-3" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {selectedTags.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAll}
            className="
              text-xs text-muted-foreground hover:text-foreground
              underline underline-offset-2 transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded
            "
          >
            Limpiar filtros
          </motion.button>
        )}
      </div>

      {selectedTags.length > 0 && (
        <motion.div 
          className="mt-3 text-sm text-muted-foreground"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          Mostrando contenido con: {selectedTags.join(', ')}
        </motion.div>
      )}
    </motion.div>
  );
}