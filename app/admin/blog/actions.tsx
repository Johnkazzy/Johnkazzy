"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export function DeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this post?")) return
    
    setIsDeleting(true)
    const supabase = createClient()
    
    await supabase.from("blog_posts").delete().eq("id", id)
    router.refresh()
    setIsDeleting(false)
  }

  return (
    <Button 
      size="sm" 
      variant="destructive" 
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  )
}

export function TogglePublishButton({ id, published }: { id: string; published: boolean }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleToggle() {
    setIsLoading(true)
    const supabase = createClient()
    
    const updates: Record<string, unknown> = { published: !published }
    if (!published) {
      updates.published_at = new Date().toISOString()
    }
    
    await supabase.from("blog_posts").update(updates).eq("id", id)
    router.refresh()
    setIsLoading(false)
  }

  return (
    <Button 
      size="sm" 
      variant="ghost" 
      onClick={handleToggle}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : published ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </Button>
  )
}
