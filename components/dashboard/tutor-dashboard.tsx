import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, Plus, Users, BookOpen, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

interface TutorDashboardProps {
  userId: string
  profile: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
}

export async function TutorDashboard({ userId, profile }: TutorDashboardProps) {
  const supabase = await createClient()

  // Get or create tutor record
  let { data: tutor } = await supabase.from("tutors").select("*").eq("profile_id", userId).single()

  if (!tutor) {
    const { data: newTutor } = await supabase
      .from("tutors")
      .insert({
        profile_id: userId,
        specialization: [],
        verified: false,
      })
      .select()
      .single()
    tutor = newTutor
  }

  // Get assignments created by this tutor
  const { data: assignments } = await supabase
    .from("assignments")
    .select(
      `
      *,
      student:students(
        profile:profiles(full_name)
      ),
      subject:subjects(name, color)
    `,
    )
    .eq("tutor_id", tutor?.id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Count assignments by status
  const assignedCount = assignments?.filter((a) => a.status === "assigned").length || 0
  const inProgressCount = assignments?.filter((a) => a.status === "in_progress").length || 0
  const submittedCount = assignments?.filter((a) => a.status === "submitted").length || 0
  const gradedCount = assignments?.filter((a) => a.status === "graded").length || 0

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
              <Badge variant="secondary">Tutor</Badge>
            </div>

            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-purple-600 text-white">
                  {profile.full_name?.charAt(0).toUpperCase() || "T"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="font-semibold">{profile.full_name}</p>
                <p className="text-xs text-muted-foreground">Tutor Account</p>
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Assigned
              </CardDescription>
              <CardTitle className="text-3xl">{assignedCount}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                In Progress
              </CardDescription>
              <CardTitle className="text-3xl">{inProgressCount}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Submitted
              </CardDescription>
              <CardTitle className="text-3xl">{submittedCount}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Graded
              </CardDescription>
              <CardTitle className="text-3xl">{gradedCount}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/tutor/assignments/create">
              <Plus className="h-5 w-5" />
              Create Assignment
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2 bg-transparent">
            <Link href="/tutor/students">
              <Users className="h-5 w-5" />
              View Students
            </Link>
          </Button>
        </div>

        {/* Recent Assignments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recent Assignments</h2>
            <Button asChild variant="ghost">
              <Link href="/tutor/assignments">View All</Link>
            </Button>
          </div>

          {assignments && assignments.length > 0 ? (
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{assignment.title}</h4>
                          <Badge
                            variant={
                              assignment.status === "graded"
                                ? "default"
                                : assignment.status === "submitted"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {assignment.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Student: {assignment.student?.profile?.full_name || "Unknown"}</span>
                          {assignment.subject && (
                            <Badge variant="outline" style={{ borderColor: assignment.subject.color || undefined }}>
                              {assignment.subject.name}
                            </Badge>
                          )}
                          {assignment.due_date && (
                            <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/tutor/assignments/${assignment.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No assignments yet</p>
                <Button asChild>
                  <Link href="/tutor/assignments/create">Create Your First Assignment</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
