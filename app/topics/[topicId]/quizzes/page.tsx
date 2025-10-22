import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Trophy } from "lucide-react"
import Link from "next/link"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function TopicQuizzesPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get topic details
  const { data: topic } = await supabase
    .from("topics")
    .select(
      `
      *,
      subject:subjects(*)
    `,
    )
    .eq("id", topicId)
    .single()

  if (!topic) {
    redirect("/dashboard")
  }

  // Get quizzes for this topic
  const { data: quizzes } = await supabase.from("quizzes").select("*").eq("topic_id", topicId).order("created_at")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href={`/subjects/${topic.subject.id}`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{topic.name}</h1>
              <p className="text-sm text-muted-foreground">
                {topic.subject.name} - Year {topic.year_group}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2 text-balance">Available Quizzes</h2>
          <p className="text-muted-foreground">Test your knowledge and earn points!</p>
        </div>

        {quizzes && quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow border-2 hover:border-blue-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant={
                        quiz.difficulty === "easy"
                          ? "secondary"
                          : quiz.difficulty === "medium"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {quiz.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Trophy className="h-4 w-4" />
                      <span>{quiz.points_reward} pts</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  <CardDescription className="mt-2">{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {quiz.time_limit_seconds && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Clock className="h-4 w-4" />
                      <span>{Math.floor(quiz.time_limit_seconds / 60)} minutes</span>
                    </div>
                  )}
                  <Button asChild className="w-full" style={{ backgroundColor: topic.subject.color || undefined }}>
                    <Link href={`/quiz/${quiz.id}`}>Start Quiz</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No quizzes available yet. Check back soon!</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
