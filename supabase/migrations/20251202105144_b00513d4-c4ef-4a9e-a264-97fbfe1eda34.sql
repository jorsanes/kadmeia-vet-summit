-- Fix editable_pages trigger issue by recreating it properly
-- Drop all existing triggers
DROP TRIGGER IF EXISTS update_editable_pages_updated_at ON public.editable_pages CASCADE;
DROP TRIGGER IF EXISTS update_editable_pages_last_modified ON public.editable_pages CASCADE;

-- Drop all old functions
DROP FUNCTION IF EXISTS public.update_editable_pages_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.update_last_modified() CASCADE;

-- Create a new function with a unique name that updates last_modified
CREATE OR REPLACE FUNCTION public.handle_editable_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_modified = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic last_modified updates
CREATE TRIGGER set_editable_pages_last_modified
  BEFORE UPDATE ON public.editable_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_editable_pages_updated_at();