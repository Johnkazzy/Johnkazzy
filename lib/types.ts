export interface SiteSettings {
  id: string
  site_name: string
  site_description: string | null
  hero_title: string | null
  hero_subtitle: string | null
  about_content: string | null
  contact_email: string | null
  github_url: string | null
  linkedin_url: string | null
  twitter_url: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string | null
  content: string | null
  image_url: string | null
  live_url: string | null
  github_url: string | null
  tags: string[]
  featured: boolean
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_image: string | null
  published: boolean
  published_at: string | null
  tags: string[]
  created_at: string
  updated_at: string
}

export interface PageSection {
  id: string
  page_name: string
  section_type: string
  title: string | null
  content: string | null
  metadata: Record<string, unknown>
  sort_order: number
  visible: boolean
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category: string | null
  proficiency: number
  sort_order: number
  created_at: string
}

export interface Experience {
  id: string
  company: string
  position: string
  description: string | null
  start_date: string | null
  end_date: string | null
  current: boolean
  sort_order: number
  created_at: string
  updated_at: string
}
