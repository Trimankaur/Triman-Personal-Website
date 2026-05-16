-- Supabase Database Schema for Triman's Learning Journal
-- Run this in your Supabase SQL Editor

-- Learnings table
CREATE TABLE IF NOT EXISTS learnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Thoughts',
  tags TEXT[] DEFAULT '{}',
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT,
  personal_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  stack TEXT[] DEFAULT '{}',
  github_link TEXT,
  live_link TEXT,
  screenshots TEXT[] DEFAULT '{}',
  lessons TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Curiosities table
CREATE TABLE IF NOT EXISTS curiosities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE learnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE curiosities ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read access" ON learnings FOR SELECT USING (true);
CREATE POLICY "Public read access" ON quotes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON curiosities FOR SELECT USING (true);

-- Authenticated write access policies (only logged-in users can insert/update/delete)
CREATE POLICY "Authenticated insert" ON learnings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update" ON learnings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated delete" ON learnings FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated insert" ON quotes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update" ON quotes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated delete" ON quotes FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated insert" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated delete" ON projects FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated insert" ON curiosities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update" ON curiosities FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated delete" ON curiosities FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_learnings_category ON learnings(category);
CREATE INDEX IF NOT EXISTS idx_learnings_created_at ON learnings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
