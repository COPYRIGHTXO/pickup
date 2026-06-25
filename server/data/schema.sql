-- PickUP Supabase Database Schema

-- 1. Creators Table
CREATE TABLE IF NOT EXISTS creators (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    handle TEXT NOT NULL UNIQUE,
    niche TEXT NOT NULL,
    platform TEXT NOT NULL,
    followers TEXT,
    followers_num INTEGER DEFAULT 0,
    engagement TEXT,
    match INTEGER DEFAULT 0,
    authenticity INTEGER DEFAULT 0,
    cost TEXT,
    region TEXT,
    tags TEXT[] DEFAULT '{}',
    gradient TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS & Policies (Default: allow public access for setup, update as needed)
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on creators" ON creators FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on creators" ON creators FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on creators" ON creators FOR UPDATE USING (true);

-- 2. Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    budget TEXT,
    budget_num INTEGER DEFAULT 0,
    creators INTEGER DEFAULT 0,
    roi TEXT DEFAULT 'Pending',
    due TEXT DEFAULT 'TBD',
    brand TEXT DEFAULT 'Unknown',
    created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on campaigns" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on campaigns" ON campaigns FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on campaigns" ON campaigns FOR UPDATE USING (true);

-- 3. Campaigns Metadata Table (For Calendar, Activity, Summary info)
CREATE TABLE IF NOT EXISTS campaigns_metadata (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

ALTER TABLE campaigns_metadata ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on campaigns_metadata" ON campaigns_metadata FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on campaigns_metadata" ON campaigns_metadata FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on campaigns_metadata" ON campaigns_metadata FOR UPDATE USING (true);

-- 4. Pipeline Table (Kanban boards)
CREATE TABLE IF NOT EXISTS pipeline (
    stage TEXT PRIMARY KEY,
    items TEXT[] DEFAULT '{}',
    display_order INTEGER DEFAULT 0
);

ALTER TABLE pipeline ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on pipeline" ON pipeline FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on pipeline" ON pipeline FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on pipeline" ON pipeline FOR UPDATE USING (true);

-- 5. Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    goal TEXT DEFAULT '',
    name TEXT DEFAULT '',
    company TEXT DEFAULT '',
    message TEXT DEFAULT '',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'new'
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on contact_submissions" ON contact_submissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on contact_submissions" ON contact_submissions FOR INSERT WITH CHECK (true);

-- 6. Settings Table
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on settings" ON settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on settings" ON settings FOR UPDATE USING (true);

-- 7. Fraud Signals Table
CREATE TABLE IF NOT EXISTS fraud (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

ALTER TABLE fraud ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on fraud" ON fraud FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on fraud" ON fraud FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on fraud" ON fraud FOR UPDATE USING (true);

-- 8. ROI Prediction Table
CREATE TABLE IF NOT EXISTS roi (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

ALTER TABLE roi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on roi" ON roi FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on roi" ON roi FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on roi" ON roi FOR UPDATE USING (true);

-- 9. Site Content Table
CREATE TABLE IF NOT EXISTS site (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

ALTER TABLE site ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on site" ON site FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on site" ON site FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on site" ON site FOR UPDATE USING (true);
