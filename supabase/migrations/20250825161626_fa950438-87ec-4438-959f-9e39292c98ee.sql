-- SECURITY FIX: Remove public read access to newsletter_subscribers table
-- This prevents email harvesting by spammers while maintaining functionality

-- Drop the problematic public read policy
DROP POLICY IF EXISTS "Enable read access for all" ON public.newsletter_subscribers;

-- Create a new policy that only allows admins to read newsletter subscribers
CREATE POLICY "Only admins can read newsletter subscribers" 
ON public.newsletter_subscribers 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Note: INSERT policy remains unchanged to allow newsletter subscriptions
-- Note: Admin UPDATE/DELETE policies remain unchanged for subscriber management