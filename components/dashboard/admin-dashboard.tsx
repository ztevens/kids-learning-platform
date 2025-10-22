import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, Users, BookOpen, GraduationCap, TrendingUp } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

interface AdminDashboardProps {
  userId: string
  profile: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
}

export async function AdminDashboard({ profile }: AdminDashboardProps) {
  const supabase = await createClient()

  // Get platform statistics
  const { count: totalStudents } = await supabase.from("students").select("*", { count: "exact", head: true })

  const { count: totalTutors } = await supabase.from("tutors").select("*", { count: "exact", head: true })

  const { count: totalParents } = await supabase.from("parents").select("*", { count: "exact", head: true })

  const { count: totalQuizzes } = await supabase.from("quizzes").select("*", { count: "exact", head: true })

  const { count: totalAttempts } = await supabase.from("quiz_attempts").select("*", { count: "exact", head: true })

  const { count: totalAssignments } = await supabase.from("assignments").select("*", { count: "exact", head: true })

  // Get recent users
  const { data: recentProfiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  async function signOut() {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-blue-600">IYF STUDIO</h1>
              <Badge variant="destructive">Admin</Badge>
            </div>

            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-red-600 text-white">
                  {profile.full_name?.charAt(0).toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="font-semibold">{profile.full_name}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <form action={signOut}>
                <Button variant="ghost" size="icon">
                  <LogOut className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 space-y-8">
        {/* Platform Statistics */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Students
                </CardDescription>
                <CardTitle className="text-3xl">{totalStudents || 0}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Tutors
                </CardDescription>
                <CardTitle className="text-3xl">{totalTutors || 0}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Parents
                </CardDescription>
                <CardTitle className="text-3xl">{totalParents || 0}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Quizzes
                </CardDescription>
                <CardTitle className="text-3xl">{totalQuizzes || 0}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Attempts
                </CardDescription>
                <CardTitle className="text-3xl">{totalAttempts || 0}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Assignments
                </CardDescription>
                <CardTitle className="text-3xl">{totalAssignments || 0}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild size="lg" className="h-auto py-6 flex-col gap-2">
              <Link href="/admin/users">
                <Users className="h-6 w-6" />
                Manage Users
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-auto py-6 flex-col gap-2 bg-transparent">
              <Link href="/admin/content">
                <BookOpen className="h-6 w-6" />
                Manage Content
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-auto py-6 flex-col gap-2 bg-transparent">
              <Link href="/admin/subjects">
                <GraduationCap className="h-6 w-6" />
                Manage Subjects
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-auto py-6 flex-col gap-2 bg-transparent">
              <Link href="/admin/analytics">
                <TrendingUp className="h-6 w-6" />
                View Analytics
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent Users */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recent Users</h2>
            <Button asChild variant="ghost">
              <Link href="/admin/users">View All</Link>
            </Button>
          </div>

          {recentProfiles && recentProfiles.length > 0 ? (
            <div className="space-y-3">
              {recentProfiles.map((profile) => (
                <Card key={profile.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-blue-600 text-white">
                            {profile.full_name?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{profile.full_name || "Unknown User"}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{profile.email}</span>
                            <Badge variant="outline">{profile.role}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>Joined {new Date(profile.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No users found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
