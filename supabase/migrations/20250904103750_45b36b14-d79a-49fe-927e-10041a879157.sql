-- Fix security issue: Restrict api_throttle table access to admins only
-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Edge functions can manage throttling data" ON public.api_throttle;

-- Create new restrictive policies
-- Edge functions can insert/update for rate limiting (they use service role)
CREATE POLICY "Service role can manage throttling data" 
ON public.api_throttle 
FOR ALL 
TO service_role 
USING (true);

-- Only admins can read throttling data (for monitoring purposes)
CREATE POLICY "Only admins can read throttling data" 
ON public.api_throttle 
FOR SELECT 
TO authenticated 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Prevent public access to sensitive IP data
-- No policy for INSERT/UPDATE/DELETE for regular users means they're blocked