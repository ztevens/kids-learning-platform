import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MainNav } from "@/components/navigation/main-nav"
import { Plus, BookOpen } from "lucide-react"
import Link from "next/link"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function SubjectTopicsPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params
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

  // Get subject details
  const { data: subject } = await supabase.from("subjects").select("*").eq("id", subjectId).single()

  // Get topics for this subject
  const { data: topics } = await supabase.from("topics").select("*").eq("subject_id", subjectId).order("title")

  if (!subject) {
    redirect("/admin/subjects")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <MainNav showBackButton={true} backHref="/admin/subjects" backLabel="Back to Subjects">
        <span className="text-lg font-semibold">Topics: {subject.name}</span>
        <Button className="gap-2" asChild>
          <Link href={`/admin/subjects/${subjectId}/topics/create`}>
            <Plus className="h-4 w-4" />
            Add Topic
          </Link>
        </Button>
      </MainNav>

      <main className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-4xl">{subject.icon}</div>
            <div>
              <h1 className="text-2xl font-bold">{subject.name}</h1>
              <p className="text-muted-foreground">{subject.description}</p>
            </div>
          </div>
        </div>

        {topics && topics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <Card key={topic.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {topic.title}
                  </CardTitle>
                  <CardDescription>{topic.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">Year {topic.year_group}</Badge>
                    <Badge variant="outline">{topic.difficulty_level}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/admin/topics/${topic.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/admin/topics/${topic.id}/quizzes`}>
                        Quizzes
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
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No topics found for this subject</p>
              <Button asChild>
                <Link href={`/admin/subjects/${subjectId}/topics/create`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Topic
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}