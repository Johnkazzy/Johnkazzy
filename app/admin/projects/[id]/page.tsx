import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProjectForm } from "../project-form"
import type { Project } from "@/lib/types"

interface Props {
  params: Promise<{ id: string }>
}

async function getProject(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single()
  
  return data as Project | null
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params
  const project = await getProject(id)

  if (!project) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Edit Project</h1>
      <ProjectForm project={project} />
    </div>
  )
}
