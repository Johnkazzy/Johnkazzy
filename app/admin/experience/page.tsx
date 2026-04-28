"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Loader2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import type { Experience } from "@/lib/types"

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    description: "",
    start_date: "",
    end_date: "",
    current: false,
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadExperiences()
  }, [])

  async function loadExperiences() {
    const supabase = createClient()
    const { data } = await supabase.from("experiences").select("*").order("sort_order")
    setExperiences((data || []) as Experience[])
    setIsLoading(false)
  }

  function resetForm() {
    setFormData({
      company: "",
      position: "",
      description: "",
      start_date: "",
      end_date: "",
      current: false,
    })
    setEditingId(null)
  }

  function startEdit(exp: Experience) {
    setFormData({
      company: exp.company,
      position: exp.position,
      description: exp.description || "",
      start_date: exp.start_date || "",
      end_date: exp.end_date || "",
      current: exp.current,
    })
    setEditingId(exp.id)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.company || !formData.position) return

    setIsSaving(true)
    const supabase = createClient()

    const data = {
      company: formData.company,
      position: formData.position,
      description: formData.description || null,
      start_date: formData.start_date || null,
      end_date: formData.current ? null : formData.end_date || null,
      current: formData.current,
      updated_at: new Date().toISOString(),
    }

    if (editingId) {
      await supabase.from("experiences").update(data).eq("id", editingId)
    } else {
      await supabase.from("experiences").insert({
        ...data,
        sort_order: experiences.length,
      })
    }

    resetForm()
    await loadExperiences()
    setIsSaving(false)
  }

  async function deleteExperience(id: string) {
    if (!confirm("Delete this experience?")) return
    const supabase = createClient()
    await supabase.from("experiences").delete().eq("id", id)
    await loadExperiences()
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
      <h1 className="text-3xl font-bold tracking-tight mb-8">Experience</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">
            {editingId ? "Edit Experience" : "Add Experience"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
              <Input
                placeholder="Position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
              />
            </div>
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  disabled={formData.current}
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 h-10">
                  <input
                    type="checkbox"
                    checked={formData.current}
                    onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                    className="rounded border-input"
                  />
                  <span className="text-sm">Current position</span>
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingId ? "Update" : "Add"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {experiences.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No experience entries yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {experiences.map((exp) => (
            <Card key={exp.id}>
              <CardContent className="flex items-start justify-between py-4">
                <div>
                  <h3 className="font-semibold">{exp.position}</h3>
                  <p className="text-muted-foreground">{exp.company}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {exp.start_date && new Date(exp.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    {" - "}
                    {exp.current ? "Present" : exp.end_date && new Date(exp.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </p>
                  {exp.description && (
                    <p className="text-sm mt-2 line-clamp-2">{exp.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(exp)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteExperience(exp.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
