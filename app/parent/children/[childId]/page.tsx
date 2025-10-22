import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, TrendingUp, TrendingDown, Award, Calendar, Clock } from "lucide-react"
import Link from "next/link"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function ChildProgressPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get student details
  const { data: student } = await supabase
    .from("students")
    .select(
      `
      *,
      profile:profiles(full_name, email)
    `,
    )
    .eq("id", childId)
    .eq("parent_id", user.id)
    .single()

  if (!student) {
    redirect("/dashboard")
  }

  // Get weekly insights
  const { data: insights } = await supabase
    .from("weekly_insights")
    .select("*")
    .eq("student_id", childId)
    .order("week_start_date", { ascending: false })
    .limit(8)

  // Get recent quiz attempts
  const { data: recentAttempts } = await supabase
    .from("quiz_attempts")
    .select(
      `
      *,
      quiz:quizzes(
        title,
        topic:topics(
          name,
          subject:subjects(name, color)
        )
      )
    `,
    )
    .eq("student_id", childId)
    .order("completed_at", { ascending: false })
    .limit(10)

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
            <div>
              <h1 className="text-2xl font-bold">{student.profile?.full_name || "Student"}</h1>
              <p className="text-sm text-muted-foreground">Year {student.year_group} Progress Report</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-100">Total Points</CardDescription>
              <CardTitle className="text-4xl">{student.points}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-100">Current Level</CardDescription>
              <CardTitle className="text-4xl">{student.level}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="pb-3">
              <CardDescription className="text-orange-100">Learning Streak</CardDescription>
              <CardTitle className="text-4xl">{student.streak_days} days</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-100">Quizzes Completed</CardDescription>
              <CardTitle className="text-4xl">{recentAttempts?.length || 0}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Weekly Insights */}
        {insights && insights.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Weekly Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insights.map((insight) => (
                <Card key={insight.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Week of {new Date(insight.week_start_date).toLocaleDateString()}
                      </CardTitle>
                      <Badge variant="secondary">
                        <Award className="h-3 w-3 mr-1" />
                        {insight.average_score?.toFixed(0)}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Quizzes</p>
                          <p className="font-semibold">{insight.total_quizzes_completed}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Time</p>
                          <p className="font-semibold">{insight.total_time_spent_minutes} min</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-2">Average Score</p>
                      <Progress value={Number(insight.average_score) || 0} />
                    </div>

                    {insight.strengths && insight.strengths.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-green-600 mb-2">
                          <TrendingUp className="h-4 w-4" />
                          Strengths
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {insight.strengths.map((strength: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {insight.areas_for_improvement && insight.areas_for_improvement.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-orange-600 mb-2">
                          <TrendingDown className="h-4 w-4" />
                          Areas to Improve
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {insight.areas_for_improvement.map((area: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {recentAttempts && recentAttempts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Quiz Activity</h2>
            <div className="space-y-3">
              {recentAttempts.map((attempt) => {
                const percentage = (attempt.score / attempt.total_questions) * 100
                const passed = percentage >= 70

                return (
                  <Card key={attempt.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{attempt.quiz?.title || "Quiz"}</h4>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>
                              {attempt.quiz?.topic?.subject?.name} - {attempt.quiz?.topic?.name}
                            </span>
                            <span>{new Date(attempt.completed_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={passed ? "default" : "destructive"} className="mb-1">
                            {attempt.score}/{attempt.total_questions}
                          </Badge>
                          <p className="text-sm text-muted-foreground">{percentage.toFixed(0)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}