"use client"

import { useState, useEffect } from "react"
import { Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import type { SiteSettings } from "@/lib/types"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    const supabase = createClient()
    const { data } = await supabase.from("site_settings").select("*").limit(1).single()
    setSettings(data as SiteSettings | null)
    setIsLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!settings) return

    setIsSaving(true)
    const supabase = createClient()

    const data = {
      site_name: settings.site_name,
      site_description: settings.site_description,
      hero_title: settings.hero_title,
      hero_subtitle: settings.hero_subtitle,
      about_content: settings.about_content,
      contact_email: settings.contact_email,
      github_url: settings.github_url,
      linkedin_url: settings.linkedin_url,
      twitter_url: settings.twitter_url,
      updated_at: new Date().toISOString(),
    }

    if (settings.id) {
      await supabase.from("site_settings").update(data).eq("id", settings.id)
    } else {
      await supabase.from("site_settings").insert(data)
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Site Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>Basic site information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Site Name</label>
              <Input
                value={settings?.site_name || ""}
                onChange={(e) => setSettings({ ...settings!, site_name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Site Description</label>
              <Input
                value={settings?.site_description || ""}
                onChange={(e) => setSettings({ ...settings!, site_description: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Homepage hero content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Hero Title</label>
              <Input
                value={settings?.hero_title || ""}
                onChange={(e) => setSettings({ ...settings!, hero_title: e.target.value })}
                placeholder="Hi, I'm John Kazzy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
              <Textarea
                value={settings?.hero_subtitle || ""}
                onChange={(e) => setSettings({ ...settings!, hero_subtitle: e.target.value })}
                rows={2}
                placeholder="A brief introduction..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Section</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium mb-2">About Content</label>
              <Textarea
                value={settings?.about_content || ""}
                onChange={(e) => setSettings({ ...settings!, about_content: e.target.value })}
                rows={4}
                placeholder="Tell visitors about yourself..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact & Social</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Contact Email</label>
              <Input
                type="email"
                value={settings?.contact_email || ""}
                onChange={(e) => setSettings({ ...settings!, contact_email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">GitHub URL</label>
              <Input
                value={settings?.github_url || ""}
                onChange={(e) => setSettings({ ...settings!, github_url: e.target.value })}
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
              <Input
                value={settings?.linkedin_url || ""}
                onChange={(e) => setSettings({ ...settings!, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Twitter URL</label>
              <Input
                value={settings?.twitter_url || ""}
                onChange={(e) => setSettings({ ...settings!, twitter_url: e.target.value })}
                placeholder="https://twitter.com/username"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isSaving} className="w-full">
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saved ? "Saved!" : "Save Settings"}
        </Button>
      </form>
    </div>
  )
}
