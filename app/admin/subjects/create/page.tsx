import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MainNav } from "@/components/navigation/main-nav"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function CreateSubjectPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <MainNav showBackButton={true} backHref="/admin/subjects" backLabel="Back to Subjects">
        <span className="text-lg font-semibold">Create Subject</span>
      </MainNav>

      <main className="container mx-auto p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create New Subject</CardTitle>
            <CardDescription>Add a new subject to the learning platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Subject Name</Label>
                <Input id="name" placeholder="e.g., Mathematics" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Brief description of the subject" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (Emoji)</Label>
                <Input id="icon" placeholder="📚" maxLength={2} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">Color Code</Label>
                <Input id="color" placeholder="#3B82F6" />
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">Create Subject</Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/subjects">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}