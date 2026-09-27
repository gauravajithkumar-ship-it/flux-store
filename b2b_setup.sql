-- Create B2B Enquiries table
CREATE TABLE IF NOT EXISTS public.b2b_enquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    work_email TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_url TEXT,
    landline TEXT,
    enquiry TEXT NOT NULL,
    target_budget TEXT,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.b2b_enquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (so customers can submit forms)
CREATE POLICY "Allow public inserts" ON public.b2b_enquiries
    FOR INSERT WITH CHECK (true);

-- Allow public reads (or restrict to admins only in a real app, but for now allow reads to verify easily)
CREATE POLICY "Allow public reads" ON public.b2b_enquiries
    FOR SELECT USING (true);

-- Allow public updates (for admin to change status)
CREATE POLICY "Allow public updates" ON public.b2b_enquiries
    FOR UPDATE USING (true);

-- Allow public deletes
CREATE POLICY "Allow public deletes" ON public.b2b_enquiries
    FOR DELETE USING (true);
