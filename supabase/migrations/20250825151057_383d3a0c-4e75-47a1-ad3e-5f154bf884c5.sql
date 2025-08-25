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