-- Create table for editable page content
CREATE TABLE public.editable_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL UNIQUE, -- 'home', 'services', 'about', etc.
  lang TEXT NOT NULL DEFAULT 'es',
  content JSONB NOT NULL,
  last_modified TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.editable_pages ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access only
CREATE POLICY "Admins can view all editable pages" 
ON public.editable_pages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.uid() = auth.users.id 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

CREATE POLICY "Admins can insert editable pages" 
ON public.editable_pages 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.uid() = auth.users.id 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

CREATE POLICY "Admins can update editable pages" 
ON public.editable_pages 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.uid() = auth.users.id 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Create unique index for page_key + lang combination
CREATE UNIQUE INDEX idx_editable_pages_key_lang ON public.editable_pages(page_key, lang);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_editable_pages_last_modified
BEFORE UPDATE ON public.editable_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();