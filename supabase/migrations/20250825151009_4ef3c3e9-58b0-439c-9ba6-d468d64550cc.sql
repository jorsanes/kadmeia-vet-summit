-- Fix RLS policies for contact_messages table
CREATE POLICY "Only authenticated admins can read contact messages" 
ON public.contact_messages 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Allow anyone to insert contact messages (public contact form)
CREATE POLICY "Anyone can submit contact messages" 
ON public.contact_messages 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Update newsletter_subscribers policies to be more restrictive for updates/deletes
CREATE POLICY "Only admins can update newsletter subscribers" 
ON public.newsletter_subscribers 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete newsletter subscribers" 
ON public.newsletter_subscribers 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Add missing trigger for update_updated_at on blog_posts
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add missing trigger for update_updated_at on case_studies
CREATE TRIGGER update_case_studies_updated_at
    BEFORE UPDATE ON public.case_studies
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();