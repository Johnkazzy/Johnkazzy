import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { BlogForm } from "../blog-form"
import type { BlogPost } from "@/lib/types"

interface Props {
  params: Promise<{ id: string }>
}

async function getBlogPost(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single()
  
  return data as BlogPost | null
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params
  const post = await getBlogPost(id)

  if (!post) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Edit Blog Post</h1>
      <BlogForm post={post} />
    </div>
  )
}
