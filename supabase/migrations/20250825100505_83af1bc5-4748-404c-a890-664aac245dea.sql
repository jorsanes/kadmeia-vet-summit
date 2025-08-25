-- Create case_studies table for WYSIWYG editor
CREATE TABLE public.case_studies (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    excerpt TEXT,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    cover_image TEXT,
    lang TEXT NOT NULL DEFAULT 'es' CHECK (lang IN ('es', 'en')),
    tags TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMP WITH TIME ZONE,
    client TEXT,
    sector TEXT,
    ubicacion TEXT,
    servicios TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(slug, lang)
);

-- Enable Row Level Security
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can manage all case studies" 
ON public.case_studies 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Published case studies are publicly readable" 
ON public.case_studies 
FOR SELECT 
USING (status = 'published');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_case_studies_updated_at
BEFORE UPDATE ON public.case_studies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_case_studies_slug ON public.case_studies(slug);
CREATE INDEX idx_case_studies_lang ON public.case_studies(lang);
CREATE INDEX idx_case_studies_status ON public.case_studies(status);