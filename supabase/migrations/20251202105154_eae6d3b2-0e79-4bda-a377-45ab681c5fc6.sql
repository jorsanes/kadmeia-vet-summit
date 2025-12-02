-- Fix function search path for security
CREATE OR REPLACE FUNCTION public.handle_editable_pages_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.last_modified = now();
  RETURN NEW;
END;
$$;