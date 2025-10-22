import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function SubjectPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get subject details
  const { data: subject } = await supabase.from("subjects").select("*").eq("id", subjectId).single()

  if (!subject) {
    redirect("/dashboard")
  }

  // Get topics for this subject
  const { data: topics } = await supabase
    .from("topics")
    .select(
      `
      *,
      quizzes:quizzes(count)
    `,
    )
    .eq("subject_id", subjectId)
    .order("order_index")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="text-4xl">{subject.icon}</div>
              <div>
                <h1 className="text-2xl font-bold">{subject.name}</h1>
                <p className="text-sm text-muted-foreground">{subject.description}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2 text-balance">Choose a Topic</h2>
          <p className="text-muted-foreground">Select a topic to start practicing</p>
        </div>

        {topics && topics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <Card key={topic.id} className="hover:shadow-lg transition-shadow border-2 hover:border-blue-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{topic.name}</CardTitle>
                    <Badge variant="secondary">Year {topic.year_group}</Badge>
                  </div>
                  <CardDescription className="mt-2">{topic.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">
                      {(topic.quizzes as unknown as Array<{ count: number }>)?.[0]?.count || 0} quizzes available
                    </span>
                  </div>
                  <Button asChild className="w-full" style={{ backgroundColor: subject.color || undefined }}>
                    <Link href={`/topics/${topic.id}/quizzes`}>View Quizzes</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No topics available yet. Check back soon!</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
