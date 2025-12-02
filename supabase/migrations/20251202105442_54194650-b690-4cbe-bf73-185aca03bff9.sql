-- Remove duplicate unique constraint that prevents multiple languages
-- Keep only the correct composite constraint on (page_key, lang)
ALTER TABLE public.editable_pages 
DROP CONSTRAINT IF EXISTS editable_pages_page_key_key;