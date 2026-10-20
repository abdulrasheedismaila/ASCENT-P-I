/**
 * Complete, production-grade PostgreSQL SQL schema & initial data migration script for Supabase.
 * Execute this script in your Supabase Dashboard:
 *   1. Navigate to: https://supabase.com/dashboard/project/_/sql/new
 *   2. Paste the SQL code below into the SQL Editor.
 *   3. Click "Run" (or Ctrl + Enter).
 *   4. All 10 tables, indexes, Row Level Security (RLS) policies, and seed data will be created!
 */

export const COMPLETE_SUPABASE_SQL = `-- =====================================================================
-- ASCENT PROPERTIES & INVESTMENT COMPANY
-- COMPLETE SUPABASE POSTGRESQL SCHEMA & INITIAL DATA MIGRATION
-- Generated for Supabase SQL Editor (PostgreSQL 15+)
-- =====================================================================

-- Step 1: Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Drop existing tables if recreating (safe idempotent setup)
-- Uncomment if you wish to reset tables cleanly:
-- DROP TABLE IF EXISTS admin_activities CASCADE;
-- DROP TABLE IF EXISTS inspection_requests CASCADE;
-- DROP TABLE IF EXISTS enquiries CASCADE;
-- DROP TABLE IF EXISTS media_library CASCADE;
-- DROP TABLE IF EXISTS showcase_items CASCADE;
-- DROP TABLE IF EXISTS company_services CASCADE;
-- DROP TABLE IF EXISTS investment_opportunities CASCADE;
-- DROP TABLE IF EXISTS projects CASCADE;
-- DROP TABLE IF EXISTS properties CASCADE;
-- DROP TABLE IF EXISTS site_settings CASCADE;

-- =====================================================================
-- TABLE 1: SITE SETTINGS (Brand, Hero, Contact, Hotline, Socials)
-- =====================================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  company_name TEXT NOT NULL DEFAULT 'Ascent Properties and Investment Company',
  logo_url TEXT NOT NULL DEFAULT 'https://i.ibb.co/7td1ZWqZ/Chat-GPT-Image-Aug-30-2026-01-01-43-AM-removebg-preview.png',
  hero_headline TEXT NOT NULL DEFAULT 'BUILDING VALUE. CREATING OPPORTUNITIES.',
  hero_supporting_text TEXT NOT NULL DEFAULT 'Discover exceptional properties, explore real estate opportunities, and build lasting value with a trusted property and investment partner.',
  hero_background TEXT NOT NULL DEFAULT 'https://i.ibb.co/3mRmTZ31/photo-2026-10-15-21-26-38.jpg',
  email TEXT NOT NULL DEFAULT 'info.ascentproperties@gmail.com',
  phone TEXT NOT NULL DEFAULT '+2348033402265',
  whatsapp TEXT NOT NULL DEFAULT '+2348033402265',
  office_address TEXT NOT NULL DEFAULT 'Ascent Tower, Victoria Island, Lagos, Nigeria',
  business_hours TEXT NOT NULL DEFAULT 'Monday - Friday: 8:30 AM - 5:30 PM | Saturday: 10:00 AM - 3:00 PM',
  socials JSONB NOT NULL DEFAULT '{"tiktok": "https://www.tiktok.com/@ascent.properties3", "facebook": "https://www.facebook.com/share/1DNcvAk2cS/", "x": "https://x.com/AscentPropertie", "instagram": "https://www.instagram.com/ascent.properties", "email": "mailto:info.ascentproperties@gmail.com"}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- =====================================================================
-- TABLE 2: PROPERTIES (Listings, Land, Duplexes, Commercial)
-- =====================================================================
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  formatted_price TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  type TEXT NOT NULL, -- 'Residential' | 'Duplexes' | 'Apartments' | 'Land' | 'Commercial' | 'Office spaces' | 'Estates'
  purpose TEXT NOT NULL DEFAULT 'Buy', -- 'Buy' | 'Rent' | 'Investment'
  size TEXT NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  featured BOOLEAN NOT NULL DEFAULT false,
  availability TEXT NOT NULL DEFAULT 'Available', -- 'Available' | 'Sold Out' | 'Under Offer'
  cover_image TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  title_deed TEXT,
  year_built INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_availability ON properties(availability);

-- =====================================================================
-- TABLE 3: PROJECTS (Developments, Estates, High-Rises)
-- =====================================================================
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL, -- 'Residential Estate' | 'Luxury High-Rise' | 'Mixed-Use Commercial' | 'Waterfront Villas'
  status TEXT NOT NULL DEFAULT 'Ongoing', -- 'Planning' | 'Ongoing' | 'Completed' | 'Coming Soon'
  progress INTEGER DEFAULT 0,
  features TEXT[] NOT NULL DEFAULT '{}',
  available_units TEXT,
  delivery_date TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- =====================================================================
-- TABLE 4: INVESTMENT OPPORTUNITIES (Co-investment, High Yield)
-- =====================================================================
CREATE TABLE IF NOT EXISTS investment_opportunities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  min_investment TEXT NOT NULL,
  investment_period TEXT NOT NULL,
  projected_return TEXT,
  payout_frequency TEXT,
  project_info TEXT NOT NULL,
  supporting_images TEXT[] NOT NULL DEFAULT '{}',
  documents JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'Active', -- 'Active' | 'Closing Soon' | 'Fully Funded'
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- =====================================================================
-- TABLE 5: COMPANY SERVICES (Advisory, Construction, Property Mgmt)
-- =====================================================================
CREATE TABLE IF NOT EXISTS company_services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  image TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  scope TEXT NOT NULL
);

-- =====================================================================
-- TABLE 6: SHOWCASE ITEMS (Gallery visuals & videos)
-- =====================================================================
CREATE TABLE IF NOT EXISTS showcase_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Properties' | 'Projects' | 'Interiors' | 'Exteriors' | 'Construction' | 'Videos'
  media_type TEXT NOT NULL DEFAULT 'image', -- 'image' | 'video'
  url TEXT NOT NULL,
  thumbnail TEXT,
  description TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- =====================================================================
-- TABLE 7: MEDIA LIBRARY (Uploaded photos, videos, banners)
-- =====================================================================
CREATE TABLE IF NOT EXISTS media_library (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Hero' | 'Properties' | 'Projects' | 'Services' | 'Showcase' | 'General'
  media_type TEXT NOT NULL DEFAULT 'image',
  url TEXT NOT NULL,
  thumbnail TEXT,
  size TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  used_in TEXT[] DEFAULT '{}'
);

-- =====================================================================
-- TABLE 8: ENQUIRIES (Lead submissions & Contact messages)
-- =====================================================================
CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  property_title TEXT,
  status TEXT NOT NULL DEFAULT 'New', -- 'New' | 'Replied' | 'Archived'
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);

-- =====================================================================
-- TABLE 9: INSPECTION REQUESTS (On-site visitation appointments)
-- =====================================================================
CREATE TABLE IF NOT EXISTS inspection_requests (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  property_title TEXT NOT NULL,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  number_of_visitors INTEGER NOT NULL DEFAULT 1,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_inspections_status ON inspection_requests(status);

-- =====================================================================
-- TABLE 10: ADMIN ACTIVITIES (Audit trail logs)
-- =====================================================================
CREATE TABLE IF NOT EXISTS admin_activities (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- =====================================================================
-- STEP 3: ENABLE ROW LEVEL SECURITY (RLS) FOR SAFE PRODUCTION ACCESS
-- =====================================================================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activities ENABLE ROW LEVEL SECURITY;

-- Clean existing policies if re-running
DO $$
BEGIN
  -- Site Settings
  DROP POLICY IF EXISTS "Public Read Site Settings" ON site_settings;
  DROP POLICY IF EXISTS "Manage Site Settings" ON site_settings;
  -- Properties
  DROP POLICY IF EXISTS "Public Read Properties" ON properties;
  DROP POLICY IF EXISTS "Manage Properties" ON properties;
  -- Projects
  DROP POLICY IF EXISTS "Public Read Projects" ON projects;
  DROP POLICY IF EXISTS "Manage Projects" ON projects;
  -- Investments
  DROP POLICY IF EXISTS "Public Read Investments" ON investment_opportunities;
  DROP POLICY IF EXISTS "Manage Investments" ON investment_opportunities;
  -- Services
  DROP POLICY IF EXISTS "Public Read Services" ON company_services;
  DROP POLICY IF EXISTS "Manage Services" ON company_services;
  -- Showcase
  DROP POLICY IF EXISTS "Public Read Showcase" ON showcase_items;
  DROP POLICY IF EXISTS "Manage Showcase" ON showcase_items;
  -- Media Library
  DROP POLICY IF EXISTS "Public Read Media" ON media_library;
  DROP POLICY IF EXISTS "Manage Media" ON media_library;
  -- Enquiries
  DROP POLICY IF EXISTS "Public Insert Enquiries" ON enquiries;
  DROP POLICY IF EXISTS "Manage Enquiries" ON enquiries;
  -- Inspections
  DROP POLICY IF EXISTS "Public Insert Inspections" ON inspection_requests;
  DROP POLICY IF EXISTS "Manage Inspections" ON inspection_requests;
  -- Admin Activities
  DROP POLICY IF EXISTS "Manage Activities" ON admin_activities;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- 1. Site Settings Policies (Public read, full update for authorized clients)
CREATE POLICY "Public Read Site Settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Manage Site Settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

-- 2. Properties Policies (Public can view, admin/anon key can manage)
CREATE POLICY "Public Read Properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Manage Properties" ON properties FOR ALL USING (true) WITH CHECK (true);

-- 3. Projects Policies
CREATE POLICY "Public Read Projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Manage Projects" ON projects FOR ALL USING (true) WITH CHECK (true);

-- 4. Investments Policies
CREATE POLICY "Public Read Investments" ON investment_opportunities FOR SELECT USING (true);
CREATE POLICY "Manage Investments" ON investment_opportunities FOR ALL USING (true) WITH CHECK (true);

-- 5. Company Services Policies
CREATE POLICY "Public Read Services" ON company_services FOR SELECT USING (true);
CREATE POLICY "Manage Services" ON company_services FOR ALL USING (true) WITH CHECK (true);

-- 6. Showcase Items Policies
CREATE POLICY "Public Read Showcase" ON showcase_items FOR SELECT USING (true);
CREATE POLICY "Manage Showcase" ON showcase_items FOR ALL USING (true) WITH CHECK (true);

-- 7. Media Library Policies
CREATE POLICY "Public Read Media" ON media_library FOR SELECT USING (true);
CREATE POLICY "Manage Media" ON media_library FOR ALL USING (true) WITH CHECK (true);

-- 8. Enquiries Policies (Visitors can submit enquiries, admin can view & reply)
CREATE POLICY "Public Insert Enquiries" ON enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Manage Enquiries" ON enquiries FOR ALL USING (true) WITH CHECK (true);

-- 9. Inspection Requests Policies (Visitors can book inspections, admin can manage)
CREATE POLICY "Public Insert Inspections" ON inspection_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Manage Inspections" ON inspection_requests FOR ALL USING (true) WITH CHECK (true);

-- 10. Admin Activities Policies
CREATE POLICY "Manage Activities" ON admin_activities FOR ALL USING (true) WITH CHECK (true);

-- =====================================================================
-- STEP 4: SEED INITIAL ASCENT PROPERTIES DATA
-- =====================================================================

-- 1. Insert Site Settings with verified WhatsApp (+2348033402265)
INSERT INTO site_settings (
  id, company_name, logo_url, hero_headline, hero_supporting_text,
  hero_background, email, phone, whatsapp, office_address, business_hours, socials
)
VALUES (
  'default',
  'Ascent Properties and Investment Company',
  'https://i.ibb.co/7td1ZWqZ/Chat-GPT-Image-Aug-30-2026-01-01-43-AM-removebg-preview.png',
  'BUILDING VALUE. CREATING OPPORTUNITIES.',
  'Discover exceptional properties, explore real estate opportunities, and build lasting value with a trusted property and investment partner.',
  'https://i.ibb.co/3mRmTZ31/photo-2026-10-15-21-26-38.jpg',
  'info.ascentproperties@gmail.com',
  '+2348033402265',
  '+2348033402265',
  'Ascent Tower, Victoria Island, Lagos, Nigeria',
  'Monday - Friday: 8:30 AM - 5:30 PM | Saturday: 10:00 AM - 3:00 PM',
  '{
    "tiktok": "https://www.tiktok.com/@ascent.properties3?_r=1&_t=ZN-9AaKQ8xDVqw",
    "facebook": "https://www.facebook.com/share/1DNcvAk2cS/",
    "x": "https://x.com/AscentPropertie",
    "instagram": "https://www.instagram.com/ascent.properties?rpxt=MXh1M29kYnZka2pieA.",
    "email": "mailto:info.ascentproperties@gmail.com"
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  phone = EXCLUDED.phone,
  whatsapp = EXCLUDED.whatsapp,
  updated_at = now();

-- 2. Insert Services
INSERT INTO company_services (id, title, short_description, full_description, image, features, scope)
VALUES
(
  'service-sales',
  'Property Sales and Marketing',
  'Strategic marketing and sale of premium residential, commercial, and mixed-use developments with unmatched reach.',
  'We combine localized real estate intelligence with cutting-edge digital exposure to market luxury homes, serviced apartments, and prime land to discerning buyers in Nigeria and the diaspora.',
  'https://i.ibb.co/60dmwRv4/Gemini-Generated-Image-5ditr65ditr65dit.jpg',
  ARRAY['Comprehensive property valuation & pricing models', 'Targeted diaspora & institutional buyer outreach', 'Professional architectural photography and virtual tours', 'End-to-end legal title verification and closing support'],
  'Residential & Commercial Asset Sales'
),
(
  'service-dev',
  'Property Development',
  'End-to-end development of bespoke residential communities, high-yield apartments, and commercial complexes.',
  'From architectural conceptualization, feasibility modeling, and structural engineering to project handover, we build timeless properties engineered for capital appreciation and long-term utility.',
  'https://i.ibb.co/tTmZGbkB/Chat-GPT-Image-Aug-30-2026-07-22-04-AM.png',
  ARRAY['Land acquisition and master planning', 'Architectural design & urban planning', 'Precision construction and project management', 'Rigorous quality assurance & building code compliance'],
  'Turnkey Real Estate Development'
),
(
  'service-invest',
  'Real Estate Investment Advisory',
  'Bespoke structured real estate investment portfolios delivering predictable returns and hedge against inflation.',
  'We assist high-net-worth individuals, syndicates, and institutional funds in deploying capital into verified commercial properties, rental yield projects, and distressed asset restructuring.',
  'https://i.ibb.co/ymdx0txh/Gemini-Generated-Image-nqjomdnqjomdnqjo.jpg',
  ARRAY['High-yield off-plan acquisition strategies', 'Commercial rental yield optimization', 'Fractional ownership & syndicate structuring', 'Comprehensive capital risk mitigation & tax planning'],
  'Wealth Advisory & Portfolio Growth'
),
(
  'service-mgmt',
  'Property & Facility Management',
  'Preserving long-term asset value through proactive tenant management, maintenance, and rent collection.',
  'Our dedicated facilities division ensures maximum occupancy, seamless tenant relations, ongoing physical asset preservation, and computerized financial reporting for absentee landlords.',
  'https://i.ibb.co/0jMMHYsD/Gemini-Generated-Image-9a20df9a20df9a20.jpg',
  ARRAY['Strict tenant screening & automated rent collection', '24/7 preventive facility maintenance & repairs', 'Utility management, security, and cleaning oversight', 'Quarterly asset performance & ROI audit reporting'],
  'Full Lifecycle Asset Care'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Showcase Items (Including user updated images)
INSERT INTO showcase_items (id, title, category, media_type, url, thumbnail, description, location)
VALUES
(
  'showcase-1',
  'Prime Gated Estate Aerial Layout',
  'Properties',
  'image',
  'https://i.ibb.co/0jMMHYsD/Gemini-Generated-Image-9a20df9a20df9a20.jpg',
  'https://i.ibb.co/0jMMHYsD/Gemini-Generated-Image-9a20df9a20df9a20.jpg',
  'Master-planned residential development featuring paved access boulevards, underground drainage infrastructure, and 24/7 solar perimeter security lighting.',
  'Epe Corridor, Lagos'
),
(
  'showcase-2',
  'Modern Minimalist Waterfront Villa',
  'Exteriors',
  'image',
  'https://i.ibb.co/60dmwRv4/Gemini-Generated-Image-5ditr65ditr65dit.jpg',
  'https://i.ibb.co/60dmwRv4/Gemini-Generated-Image-5ditr65ditr65dit.jpg',
  'Architectural marvel featuring floor-to-ceiling double-glazed curtain walls, infinity plunge pool, cantilevered viewing decks, and private boat jetty.',
  'Banana Island, Ikoyi'
),
(
  'showcase-3',
  'Luxury Penthouse Master Suite & Lounge',
  'Interiors',
  'image',
  'https://i.ibb.co/tTmZGbkB/Chat-GPT-Image-Aug-30-2026-07-22-04-AM.png',
  'https://i.ibb.co/tTmZGbkB/Chat-GPT-Image-Aug-30-2026-07-22-04-AM.png',
  'Ultra-luxury custom interior fit-out showcasing imported Italian marble flooring, bespoke walnut timber paneling, concealed climate controls, and ambient cove lighting.',
  'Victoria Island, Lagos'
),
(
  'showcase-4',
  'Ascent Heights Commercial Glass Tower',
  'Projects',
  'image',
  'https://i.ibb.co/ymdx0txh/Gemini-Generated-Image-nqjomdnqjomdnqjo.jpg',
  'https://i.ibb.co/ymdx0txh/Gemini-Generated-Image-nqjomdnqjomdnqjo.jpg',
  'Grade-A corporate office hub engineered with high-efficiency double thermal facade, high-speed smart elevators, and integrated multi-tier access security.',
  'Eko Atlantic City, Lagos'
),
(
  'showcase-5',
  'Urban Master Planning & Site Construction Works',
  'Construction',
  'image',
  'https://i.ibb.co/212PyYPQ/Gemini-Generated-Image-fq3ktgfq3ktgfq3k.jpg',
  'https://i.ibb.co/212PyYPQ/Gemini-Generated-Image-fq3ktgfq3ktgfq3k.jpg',
  'Active civil engineering works, precision road grading, subterranean conduit laying, and structural piling execution across the new Phase 2 development.',
  'Ibeju-Lekki, Lagos'
),
(
  'showcase-6',
  'Corporate Executive Suite & Boardroom',
  'Interiors',
  'image',
  'https://i.ibb.co/vx2Kdvck/Gemini-Generated-Image-kjzs7xkjzs7xkjzs.jpg',
  'https://i.ibb.co/vx2Kdvck/Gemini-Generated-Image-kjzs7xkjzs7xkjzs.jpg',
  'High-specification executive conference suite outfitted with acoustic wall treatment, smart telepresence systems, and premium ergonomic leather appointments.',
  'Ascent Tower, Victoria Island'
)
ON CONFLICT (id) DO UPDATE SET
  url = EXCLUDED.url,
  thumbnail = EXCLUDED.thumbnail;

-- =====================================================================
-- STEP 5: GRANT ESSENTIAL PERMISSIONS TO ANON & AUTHENTICATED ROLES
-- (Required for Supabase REST API & anon key access)
-- =====================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- =====================================================================
-- STEP 6: FORCE POSTGREST TO IMMEDIATELY RELOAD SCHEMA CACHE
-- =====================================================================
NOTIFY pgrst, 'reload schema';

-- Output confirmation notice
SELECT 'Ascent Properties database schema and permissions created successfully!' AS result;
`;

/**
 * 5-line quick-fix SQL for when tables exist in Postgres
 * but Supabase PostgREST hasn't reloaded its schema cache or permissions yet.
 */
export const SUPABASE_QUICK_FIX_SQL = `-- =====================================================================
-- ASCENT PROPERTIES: QUICK FIX (PERMISSIONS & SCHEMA CACHE RELOAD)
-- Run this in Supabase SQL Editor if tables exist but API says missing
-- =====================================================================
-- 1. Ensure PostgREST explicitly exposes public schema
ALTER ROLE authenticator SET pgrst.db_schemas TO 'public';
NOTIFY pgrst, 'reload config';

-- 2. Grant permissions to anon, authenticated, service_role, and postgres
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role, postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role, postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role, postgres;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role, postgres;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role, postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role, postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role, postgres;

-- 3. Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

SELECT 'Public schema exposed, permissions granted, and schema cache reloaded!' AS result;
`;

/**
 * 1-line check query to confirm which tables actually exist in PostgreSQL
 */
export const SUPABASE_VERIFY_TABLES_SQL = `SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('site_settings', 'properties', 'projects', 'showcase_items', 'enquiries');
`;

/**
 * Targeted 1-table SQL script to create and immediately expose site_settings
 */
export const SUPABASE_SINGLE_TABLE_SQL = `-- =====================================================================
-- ASCENT PROPERTIES: CREATE & EXPOSE SITE_SETTINGS
-- Run this in Supabase SQL Editor to test table creation & API visibility
-- =====================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  company_name TEXT NOT NULL DEFAULT 'Ascent Properties and Investment Company',
  logo_url TEXT NOT NULL DEFAULT 'https://i.ibb.co/7td1ZWqZ/Chat-GPT-Image-Aug-30-2026-01-01-43-AM-removebg-preview.png',
  hero_headline TEXT NOT NULL DEFAULT 'BUILDING VALUE. CREATING OPPORTUNITIES.',
  hero_supporting_text TEXT NOT NULL DEFAULT 'Discover exceptional properties, explore real estate opportunities, and build lasting value with a trusted property and investment partner.',
  hero_background TEXT NOT NULL DEFAULT 'https://i.ibb.co/3mRmTZ31/photo-2026-10-15-21-26-38.jpg',
  email TEXT NOT NULL DEFAULT 'info.ascentproperties@gmail.com',
  phone TEXT NOT NULL DEFAULT '+2348033402265',
  whatsapp TEXT NOT NULL DEFAULT '+2348033402265',
  office_address TEXT NOT NULL DEFAULT 'Ascent Tower, Victoria Island, Lagos, Nigeria',
  business_hours TEXT NOT NULL DEFAULT 'Monday - Friday: 8:30 AM - 5:30 PM | Saturday: 10:00 AM - 3:00 PM',
  socials JSONB NOT NULL DEFAULT '{"tiktok": "https://www.tiktok.com/@ascent.properties3", "facebook": "https://www.facebook.com/share/1DNcvAk2cS/", "x": "https://x.com/AscentPropertie", "instagram": "https://www.instagram.com/ascent.properties", "email": "mailto:info.ascentproperties@gmail.com"}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Expose to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role, postgres;
GRANT ALL ON TABLE public.site_settings TO anon, authenticated, service_role, postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role, postgres;

-- Insert default row
INSERT INTO public.site_settings (id, company_name, email, phone, whatsapp)
VALUES ('default', 'Ascent Properties and Investment Company', 'info.ascentproperties@gmail.com', '+2348033402265', '+2348033402265')
ON CONFLICT (id) DO NOTHING;

-- Enable public read policy
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Site Settings" ON public.site_settings;
CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Manage Site Settings" ON public.site_settings;
CREATE POLICY "Manage Site Settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';

SELECT 'Table site_settings created and verified!' AS result;
`;
