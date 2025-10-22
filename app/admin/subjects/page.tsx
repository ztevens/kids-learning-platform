import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MainNav } from "@/components/navigation/main-nav"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function AdminSubjectsPage() {
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

  // Get all subjects with topic counts
  const { data: subjects } = await supabase.from("subjects").select("*").order("name")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <MainNav showBackButton={true} backHref="/dashboard" backLabel="Dashboard">
        <span className="text-lg font-semibold">Subject Management</span>
        <Button className="gap-2" asChild>
          <Link href="/admin/subjects/create">
            <Plus className="h-4 w-4" />
            Add Subject
          </Link>
        </Button>
      </MainNav>

      <main className="container mx-auto p-6">
        {subjects && subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Card key={subject.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-4xl">{subject.icon}</div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{subject.name}</CardTitle>
                      <Badge variant="outline" style={{ borderColor: subject.color || undefined }}>
                        {subject.color}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{subject.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Year Groups: {subject.year_groups?.join(", ") || "All"}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                      <Link href={`/admin/subjects/${subject.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                      <Link href={`/admin/subjects/${subject.id}/topics`}>
                        View Topics
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No subjects found</p>
              <Button asChild>
                <Link href="/admin/subjects/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Subject
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
