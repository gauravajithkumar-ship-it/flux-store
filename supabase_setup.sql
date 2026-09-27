-- Copy and run this script in your Supabase SQL Editor

-- 1. Create the Orders table
CREATE TABLE IF NOT EXISTS public."adminOrders" (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_mobile TEXT NOT NULL,
    shipping_address JSONB NOT NULL,
    items JSONB NOT NULL,
    payment_method TEXT NOT NULL,
    subtotal NUMERIC NOT NULL,
    shipping_cost NUMERIC NOT NULL,
    gst_amount NUMERIC NOT NULL,
    discount NUMERIC NOT NULL,
    total NUMERIC NOT NULL,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the Invoices table
CREATE TABLE IF NOT EXISTS public."adminInvoices" (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public."adminOrders"(id),
    customer_name TEXT NOT NULL,
    invoice_type TEXT DEFAULT 'B2C',
    total_amount NUMERIC NOT NULL,
    gst_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'Generated',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS (Row Level Security) so we can explicitly control access
ALTER TABLE public."adminOrders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."adminInvoices" ENABLE ROW LEVEL SECURITY;

-- 4. Create policies to allow ANONYMOUS users to INSERT (Place Orders)
DROP POLICY IF EXISTS "Allow public inserts to adminOrders" ON public."adminOrders";
CREATE POLICY "Allow public inserts to adminOrders" 
ON public."adminOrders" 
FOR INSERT 
TO public 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public inserts to adminInvoices" ON public."adminInvoices";
CREATE POLICY "Allow public inserts to adminInvoices" 
ON public."adminInvoices" 
FOR INSERT 
TO public 
WITH CHECK (true);

-- 5. Create policies to allow ANONYMOUS users to SELECT (View Orders in Dashboard)
DROP POLICY IF EXISTS "Allow public reads of adminOrders" ON public."adminOrders";
CREATE POLICY "Allow public reads of adminOrders" 
ON public."adminOrders" 
FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Allow public reads of adminInvoices" ON public."adminInvoices";
CREATE POLICY "Allow public reads of adminInvoices" 
ON public."adminInvoices" 
FOR SELECT 
TO public 
USING (true);

-- 6. Create the Contacts/Enquiries table
CREATE TABLE IF NOT EXISTS public."adminContacts" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'Unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Enable RLS and create policies for adminContacts
ALTER TABLE public."adminContacts" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public inserts to adminContacts" ON public."adminContacts";
CREATE POLICY "Allow public inserts to adminContacts" 
ON public."adminContacts" 
FOR INSERT 
TO public 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public reads of adminContacts" ON public."adminContacts";
CREATE POLICY "Allow public reads of adminContacts" 
ON public."adminContacts" 
FOR SELECT 
TO public 
USING (true);

-- 8. Create Products table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL,
    discount NUMERIC,
    rating NUMERIC,
    "stockStatus" TEXT NOT NULL,
    "stockCount" INTEGER,
    specs JSONB,
    img TEXT,
    upc TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Enable RLS and create policies for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public inserts to products" ON public.products;
CREATE POLICY "Allow public inserts to products" 
ON public.products 
FOR INSERT 
TO public 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public reads of products" ON public.products;
CREATE POLICY "Allow public reads of products" 
ON public.products 
FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Allow public updates to products" ON public.products;
CREATE POLICY "Allow public updates to products" 
ON public.products 
FOR UPDATE 
TO public 
USING (true);

DROP POLICY IF EXISTS "Allow public deletes to products" ON public.products;
CREATE POLICY "Allow public deletes to products" 
ON public.products 
FOR DELETE 
TO public 
USING (true);

-- 10. Seed Initial Data
INSERT INTO public.products (id, name, brand, category, price, discount, rating, "stockStatus", "stockCount", specs, img, upc) VALUES
('samsung-a56-5g', 'Galaxy A56 5G', 'Samsung', 'Mobile', 34999, 10, 4.8, 'In Stock', 124, '["6.6\" Super AMOLED", "120Hz Refresh Rate", "50MP OIS Camera", "5000mAh Battery"]', 'https://cdn.jiostore.online/v2/jmd-asp/jdprod/wrkr/products/pictures/item/free/original/samsung/494494238/0/1xsA6S5Rb0-hwuOY51Nlo-SamsungGalaxyA56-5G-494494238-i-1-1200Wx1200H.jpeg', '8901234560000'),
('samsung-a36-5g', 'Galaxy A36 5G', 'Samsung', 'Mobile', 26999, NULL, 4.7, 'In Stock', 87, '["6.5\" Super AMOLED", "120Hz Refresh Rate", "48MP Camera", "5000mAh Battery"]', 'https://m.media-amazon.com/images/I/610pl1tR+mL.jpg', '8901234560001'),
('samsung-a26-5g', 'Galaxy A26 5G', 'Samsung', 'Mobile', 19999, 5, 4.5, 'Low Stock', 8, '["6.5\" LCD Display", "90Hz Refresh Rate", "50MP Main Camera", "5000mAh Battery"]', 'https://electronicparadise.in/cdn/shop/files/1_47f61e05-00a3-4385-af4c-6281be121a7c.jpg?v=1746172229&width=1406', '8901234560002'),
('samsung-wm-8kg', '8kg Front Load AI EcoBubble', 'Samsung', 'Washing Machine', 42999, 15, 4.9, 'In Stock', 145, '["8kg Capacity", "AI Control", "EcoBubble Technology", "Hygiene Steam"]', 'https://media-ik.croma.com/Croma%20Assets/Large%20Appliances/Washers%20and%20Dryers/Images/301211_0_b7s0m4.png', '8901234560003'),
('bosch-wm-7kg', '7kg Front Load Serie 4', 'Bosch', 'Washing Machine', 36999, 10, 4.8, 'In Stock', 67, '["7kg Capacity", "Inverter Motor", "Anti-Vibration", "ActiveWater"]', 'https://images.jdmagicbox.com/quickquotes/images_main/bosch_wak24268in_fully_automatic_front_load_washing_machine_7_kg__10641948_0.jpg', '8901234560004'),
('whirlpool-wm-7-5kg', '7.5kg Top Load 360 Bloomwash', 'Whirlpool', 'Washing Machine', 21999, NULL, 4.5, 'Low Stock', 5, '["7.5kg Capacity", "360 Bloomwash", "In-built Heater", "Hexa Bloom Impeller"]', 'https://cdn.jiostore.online/v2/jmd-asp/jdprod/wrkr/products/pictures/item/free/original/whirlpool/491666515/0/3lpgCAzG5I-dI86JXeiha-Whirlpool-360-BLOOMWASH-PRO-WashingMachine-491666515-i-1-1200Wx1200H.jpeg', '8901234560005'),
('lg-wm-8kg', '8kg Front Load AI Direct Drive', 'LG', 'Washing Machine', 44999, 12, 4.7, 'In Stock', 92, '["8kg Capacity", "AI DD", "Steam Wash", "ThinQ Connectivity"]', 'https://electronicparadise.in/cdn/shop/files/FHV1408Z2M_4.jpg?v=1760358318&width=1406', '8901234560006'),
('sony-bravia-2-ii-43', 'BRAVIA 2 II 43"', 'Sony', 'TV', 45999, NULL, 4.6, 'In Stock', 201, '["43\" 4K HDR", "X1 Processor", "Google TV", "Dolby Audio"]', 'https://shopatsc.com/cdn/shop/files/01-43S25M2-Primary-Image.jpg?v=1752588032', '8901234560007'),
('sony-bravia-5-55', 'BRAVIA 5 55"', 'Sony', 'TV', 74999, 10, 4.8, 'In Stock', 54, '["55\" 4K HDR", "X1 Ultimate Processor", "Acoustic Multi-Audio", "Google TV"]', 'https://m.media-amazon.com/images/I/81dC067BCML._AC_UF1000,1000_QL80_.jpg', '8901234560008'),
('sony-ht-s20r', 'HT-S20R', 'Sony', 'Audio', 17999, NULL, 4.7, 'In Stock', 113, '["5.1ch Surround Sound", "400W Power Output", "Bluetooth Connectivity", "USB Playback"]', 'https://www.sony.co.in/image/516e4a08444747a10b4277d8ade0dbc9?fmt=pjpeg&bgcolor=FFFFFF&bgc=FFFFFF&wid=2515&hei=1320', '8901234560009'),
('tcl-c6k-55', 'C6K 55"', 'TCL', 'TV', 42999, NULL, 4.5, 'In Stock', 78, '["55\" QLED 4K", "Dolby Vision", "Google TV", "Onkyo Audio"]', 'https://aws-obg-image-lb-4.tcl.com/content/dam/brandsite/product/tv/c/c6k/id/1.png?t=1737537511774&w=800', '8901234560010'),
('tcl-c7k-65', 'C7K 65"', 'TCL', 'TV', 64999, 12, 4.7, 'Low Stock', 3, '["65\" QLED 4K", "144Hz VRR", "Dolby Vision IQ", "IMAX Enhanced"]', 'https://aws-obg-image-lb-2.tcl.com/content/dam/brandsite/product/tv/c/c7k/id/1.png?t=1737536039017&w=800', '8901234560011'),
('jbl-tune-770nc', 'Tune 770NC', 'JBL', 'Audio', 6999, NULL, 4.6, 'In Stock', 188, '["Adaptive Noise Cancelling", "Up to 70h Battery", "Bluetooth 5.3", "JBL Pure Bass"]', 'https://m.media-amazon.com/images/I/61JU2HicMQL._AC_UF1000,1000_QL80_.jpg', '8901234560012'),
('boat-airdopes-plus-311', 'Airdopes Plus 311', 'boAt', 'Audio', 2499, 15, 4.4, 'In Stock', 224, '["50 hours of Playback", "ENx Technology", "BEAST Mode", "Bluetooth 5.3"]', 'https://assets.myntassets.com/h_1440,q_75,w_1080/v1/assets/images/29820724/2024/5/28/176a181d-997c-4e0e-a3c8-c29e6ef7786b1716890045126-boAt-Unisex-Headphones-5141716890044767-1.jpg', '8901234560013'),
('noise-buds-vs104', 'Buds VS104', 'Noise', 'Audio', 1499, NULL, 4.3, 'In Stock', 145, '["30 Hours Playtime", "Instacharge", "13mm Driver", "Bluetooth 5.2"]', 'https://media-ik.croma.com/Croma%20Assets/Entertainment/Wireless%20Earbuds/Images/303621_opkytb.png', '8901234560014'),
('jbl-bar-500', 'Bar 500', 'JBL', 'Audio', 49999, NULL, 4.8, 'In Stock', 45, '["5.1.2ch Sound", "Dolby Atmos", "590W Total Power", "Wireless Subwoofer"]', 'https://m.media-amazon.com/images/I/61UgqnXIaKL._AC_UF1000,1000_QL80_.jpg', '8901234560015'),
('panasonic-mx700-55', 'MX700 55"', 'Panasonic', 'TV', 48999, 8, 4.5, 'In Stock', 66, '["55\" 4K LED", "HDR10+", "Android TV", "Hexa Chroma Drive"]', 'https://images-eu.ssl-images-amazon.com/images/I/71RBrrDpP6L._AC_UL495_SR435,495_.jpg', '8901234560016')
ON CONFLICT (id) DO NOTHING;

-- 11. Create Coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC NOT NULL,
    min_order_amount NUMERIC DEFAULT 0,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Enable RLS and create policies for coupons
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public inserts to coupons" ON public.coupons;
CREATE POLICY "Allow public inserts to coupons"
ON public.coupons
FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public reads of coupons" ON public.coupons;
CREATE POLICY "Allow public reads of coupons"
ON public.coupons
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Allow public updates to coupons" ON public.coupons;
CREATE POLICY "Allow public updates to coupons"
ON public.coupons
FOR UPDATE
TO public
USING (true);

DROP POLICY IF EXISTS "Allow public deletes to coupons" ON public.coupons;
CREATE POLICY "Allow public deletes to coupons"
ON public.coupons
FOR DELETE
TO public
USING (true);

-- 13. Seed initial coupon data
INSERT INTO public.coupons (code, discount_type, discount_value, min_order_amount, expiry_date, usage_limit, used_count, is_active) VALUES
('SUMMER2026', 'percentage', 15, 5000, '2026-08-31T23:59:59Z', 1000, 342, true),
('NEWBIE500', 'fixed', 500, 2000, '2026-12-31T23:59:59Z', NULL, 1245, true),
('FLUX10', 'percentage', 10, 0, '2026-12-31T23:59:59Z', NULL, 0, true),
('FLUX20', 'percentage', 20, 10000, '2026-12-31T23:59:59Z', 500, 0, true),
('SAVE500', 'fixed', 500, 3000, '2026-12-31T23:59:59Z', NULL, 0, true),
('WELCOME100', 'fixed', 100, 1000, '2026-12-31T23:59:59Z', NULL, 0, true)
ON CONFLICT (code) DO NOTHING;

-- 14. Create Announcements table
CREATE TABLE IF NOT EXISTS public."adminAnnouncements" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. Enable RLS and create policies for adminAnnouncements
ALTER TABLE public."adminAnnouncements" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public reads of adminAnnouncements" ON public."adminAnnouncements";
CREATE POLICY "Allow public reads of adminAnnouncements"
ON public."adminAnnouncements"
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Allow public all to adminAnnouncements" ON public."adminAnnouncements";
CREATE POLICY "Allow public all to adminAnnouncements"
ON public."adminAnnouncements"
FOR ALL
TO public
USING (true);

-- 16. Seed initial announcement
INSERT INTO public."adminAnnouncements" (title, message, is_active) VALUES
('Welcome Offer', '🎉 Grand Opening! Get 15% off your first order with code SUMMER2026. Free shipping on all orders over ₹5000! 🚀', true);

-- 17. Create Customers table (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Banned')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 18. Add user_id column to adminOrders for linking logged-in users' orders
ALTER TABLE public."adminOrders" ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;
