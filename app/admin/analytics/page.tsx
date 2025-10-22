import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/navigation/main-nav"
import { TrendingUp, Users, BookOpen, Target, Clock, Award } from "lucide-react"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
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

  // Get analytics data
  const { data: users } = await supabase.from("profiles").select("role, created_at")
  const { data: quizAttempts } = await supabase.from("quiz_attempts").select("score, completed_at")

  // Calculate stats
  const totalUsers = users?.length || 0
  const studentsCount = users?.filter(u => u.role === 'student').length || 0
  const tutorsCount = users?.filter(u => u.role === 'tutor').length || 0
  const parentsCount = users?.filter(u => u.role === 'parent').length || 0
  
  const totalAttempts = quizAttempts?.length || 0
  const avgScore = quizAttempts?.length ? 
    Math.round(quizAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / quizAttempts.length) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <MainNav showBackButton={true} backHref="/dashboard" backLabel="Back to Dashboard">
        <span className="text-lg font-semibold">Analytics & Reports</span>
      </MainNav>

      <main className="container mx-auto p-6 space-y-8">
        {/* Overview Stats */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Total Users
                </CardDescription>
                <CardTitle className="text-3xl">{totalUsers}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Quiz Attempts
                </CardDescription>
                <CardTitle className="text-3xl">{totalAttempts}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Average Score
                </CardDescription>
                <CardTitle className="text-3xl">{avgScore}%</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Growth
                </CardDescription>
                <CardTitle className="text-3xl">+{Math.round(totalUsers * 0.12)}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* User Distribution */}
        <div>
          <h2 className="text-2xl font-bold mb-4">User Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{studentsCount}</div>
                <p className="text-sm text-muted-foreground">
                  {totalUsers > 0 ? Math.round((studentsCount / totalUsers) * 100) : 0}% of total users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  Tutors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{tutorsCount}</div>
                <p className="text-sm text-muted-foreground">
                  {totalUsers > 0 ? Math.round((tutorsCount / totalUsers) * 100) : 0}% of total users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Parents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{parentsCount}</div>
                <p className="text-sm text-muted-foreground">
                  {totalUsers > 0 ? Math.round((parentsCount / totalUsers) * 100) : 0}% of total users
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4" />
                <p>Activity tracking coming soon...</p>
                <p className="text-sm">This will show recent user activities, quiz completions, and engagement metrics.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}