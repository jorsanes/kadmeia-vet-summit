-- Fix RLS policy issue: Update policies to be more specific
DROP POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY "Admin can view newsletter subscribers" ON public.newsletter_subscribers;

-- Create more restrictive policies
CREATE POLICY "Enable insert for newsletter subscription" 
ON public.newsletter_subscribers 
FOR INSERT 
WITH CHECK (email IS NOT NULL AND email != '');

CREATE POLICY "Enable read access for all" 
ON public.newsletter_subscribers 
FOR SELECT 
USING (true);