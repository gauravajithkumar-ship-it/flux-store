-- Checkout Login setup (simple username/password, no Supabase Auth)
-- Run this in your Supabase SQL Editor

-- 1. Fresh Customers table (drop & recreate)
DROP TABLE IF EXISTS public.customers;

CREATE TABLE public.customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Banned')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Link orders to the logged-in customer
ALTER TABLE public."adminOrders" ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;

-- 3. Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- 4. Allow public reads (login check + admin dashboard view)
DROP POLICY IF EXISTS "Allow public reads of customers" ON public.customers;
CREATE POLICY "Allow public reads of customers"
ON public.customers
FOR SELECT
TO public
USING (true);

-- 5. Allow public inserts (future: registration)
DROP POLICY IF EXISTS "Allow public inserts to customers" ON public.customers;
CREATE POLICY "Allow public inserts to customers"
ON public.customers
FOR INSERT
TO public
WITH CHECK (true);

-- 6. Seed a sample account
INSERT INTO public.customers (username, password, full_name, status) VALUES
('demo', 'demo123', 'Demo Customer', 'Active')
ON CONFLICT (username) DO NOTHING;

-- Notes:
-- * Login: src/context/AuthContext.jsx checks this table by username.
--   First-time usernames are auto-registered (INSERT) so data is always stored
--   and the user shows up in the Admin -> Customers panel.
-- * Password column stores the password as-is (hidden in the UI input, plain in DB for simplicity).
-- * If a customer row is deleted in the DB, the app re-creates it on next login.