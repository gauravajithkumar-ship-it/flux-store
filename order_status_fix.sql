-- Copy and run this script in your Supabase SQL Editor.
-- Fix: allows the admin Order Management page to update order status.
-- Without this UPDATE policy, status changes are silently blocked by RLS,
-- so the customer progress indicator never moves.

DROP POLICY IF EXISTS "Allow public updates to adminOrders" ON public."adminOrders";
CREATE POLICY "Allow public updates to adminOrders"
ON public."adminOrders"
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Also ensure realtime is enabled (run realtime_orders_setup.sql if not already).
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
