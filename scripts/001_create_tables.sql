-- Portfolio & Blog Database Schema
-- Creates tables for site settings, projects, blog posts, and page sections

-- Site settings table (stores basic site info)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'My Portfolio',
  site_description TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  about_content TEXT,
  contact_email TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  image_url TEXT,
  live_url TEXT,
  github_url TEXT,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page sections table (for custom homepage sections)
CREATE TABLE IF NOT EXISTS page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name TEXT NOT NULL DEFAULT 'home',
  section_type TEXT NOT NULL, -- 'hero', 'about', 'skills', 'experience', 'contact', 'custom'
  title TEXT,
  content TEXT,
  metadata JSONB DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT, -- 'frontend', 'backend', 'tools', etc.
  proficiency INTEGER DEFAULT 80, -- 0-100
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experience table
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  current BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can read published content)
CREATE POLICY "Anyone can view site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can view published projects" ON projects FOR SELECT USING (published = true);
CREATE POLICY "Anyone can view published blog posts" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Anyone can view visible sections" ON page_sections FOR SELECT USING (visible = true);
CREATE POLICY "Anyone can view skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Anyone can view experiences" ON experiences FOR SELECT USING (true);

-- Admin policies (authenticated users can do everything)
-- Site settings
CREATE POLICY "Authenticated users can insert site settings" ON site_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update site settings" ON site_settings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete site settings" ON site_settings FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can view all site settings" ON site_settings FOR SELECT TO authenticated USING (true);

-- Projects
CREATE POLICY "Authenticated users can insert projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update projects" ON projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete projects" ON projects FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can view all projects" ON projects FOR SELECT TO authenticated USING (true);

-- Blog posts
CREATE POLICY "Authenticated users can insert blog posts" ON blog_posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update blog posts" ON blog_posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete blog posts" ON blog_posts FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can view all blog posts" ON blog_posts FOR SELECT TO authenticated USING (true);

-- Page sections
CREATE POLICY "Authenticated users can insert page sections" ON page_sections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update page sections" ON page_sections FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete page sections" ON page_sections FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can view all page sections" ON page_sections FOR SELECT TO authenticated USING (true);

-- Skills
CREATE POLICY "Authenticated users can insert skills" ON skills FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update skills" ON skills FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete skills" ON skills FOR DELETE TO authenticated USING (true);

-- Experiences
CREATE POLICY "Authenticated users can insert experiences" ON experiences FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update experiences" ON experiences FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete experiences" ON experiences FOR DELETE TO authenticated USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_page_sections_page ON page_sections(page_name);
