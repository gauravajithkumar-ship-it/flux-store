-- Copy and run this script in your Supabase SQL Editor
-- Enables realtime so status changes made by the admin appear
-- instantly on the customer's "My Orders" page.

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
          AND schemaname = 'public'
          AND tablename = 'adminOrders'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public."adminOrders";
    END IF;
END $$;

-- Verify it was added
SELECT tablename FROM pg_publication_tables
WHERE pubname = 'supabase_realtime' AND schemaname = 'public';
