-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  client_ip TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (though this table doesn't need user-specific access)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- No RLS policies needed since this is for admin access only through edge functions