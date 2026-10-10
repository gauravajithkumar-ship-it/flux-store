-- Copy and run this script in your Supabase SQL Editor

-- 1. Create the branches table
CREATE TABLE IF NOT EXISTS public.branches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    branch_name TEXT NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS and create policies for branches
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public reads of branches" ON public.branches;
CREATE POLICY "Allow public reads of branches"
ON public.branches
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Allow public all to branches" ON public.branches;
CREATE POLICY "Allow public all to branches"
ON public.branches
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 3. Seed Initial Branch Data (optional)
INSERT INTO public.branches (branch_name, address) VALUES
('Main Branch', '123 MG Road, Mumbai, Maharashtra - 400001'),
('Andheri West', '45 Link Road, Andheri West, Mumbai, Maharashtra - 400053')
ON CONFLICT DO NOTHING;
