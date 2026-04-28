import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderKanban, FileText, Zap, Briefcase } from "lucide-react"
import Link from "next/link"

async function getStats() {
  const supabase = await createClient()
  
  const [projects, posts, skills, experiences] = await Promise.all([
    supabase.from("projects").select("id, published", { count: "exact" }),
    supabase.from("blog_posts").select("id, published", { count: "exact" }),
    supabase.from("skills").select("id", { count: "exact" }),
    supabase.from("experiences").select("id", { count: "exact" }),
  ])

  return {
    projects: {
      total: projects.count || 0,
      published: projects.data?.filter(p => p.published).length || 0,
    },
    posts: {
      total: posts.count || 0,
      published: posts.data?.filter(p => p.published).length || 0,
    },
    skills: skills.count || 0,
    experiences: experiences.count || 0,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    {
      title: "Projects",
      icon: FolderKanban,
      value: stats.projects.total,
      subtitle: `${stats.projects.published} published`,
      href: "/admin/projects",
    },
    {
      title: "Blog Posts",
      icon: FileText,
      value: stats.posts.total,
      subtitle: `${stats.posts.published} published`,
      href: "/admin/blog",
    },
    {
      title: "Skills",
      icon: Zap,
      value: stats.skills,
      subtitle: "Total skills",
      href: "/admin/skills",
    },
    {
      title: "Experience",
      icon: Briefcase,
      value: stats.experiences,
      subtitle: "Work entries",
      href: "/admin/experience",
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.subtitle}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/projects/new">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-2 rounded-lg bg-accent/10">
                  <FolderKanban className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-medium">New Project</p>
                  <p className="text-sm text-muted-foreground">Add a project to your portfolio</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/blog/new">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-2 rounded-lg bg-accent/10">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-medium">New Blog Post</p>
                  <p className="text-sm text-muted-foreground">Write a new article</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/settings">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-medium">Site Settings</p>
                  <p className="text-sm text-muted-foreground">Update your site info</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
