import { createClient } from "@/lib/supabase/server"
import { ArrowRight, Code2, FileText, Briefcase } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { SiteSettings, Project, BlogPost, Skill } from "@/lib/types"

async function getSiteData() {
  const supabase = await createClient()
  
  const [settingsRes, projectsRes, postsRes, skillsRes] = await Promise.all([
    supabase.from("site_settings").select("*").limit(1).single(),
    supabase.from("projects").select("*").eq("published", true).eq("featured", true).order("sort_order").limit(3),
    supabase.from("blog_posts").select("*").eq("published", true).order("published_at", { ascending: false }).limit(3),
    supabase.from("skills").select("*").order("sort_order"),
  ])

  return {
    settings: settingsRes.data as SiteSettings | null,
    projects: (projectsRes.data || []) as Project[],
    posts: (postsRes.data || []) as BlogPost[],
    skills: (skillsRes.data || []) as Skill[],
  }
}

export default async function HomePage() {
  const { settings, projects, posts, skills } = await getSiteData()

  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || "Other"
    if (!acc[category]) acc[category] = []
    acc[category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
              {settings?.hero_title || "Hi, I'm John Kazzy"}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {settings?.hero_subtitle || "I build things for the web and create content about technology."}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/projects">
                  View Projects <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/blog">Read Blog</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {settings?.about_content && (
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold tracking-tight mb-6">About Me</h2>
            <p className="text-muted-foreground leading-relaxed max-w-3xl">
              {settings.about_content}
            </p>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Skills</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Featured Projects</h2>
              <Button asChild variant="ghost">
                <Link href="/projects">
                  View all <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id} className="group hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-accent mb-2">
                      <Code2 className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Blog Posts */}
      {posts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Latest Posts</h2>
              <Button asChild variant="ghost">
                <Link href="/blog">
                  View all <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="group hover:shadow-md transition-shadow h-full">
                    <CardHeader>
                      <div className="flex items-center gap-2 text-accent mb-2">
                        <FileText className="h-5 w-5" />
                        {post.published_at && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.published_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-xl group-hover:text-accent transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            {"Let's Work Together"}
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            {"I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions."}
          </p>
          <Button asChild variant="secondary" size="lg">
            <Link href={`mailto:${settings?.contact_email || "hello@example.com"}`}>
              <Briefcase className="mr-2 h-4 w-4" />
              Get In Touch
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
