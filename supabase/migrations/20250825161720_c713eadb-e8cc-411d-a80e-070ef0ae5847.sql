-- CRITICAL SECURITY FIX: Remove dangerous "allow all" policy from blog_posts
-- This prevents unauthorized deletion, modification, or creation of blog content

-- Drop the dangerous development policy that allows all operations to everyone
DROP POLICY IF EXISTS "Allow all operations for development" ON public.blog_posts;

-- Create secure policies for blog_posts table

-- 1. Allow public read access only to published blog posts
CREATE POLICY "Public can read published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (status = 'published');

-- 2. Only admins can create new blog posts
CREATE POLICY "Admins can create blog posts" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 3. Only admins can update blog posts
CREATE POLICY "Admins can update blog posts" 
ON public.blog_posts 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 4. Only admins can delete blog posts
CREATE POLICY "Admins can delete blog posts" 
ON public.blog_posts 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Note: This maintains public read access to published content while securing write operations