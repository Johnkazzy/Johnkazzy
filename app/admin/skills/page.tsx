"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import type { Skill } from "@/lib/types"

export default function AdminSkillsPage() {
  const router = useRouter()
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newSkill, setNewSkill] = useState({ name: "", category: "", proficiency: 80 })
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    loadSkills()
  }, [])

  async function loadSkills() {
    const supabase = createClient()
    const { data } = await supabase.from("skills").select("*").order("sort_order")
    setSkills((data || []) as Skill[])
    setIsLoading(false)
  }

  async function addSkill(e: React.FormEvent) {
    e.preventDefault()
    if (!newSkill.name) return

    setIsAdding(true)
    const supabase = createClient()
    await supabase.from("skills").insert({
      name: newSkill.name,
      category: newSkill.category || null,
      proficiency: newSkill.proficiency,
      sort_order: skills.length,
    })
    setNewSkill({ name: "", category: "", proficiency: 80 })
    await loadSkills()
    setIsAdding(false)
  }

  async function deleteSkill(id: string) {
    if (!confirm("Delete this skill?")) return
    const supabase = createClient()
    await supabase.from("skills").delete().eq("id", id)
    await loadSkills()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || "Other"
    if (!acc[category]) acc[category] = []
    acc[category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Skills</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Add New Skill</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addSkill} className="flex flex-wrap gap-4">
            <Input
              placeholder="Skill name"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              className="flex-1 min-w-[200px]"
              required
            />
            <Input
              placeholder="Category (e.g., Frontend)"
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              className="w-[200px]"
            />
            <Input
              type="number"
              placeholder="Proficiency %"
              value={newSkill.proficiency}
              onChange={(e) => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) || 80 })}
              className="w-[120px]"
              min={0}
              max={100}
            />
            <Button type="submit" disabled={isAdding}>
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      {Object.keys(skillsByCategory).length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No skills added yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground group"
                    >
                      <span>{skill.name}</span>
                      <span className="text-xs text-muted-foreground">({skill.proficiency}%)</span>
                      <button
                        onClick={() => deleteSkill(skill.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
