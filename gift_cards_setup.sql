-- Copy and run this script in your Supabase SQL Editor

-- 1. Create the gift_cards table
CREATE TABLE IF NOT EXISTS public.gift_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT NOT NULL,
    denominations JSONB NOT NULL DEFAULT '[]',
    allow_custom_amount BOOLEAN DEFAULT false,
    stock INTEGER NOT NULL DEFAULT 0,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS and create policies for gift_cards
ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public reads of gift_cards" ON public.gift_cards;
CREATE POLICY "Allow public reads of gift_cards" 
ON public.gift_cards 
FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Allow public all to gift_cards" ON public.gift_cards;
CREATE POLICY "Allow public all to gift_cards" 
ON public.gift_cards 
FOR ALL 
TO public 
USING (true);

-- 3. Seed Initial Gift Card Data
INSERT INTO public.gift_cards (name, image, denominations, allow_custom_amount, stock, status) VALUES
('Amazon Pay Gift Card', 'https://m.media-amazon.com/images/G/31/img20/AmazonPay/Giftcards/V2/Amazon_GC_1_400x400.jpg', '[500, 1000, 2000, 5000]', true, 1000, true),
('Steam Gift Card', 'https://store.cloudflare.steamstatic.com/public/images/gift/steamcards_promo_02.png', '[500, 1000, 2000, 5000]', false, 500, true),
('Roblox Gift Card', 'https://images.roblox.com/d5a9b9b0098df9a8b13d29d8ed07ccb1.jpg', '[500, 1000, 2000, 5000]', false, 200, true),
('PlayStation Store Gift Card', 'https://gmedia.playstation.com/is/image/SIEPDC/playstation-store-gift-card-thumbnail-01-en-14sep21?$facebook$', '[500, 1000, 2000, 5000]', false, 300, true),
('Pizza Hut e-Gift Card', 'https://cdn.gyftr.com/gyftrweb/brands/menu/pizza-hut-1681285493.png', '[500, 1000, 2000]', false, 150, true)
ON CONFLICT DO NOTHING;

-- 4. Alter cart_items table to support gift cards
-- We add item_type and custom_amount columns to store gift card details.
ALTER TABLE public.cart_items ADD COLUMN IF NOT EXISTS item_type TEXT DEFAULT 'product';
ALTER TABLE public.cart_items ADD COLUMN IF NOT EXISTS custom_amount NUMERIC;

-- Note: Depending on how cart_items was initially created, it might have a foreign key constraint on product_id.
-- If you face foreign key errors when adding gift cards to the cart, run the following:
-- ALTER TABLE public.cart_items DROP CONSTRAINT IF EXISTS cart_items_product_id_fkey;
