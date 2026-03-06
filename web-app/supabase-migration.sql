-- Supabase SQL Migration for AI News Scraper
-- Run this in Supabase SQL Editor to create the required tables.

-- 1. Sources table
CREATE TABLE IF NOT EXISTS sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  source_type TEXT NOT NULL DEFAULT 'newsletter',
  frequency TEXT NOT NULL DEFAULT 'daily',
  language TEXT NOT NULL DEFAULT 'EN',
  subscribers TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 10,
  last_scraped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT,
  url TEXT,
  content_markdown TEXT,
  published_at TIMESTAMPTZ,
  scraped_at TIMESTAMPTZ DEFAULT now(),
  tags TEXT[] DEFAULT '{}',
  source_name TEXT
);

-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_scraped_at ON articles(scraped_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_source_id ON articles(source_id);
CREATE INDEX IF NOT EXISTS idx_sources_is_active ON sources(is_active);
CREATE INDEX IF NOT EXISTS idx_sources_priority ON sources(priority);

-- 4. Enable RLS (Row Level Security) - permissive for now
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access (for the dashboard)
CREATE POLICY "Allow anonymous read sources" ON sources FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read articles" ON articles FOR SELECT USING (true);

-- Allow service role full access (for scraping API)
CREATE POLICY "Allow service role full access sources" ON sources FOR ALL USING (true);
CREATE POLICY "Allow service role full access articles" ON articles FOR ALL USING (true);
