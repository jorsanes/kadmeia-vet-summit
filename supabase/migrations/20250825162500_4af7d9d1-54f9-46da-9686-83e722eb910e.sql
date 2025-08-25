-- Create API throttling table for rate limiting
CREATE TABLE public.api_throttle (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  request_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient throttling queries
CREATE INDEX idx_api_throttle_lookup ON public.api_throttle (ip_address, endpoint, window_start);

-- Enable RLS on throttling table
ALTER TABLE public.api_throttle ENABLE ROW LEVEL SECURITY;

-- Only allow edge functions to manage throttling data
CREATE POLICY "Edge functions can manage throttling data" 
ON public.api_throttle 
FOR ALL 
USING (true);

-- Storage hardening: Create explicit policies for blog-images bucket
-- Only admins can upload/modify/delete images
CREATE POLICY "Admins can upload blog images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update blog images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete blog images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Public read access for blog images (bucket is already public)
CREATE POLICY "Public can view blog images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-images');

-- Clean up redundant RLS policies on blog_posts
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;